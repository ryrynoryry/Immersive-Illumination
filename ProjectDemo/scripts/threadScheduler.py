import threading
import os.path
import time
import config
from LED_Sequences import * # Import all sequences
from LED_Controller import RenderLoop
import json
import sys
import importlib

from Animations import Error

def PollLEDSequence(path):
  """
  function to repeatedly read the LED_Sequence file to see which mode is selected and start the particular thread
  """
  count = 0
  jsonDict = None
  jsonCorrect = False
  localLayer = None
  localSequence = None
  lastFileTime = None

  # Array of flags to prevent console being drowned with error messages.
  layerMismatched = [False] * config.NUM_LAYERS
  invalidJson = [False] * config.NUM_LAYERS

  while config.run:
    count += 1
    # Check each layer.
    for l in config.LAYER_RANGE:
      # Set the file name for this layer.
      filePath = path + "layer" + str(l) + ".json"
      # Check if the file has not been modified in a while.
      fileTime = os.stat(filePath).st_mtime
      if lastFileTime == fileTime:
        # If so, sleep for a while then try again.
        # TODO: Need to change this since the loop manages multiple layers.
        # time.sleep(1)
        continue
      else:
        lastFileTime = fileTime

      # Input the layer file contents.
      with open(filePath, 'r') as f:
        jsonStringInput = f.read()

      # Parse json input
      try:
        jsonDict = json.loads(jsonStringInput)
      except ValueError as e: # Catch exception when the file is not in json format.
        # Check for exit condition
        if jsonStringInput == "exit":
          config.run = False
        jsonCorrect = False
      else:  # Execute if no exception is caught
        # Check required properties.
        if "sequence" in jsonDict and "layer" in jsonDict:
          jsonCorrect = True

      if jsonCorrect:
        # Input is in JSON format and contains the required fields.
        try:
          localLayer = int(jsonDict["layer"])
        except ValueError:
          # Layer element cannot be parsed to an int
          localLayer = None
        else:
          # Check if the layer written in the file matches the expected layer.
          if localLayer != l:
            if not layerMismatched[l]:
              print(f"Layer Mismatch: Expected: {l} Actual: {localLayer}")
              layerMismatched[l] = True
          else:
            layerMismatched[l] = False

          # Get the type of pattern to run.
          localSequence = jsonDict["sequence"]

          # Perform actions if the layer needs to be changed to a different pattern.
          if localSequence != config.layerManager[l]["name"]:

            config.layerManager[l]["name"] = localSequence
            config.layerManager[l]["nameChanged"] = True

            config.layerManager[l]["args"] = jsonDict["html"]
            config.layerManager[l]["argsChanged"] = True

            config.layerManager[l]["newAnimation"].set()
          # Perform these actions if the properties within the pattern have changed.
          elif jsonDict["html"] != config.layerManager[l]["args"]:
            config.layerManager[l]["args"] = jsonDict["html"]
            config.layerManager[l]["argsChanged"] = True

            config.layerManager[l]["newAnimation"].set()
          # else: # File has not changed to warrant a change in pattern.
          #   print(f'Continuing sequence: <{LEDSequence}>')
          invalidJson[l] = False
      else: # File is not in JSON format or does not contain the required fields.
        if not invalidJson[l]:
          print(f"Invalid JSON [layer{l}]: {jsonStringInput}")
          invalidJson[l] = True

    # Once all the layers are checked, sleep for a moment to yield to other threads.
    time.sleep(0.0001)
  # If we exit out of the while loop we are leaving the thread.
  print("Exiting PollLEDSequence thread")

def ManageLayer(layer):
  animationComplete = True
  animationLooping = False
  animation = None
  while config.run:
    # If the pattern has changed in some way (new patern or updated arguments) perform nececarry actions.
    if config.layerManager[layer]["nameChanged"]:
      animation = ChangeAnimation(config.layerManager[layer])
      animationLooping = animation.looping
      print(f"[{layer}] Changing Animation to: {config.layerManager[layer]['name']}")
    if config.layerManager[layer]["argsChanged"]:
      UpdateAnimation(animation, config.layerManager[layer])
      print(f"[{layer}] Updating Animation: {config.layerManager[layer]['name']}")
    # Increment the animation by one frame and sync with the next render time.
    if animation is not None:
      animationComplete = animation.Step()
      animation.FrameSync()
    # If there are no more frames to animate, sleep this thread until a new animation is set.
    if animationComplete and not animationLooping:
      print(f"[{layer}] Animation complete: {config.layerManager[layer]['name']}")
      config.layerManager[layer]["newAnimation"].clear()
      config.layerManager[layer]["newAnimation"].wait()

def ChangeAnimation(layerConfig):
  newClassName = layerConfig["name"]
  myModule = None
  animationClass = None
  # Lock to prevent threads from accessing sys.modules before an import for a class is complate.
  config.modulesLock.acquire()
  # Check if the class does not already exist in this python instance.
  if "Animations." + newClassName not in sys.modules:
    # Reset the cache.
    importlib.invalidate_caches()
    try:
      # Import the new class.
      myModule = importlib.import_module("Animations." + newClassName)
    except ModuleNotFoundError:
      # If the class does not have an associated "className.py" file, then show an error.
      myModule = Error
      newClassName = "Error"
    # Get an object of the class name.
    animationClass = getattr(myModule, newClassName)
  else:
      # Get an object of the class name.
    animationClass = getattr(sys.modules["Animations." + newClassName], newClassName)
  config.modulesLock.release()

  layerConfig["nameChanged"] = False
  return animationClass(layerConfig["layer"], layerConfig["args"])

def UpdateAnimation(animation, layerConfig):
  animation.Setup(layerConfig["args"])
  layerConfig["argsChanged"] = False

if __name__ == "__main__":

  # with open("../transfer/LED_Sequence", "w") as f:
  #   jsonString = '{"sequence": "Rain", "layer": "2"}'
  #   f.write(jsonString)

  # creating threads
  primaryThreads = []
  layerThreads = []

  # Thread to poll Sequence file to begin other threads
  primaryThreads.append(threading.Thread(
      target=PollLEDSequence, name='THREAD_Poll', args=('../ledlayers/',), daemon=True))
  # Thread to render the virtual pixel values to the physical strip
  primaryThreads.append(threading.Thread(
      target=RenderLoop, name='THREAD_Render', args=(), daemon=True))

  for l in config.LAYER_RANGE:
    layerThreads.append(threading.Thread(
        target=ManageLayer, name='THREAD_Layer_' + str(l), args=(l,), daemon=True))

  # starting primary threads
  for t in primaryThreads:
    t.start()

  for lt in layerThreads:
    lt.start()

  # Continue along main thread
  curpath = os.path.abspath(os.curdir)
  print("Current path is: %s" % (curpath))

  # Continuously poll keyboard input
  while config.run:
    # i = input("Enter text ('exit' to quit): ")
    # print(f'Input received: <{i}>')
    # if not i:
    #   break
    # with open("../transfer/LED_Sequence", "w") as f:
    #   f.write(i)
    time.sleep(0.01)
    pass
  print("Keyboard loop has exited")

  config.run = False

  for lt in layerThreads:
    lt.join()

  # wait until primary threads are completely executed
  for t in primaryThreads:
    t.join()

  # Clear the current patterns
  for l in config.LAYER_RANGE:
    # Set the file name for this layer.
    filePath = "../ledlayers/" + "layer" + str(l) + ".json"
    with open(filePath, "w") as f:
      f.write('')

  # All threads completely executed
  print("Goodbye!")