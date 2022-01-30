import threading
import os.path
import time
import config
from LED_Sequences import * # Import all sequences
from LED_Controller import RenderLoop
import json
import sys
import importlib

def PollLEDSequence(path):
  """
  function to repeatedly read the LED_Sequence file to see which mode is selected and start the particular thread
  """
  count = 0
  filePath = path + "LED_Sequence"
  jsonDict = None
  jsonCorrect = False
  localLayer = None
  localSequence = None
  lastFileTime = None
  while config.run:
    count += 1

    fileTime = os.stat(filePath).st_mtime
    if lastFileTime != fileTime:
      lastFileTime = fileTime
    else:
      time.sleep(1)
      continue

    with open(filePath, 'r') as f:
      jsonStringInput = f.read()

    # Parse json input
    try:
      jsonDict = json.loads(jsonStringInput)
    except ValueError as e:
      # Check for exit condition
      if jsonStringInput == "exit":
        exit() # Call to: LED_Sequences.exit()
      jsonCorrect = False
    else:
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
        # Bound the layer to the max and min values
        localLayer = max(localLayer, 0)  # Set Min
        localLayer = min(localLayer, config.NUM_LAYERS - 1)  # Set Max
        localSequence = jsonDict["sequence"]

        # Perform actions if the layer needs changing
        if localSequence != config.layerManager2[localLayer]["name"]:

         config.layerManager2[localLayer]["name"] = localSequence
         config.layerManager2[localLayer]["nameChanged"] = True

         config.layerManager2[localLayer]["args"] = jsonDict["html"]
         config.layerManager2[localLayer]["argsChanged"] = True

         config.layerManager2[localLayer]["newAnimation"].set()

        else:
          if jsonDict["html"] != config.layerManager2[localLayer]["args"]:
            config.layerManager2[localLayer]["args"] = jsonDict["html"]
            config.layerManager2[localLayer]["argsChanged"] = True
          # else:
          #   print(f'Continuing sequence: <{LEDSequence}>')
    else:
      print(f"Invalid JSON: {jsonStringInput}")

    time.sleep(1)
  print("exiting PollLEDSequence thread")

def ManageLayer(layer):
  animationComplete = True
  animationLooping = False
  animation = None
  while config.run:
    if config.layerManager2[layer]["nameChanged"]:
      animation = ChangeAnimation(config.layerManager2[layer])
      animationLooping = animation.looping

    if config.layerManager2[layer]["argsChanged"]:
      UpdateAnimation(animation, config.layerManager2[layer])
    if animation is not None:
      animation.FrameSync()
      animationComplete = animation.Step()
    if animationComplete and not animationLooping:
      config.layerManager2[layer]["newAnimation"].clear()
      config.layerManager2[layer]["newAnimation"].wait()

def ChangeAnimation(layerConfig):
  newClassName = layerConfig["name"]
  myModule = None
  if "Animations." + newClassName not in sys.modules:
    importlib.invalidate_caches()
    myModule = importlib.import_module("Animations." + newClassName)
  animationClass = getattr(myModule, newClassName)
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
      target=PollLEDSequence, name='THREAD_Poll', args=('../transfer/',), daemon=True))
  # Thread to render the virtual pixel values to the physical strip
  primaryThreads.append(threading.Thread(
      target=RenderLoop, name='THREAD_Render', args=(), daemon=True))

  for l in config.LAYER_RANGE:
    layerThreads.append(threading.Thread(
        target=ManageLayer, name='THREAD_Layer_' + str(l), args=(l,), daemon=True))

  for lt in layerThreads:
    lt.start()

  # starting primary threads
  for t in primaryThreads:
    t.start()

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

  # for layer in config.layerManager:
  #   if layer["thread"] is not None:
  #     print(f'Closing layer {config.layerManager.index(layer)} thread: {layer["thread"].name}')
  #     layer["run"] = False
  #     layer["thread"].join()
  #     layer["thread"] = None
  #     layer["sequence"] = ''

  config.run = False

  for lt in layerThreads:
    lt.join()

  # wait until primary threads are completely executed
  for t in primaryThreads:
    t.join()

  # Clear the current sequence
  with open("../transfer/LED_Sequence", "w") as f:
    f.write('')

  # All threads completely executed
  print("Goodbye!")