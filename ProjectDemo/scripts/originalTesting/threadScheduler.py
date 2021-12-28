import threading
import os.path
import time
from blueThreadLoop import MainBlue


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

run = True
runBlue = [True]

fileName = ""


def LookForFile(strToFind, path):
    """
    function repeatedly look for a file
    """
    # t1.setName("Finder")
    global fileName
    global run
    count = 0
    filePath = path + strToFind
    while run:
      count += 1
      if os.path.exists(filePath):
        fileName = strToFind
        print("{0} FOUND {1} at {2} [{3}]".format(
            t1.getName(), strToFind, filePath, count))
        MainBlue(runBlue)
        run = False
      else:
        print("{0} not found {1} at {2} [{3}]".format(
            t1.getName(), strToFind, filePath, count))
      time.sleep(1)
    print("exiting file thread!")


def LookForStop(strToFind, path):
    """
    function repeatedly look for a file
    """
    global run
    count = 0
    filePath = path + strToFind
    while run:
      count += 1
      if os.path.exists(filePath):
        runBlue[0] = False
        run = False
        print("{0} FOUND {1} at {2} [{3}]".format(
            t2.getName(), strToFind, filePath, count))
      else:
        print("{0} not found {1} at {2} [{3}]".format(
            t2.getName(), strToFind, filePath, count))
      time.sleep(10)
    print("exiting stop thread!")


if __name__ == "__main__":

    # creating thread
    t1 = threading.Thread(
        target=LookForFile, name="THREAD_Finder", args=("rain", "../"), daemon=True)
    t2 = threading.Thread(name="THREAD_Stopper",
                          target=LookForStop, args=("stop", "../"), daemon=True)

    # starting thread 1
    t1.start()
    # starting thread 2
    t2.start()
    while run:
      print("doing nothing...")
      time.sleep(20)

    # input("Press Enter to flip foo")
    # if runBlue[0]:
    #   runBlue[0] = False
    # else:
    #   runBlue[0] = True
    runBlue[0] = False
    # input("Press Enter to exit")
    run = False

    # wait until thread 1 is completely executed
    t1.join()
    # wait until thread 2 is completely executed
    t2.join()

    # both threads completely executed
    print("Done!")
