import time
import config
import random
import LED_SharedPatterns
from Noise import fBmNoise

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

def LavaLamp(input):
  X = int(input["layer"])
  color1 = input["color"][0]
  color2 = input["color"][1]
  config.layerAnimationSpeed[X] = abs(float(input["speed"])) # 1 = 1 row between frames

  iteration = 0
  row = 0
  nextRow = 0
  transition = 0
  localStrip = [[color1[0], color1[1], color1[2]]] * config.NUM_PIXELS

  size, freq, octs, noise = 512, 1/64.0, 1, []
  for y in range(size):
    for x in range(size):
      # Execute noise function to add each pixel to a 1D list.
      noise.append(fBmNoise(x*freq, y*freq, int(size*freq), octs))

  # Normalize to [0,1] while converting to a 2D list of "size x size"
  myMax = max(noise)
  myMin = min(noise)
  noisePic = [[(noise[j * size + i] - myMin) / (myMax - myMin) for i in range(size)] for j in range(size)]

  # Start loop
  while config.layerManager[X]["run"]:
    row = int(iteration)
    nextRow = (row + 1) % size
    transition = iteration - row
    for i in config.PIXEL_RANGE:
      pixelColor = LED_SharedPatterns.Lerp(color1, color2, noisePic[row][i])
      nextPixelColor = LED_SharedPatterns.Lerp(color1, color2, noisePic[nextRow][i])
      localStrip[i] = [int(x + 0.5) for x in LED_SharedPatterns.Lerp(pixelColor, nextPixelColor, transition)]

    # Since the strip values were stored in a local copy, both waits can be done in one place.
    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    config.stripLayers[X] = localStrip.copy()
    config.stripLayersLocks[X].release()

    # Number of rows between each frame.
    # If the speed is < 1, linear interpolation will be used between rows.
    iteration += config.layerAnimationSpeed[X]
    if iteration >= size:
      iteration = iteration - int(iteration)

def clear(input):
  X = int(input["layer"])
  config.stripLayersLocks[X].acquire()
  config.stripLayers[X] = [None] * config.NUM_PIXELS
  config.stripLayersLocks[X].release()

def exit():
    print("Exit function called")
    config.run = False
