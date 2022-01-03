import threading
import os.path
import time
import config
from LED_Sequences import * # Import all sequences
from LED_Controller import RenderLoop
import json

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
    localfunc = None
    while config.run:
      count += 1
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
        """
        Input parsed properly. Perform actions.
        """
        try:
          localLayer = int(jsonDict["layer"])
          localfunc = globals()[jsonDict["sequence"]]
        except ValueError:
          # Layer element cannot be parsed to an int
          localLayer = None
          localfunc = None
          pass
        except KeyError:
          # Function does not exist for that sequence name
          localLayer = None
          localfunc = None
          pass
        else:
          # Bound the layer to the max and min values
          localLayer = max(localLayer, 0)  # Set Min
          localLayer = min(localLayer, config.NUM_LAYERS - 1)  # Set Max
          localSequence = jsonDict["sequence"]

          # Perform actions if the layer needs changing
          if localSequence != config.layerManager[localLayer]["sequence"]:
            # Set the sequence name
            config.layerManager[localLayer]["sequence"] = localSequence

            # Stop existing threads on the given layer
            if config.layerManager[localLayer]["thread"] is not None:
              print(f'Poll closing thread: <{config.layerManager[localLayer]["thread"].name}>')
              config.layerManager[localLayer]["run"] = False
              config.layerManager[localLayer]["thread"].join()
              config.layerManager[localLayer]["thread"] = None
            
            # Start new sequence on the given layer
            config.layerManager[localLayer]["sequence"] = localSequence
            print(f'New sequence selected: <{config.layerManager[localLayer]["sequence"]}>')
            config.layerManager[localLayer]["run"] = True
            config.layerManager[localLayer]["thread"] = threading.Thread(
                target=localfunc, name=f'THREAD_{localSequence}', args=(jsonDict,), daemon=True)
            config.layerManager[localLayer]["thread"].start()
        # else:
        #   print(f'Continuing sequence: <{LEDSequence}>')
      else:
        print(f"Invalid JSON: {jsonStringInput}")

      time.sleep(1)
    print("exiting PollLEDSequence thread")

if __name__ == "__main__":
    # creating threads
    primaryThreads = []

    # Thread to poll Sequence file to begin other threads
    primaryThreads.append(threading.Thread(
        target=PollLEDSequence, name='THREAD_Poll', args=('../transfer/',), daemon=True))
    # Thread to render the virtual pixel values to the physical strip
    primaryThreads.append(threading.Thread(
        target=RenderLoop, name='THREAD_Render', args=(), daemon=True))

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
      pass
    print("Keyboard loop has exited")

    for layer in config.layerManager:
      if layer["thread"] is not None:
        print(f'Closing layer {config.layerManager.index(layer)} thread: {layer["thread"].name}')
        layer["run"] = False
        layer["thread"].join()
        layer["thread"] = None
        layer["sequence"] = ''

    config.run = False
    # wait until primary threads are completely executed
    for t in primaryThreads:
      t.join()

    # Clear the current sequence
    with open("../transfer/LED_Sequence", "w") as f:
      f.write('')
  
    # All threads completely executed
    print("Goodbye!")