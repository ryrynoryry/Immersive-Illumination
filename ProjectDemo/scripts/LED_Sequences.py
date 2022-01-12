import time
import config
import random
"""
File containing each of the functions that run the LED Sequence loops.
"""

def Stop(input):
  X = int(input["layer"])
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [(0, 0, 0)] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Rain(input):
  X = int(input["layer"])
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    for i in range(config.NUM_PIXELS):
      config.stripLayers[X][i] = (0, 0, random.randint(5, 20))
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Red(input):
  X = int(input["layer"])
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = [(255, 0, 0)] * config.NUM_PIXELS
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Green(input):
  X = int(input["layer"])
  numPixelsToSet = 3
  for i in range(numPixelsToSet):
    config.stripLayers[X][i] = (0, 0, 0)
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    for i in range(numPixelsToSet):
      if config.stripLayers[X][i][1] == 255:
        config.stripLayers[X][i] = (0, 0, 0)
      else:
        config.stripLayers[X][i] = (0, config.stripLayers[X][i][1] + 1, 0)
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Chase(input):
  X = int(input["layer"])
  BRIGHTNESS = 255 # 50
  index = 0
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    if index < config.NUM_PIXELS:
      config.stripLayers[X][index] = (BRIGHTNESS, BRIGHTNESS, BRIGHTNESS)
      if index > 0:
        config.stripLayers[X][index - 1] = None
      index += 1
    else:
      config.stripLayers[X][config.NUM_PIXELS - 1] = None
      index = 0
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Color(input):
  X = int(input["layer"])
  while config.layerManager[X]["run"]:
    print("Color")
    time.sleep(1)

def clear(input):
  X = int(input["layer"])
  config.stripLayersLocks[X].acquire()
  config.stripLayers[X] = [None] * config.NUM_PIXELS
  config.stripLayersLocks[X].release()

def exit():
    print("Exit function called")
    config.run = False
