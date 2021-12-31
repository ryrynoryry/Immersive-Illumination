import time
import config
import random
"""
File containing each of the functions that run the LED Sequence loops.
"""

def Stop(X=0):
  while config.threadPoolRun:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [(0, 0, 0)] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
  else:
    config.prevFrameRendered.wait()
    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [None] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()


def Rain(X=0):
  while config.threadPoolRun:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    for i in range(config.NUM_PIXELS):
      config.stripLayers[X][i] = (0, 0, random.randint(5, 20))
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
  else:
    config.prevFrameRendered.wait()
    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [None] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()


def Red(X=0):
  while config.threadPoolRun:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [(255, 0, 0)] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
  else:
    config.prevFrameRendered.wait()
    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [None] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

def Green(X=0):
  config.stripLayers[X] = [(0, 0, 0)] * config.NUM_PIXELS
  while config.threadPoolRun:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    for i in range(0,3):
      if config.stripLayers[X][i][1] == 255:
        config.stripLayers[X][i] = (0, 0, 0)
      else:
        config.stripLayers[X][i] = (0, config.stripLayers[X][i][1] + 1, 0)
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
  else:
    config.prevFrameRendered.wait()
    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [None] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

def Chase(X=0):
  index = 0
  while config.threadPoolRun:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    if index < config.NUM_PIXELS:
      config.stripLayers[X][index] = (50, 50, 50)
      if index > 0:
        config.stripLayers[X][index - 1] = (0, 0, 0)
      index += 1
    else:
      config.stripLayers[X][config.NUM_PIXELS - 1] = (0, 0, 0)
      index = 0
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
  else:
    config.prevFrameRendered.wait()
    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [None] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

def Color(X=0):
  while config.threadPoolRun:
    print("Color")
    time.sleep(1)

def exit(X=0):
  while config.threadPoolRun:
    print("Exit function called")
    config.threadPoolRun = False
    config.run = False
