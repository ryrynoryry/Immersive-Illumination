import threading
import os.path
import time
import config
from LED_Sequences import *
# from blueThreadLoop import MainBlue


# class myThread (threading.Thread):
#   def __init__(self, threadID, name, counter):
#     threading.Thread.__init__(self)
#     self.threadID = threadID
#     self.name = name
#     self.counter = counter
#   def run(self):
#     print("Starting " + self.name)
#     print_time(self.name, 5, self.counter)
#     print("Exiting " + self.name)

# threadPool = []
# threadPoolRun = True

# run = True
# LEDSequence = ''
# runBlue = [True]

# fileName = ""

# def LookForFile(strToFind, path):
#     """
#     function repeatedly look for a file
#     """
#     global fileName
#     global run
#     count = 0
#     filePath = path + strToFind
#     while run:
#       count += 1
#       if os.path.exists(filePath):
#         fileName = strToFind
#         print("{0} FOUND {1} at {2} [{3}]".format(t1.getName(), strToFind, filePath, count))
#         MainBlue(runBlue)
#         run = False
#       else:
#         print("{0} not found {1} at {2} [{3}]".format(t1.getName(), strToFind, filePath, count))
#       time.sleep(1)
#     print("exiting file thread!")

# def LookForStop(strToFind, path):
#     """
#     function repeatedly look for a file
#     """
#     global run
#     count = 0
#     filePath = path + strToFind
#     while run:
#       count += 1
#       if os.path.exists(filePath):
#         runBlue[0] = False
#         run = False
#         print("{0} FOUND {1} at {2} [{3}]".format(t2.getName(), strToFind, filePath, count))
#       else:
#         print("{0} not found {1} at {2} [{3}]".format(t2.getName(), strToFind, filePath, count))
#       time.sleep(10)
#     print("exiting stop thread!")

def PollLEDSequence(path):
    """
    function to repeatedly read the LED_Sequence file to see which mode is selected and start the particular thread
    """
    global threadPool
    global threadPoolRun
    global run
    global LEDSequence
    count = 0
    filePath = path + "LED_Sequence"
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
        if lines[0] != config.LEDSequence:
          config.threadPoolRun = False
          for thread in config.threadPool:
            print(f'Poll closing thread: <{thread.name}>')
            thread.join()
          config.threadPool.clear()
          config.threadPoolRun = True
          config.LEDSequence = lines[0]
          print(f'New sequence selected: <{config.LEDSequence}>')
          config.threadPool.append(threading.Thread(target=globals()[config.LEDSequence], name=f'THREAD_{config.LEDSequence}', args=(''), daemon=True))
          config.threadPool[-1].start()
        # else:
        #   print(f'Continuing sequence: <{LEDSequence}>')
      else:
        lineCount = 0
        for line in lines:
          lineCount += 1
          print(f'line {lineCount}: {line}')

      time.sleep(1)
    print("exiting PollLEDSequence thread!")

if __name__ == "__main__":
    # creating thread
    t1 = threading.Thread(target=PollLEDSequence, name='THREAD_Poll', args=('../transfer/',), daemon=True)
    # t2 = threading.Thread(target=LookForFile, name="THREAD_Finder", args=("rain","../"), daemon=True)
    # t3 = threading.Thread(name="THREAD_Stopper", target=LookForStop, args=("stop","../"), daemon=True)

    # starting threads
    t1.start()
    # t2.start()
    # t3.start()

    curpath = os.path.abspath(os.curdir)
    print("Current path is: %s" % (curpath))

    while config.run:
      i = input("Enter text ('exit' to quit): ")
      print(f'Input received: <{i}>')
      if not i:
        break
      with open("../transfer/LED_Sequence", "w") as f:
        f.write(i)
      if i == 'exit':
        break
    print("While loop has exited")

    # input("Press Enter to flip foo")
    # if runBlue[0]:
    #   runBlue[0] = False
    # else:
    #   runBlue[0] = True
    # runBlue[0] = False
    # input("Press Enter to exit")

    config.run = False
    # wait until threads are completely executed
    t1.join()
    # t2.join()
    # t3.join()

    config.threadPoolRun = False
    for thread in config.threadPool:
      print(f'Closing thread: {thread.name}')
      thread.join()

    # Clear the current sequence
    with open("../transfer/LED_Sequence", "w") as f:
      f.write('')
  
    # both threads completely executed
    print("Done!")