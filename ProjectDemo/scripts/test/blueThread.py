from time import sleep
import random


def MainBlue(inputVar):
  for i in range(20):
    print("[{1}] Value is: {0}.".format(inputVar[0], i))
    sleep(1)
  print("Exiting MainBlue func")

if __name__ == "__main__":
  print("Starting MainBlue")
  MainBlue([True])
  print("Exited MainBlue")

