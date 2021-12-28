import time
import config

"""
File containing each of the functions that run the LED Sequence loops.
"""

def Stop():
  while config.threadPoolRun:
    print("Stop")
    time.sleep(1)


def Rain():
  while config.threadPoolRun:
    print("Rain")
    time.sleep(1)


def Color():
  while config.threadPoolRun:
    print("Color")
    time.sleep(1)


def exit():
  while config.threadPoolRun:
    print("Exit function called")
    config.threadPoolRun = False
