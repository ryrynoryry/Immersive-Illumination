import threading
import os.path
import time
import config
from LED_Sequences import *
from LED_Controller import RenderLoop

def PollLEDSequence(path):
    """
    function to repeatedly read the LED_Sequence file to see which mode is selected and start the particular thread
    """
    count = 0
    filePath = path + "LED_Sequence"
    func = None
    while config.run:
      count += 1
      lines = []
      with open(filePath, 'r') as f:
        lines = f.readlines()

      """
      Do whatever with the file contents
      """
      if len(lines) == 1:
        """
        Only a sequence name is listed. Run that sequence.
        """
        layerSelection = 0
        line1 = lines[0].split(',')
        if line1[0] != config.LEDSequence:
          try:
            func = globals()[line1[0]]
          except KeyError:
            # Function does not exist for that sequence name
            pass
          else:
            if len(line1) > 1:
              layerSelection = int(line1[1])
            config.threadPoolRun = False
            for thread in config.threadPool:
              print(f'Poll closing thread: <{thread.name}>')
              thread.join()
            config.threadPool.clear()
            config.threadPoolRun = True
            config.LEDSequence = line1[0]
            print(f'New sequence selected: <{config.LEDSequence}>')
            config.threadPool.append(threading.Thread(
                target=func, name=f'THREAD_{config.LEDSequence}', args=(layerSelection,), daemon=True))
            config.threadPool[-1].start()
          # else:
          #   print(f'Continuing sequence: <{LEDSequence}>')
      else:
        lineCount = 0
        for line in lines:
          lineCount += 1
          print(f'line {lineCount}: {line}')

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
      i = input("Enter text ('exit' to quit): ")
      print(f'Input received: <{i}>')
      if not i:
        break
      with open("../transfer/LED_Sequence", "w") as f:
        f.write(i)
    print("Keyboard loop has exited")

    config.run = False
    # wait until primary threads are completely executed
    for t in primaryThreads:
      t.join()

    config.threadPoolRun = False
    for thread in config.threadPool:
      print(f'Closing thread: {thread.name}')
      thread.join()

    # Clear the current sequence
    with open("../transfer/LED_Sequence", "w") as f:
      f.write('')
  
    # All threads completely executed
    print("Goodbye!")