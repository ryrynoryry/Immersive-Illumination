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
  BRIGHTNESS = 1 #0.07
  while config.layerManager[X]["run"]:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    config.stripLayersLocks[X].acquire()
    for i in range(config.NUM_PIXELS):
      if not config.stripLayers[X][i] or config.stripLayers[X][i][2] == 0:
        config.stripLayers[X][i] = (0, 0, int(random.randint(int(255/4), 255) * BRIGHTNESS))
      elif random.randint(1, 4) == 1:
        config.stripLayers[X][i] = (0, 0, max(0,int(config.stripLayers[X][i][2] - (14 * BRIGHTNESS) + 0.5)))
    config.stripLayersLocks[X].release()

    # Wait until the current frame has started rendering
    config.curFrameRendering.wait()

def Lightning(input):
  X = int(input["layer"])
  illuminationArea = input["area"]
  BRIGHTNESS = 1.0
  lightningOver = False
  originalLightningColor = (255,255,255)
  lightningColor = [int((c * BRIGHTNESS) + 0.5) for c in originalLightningColor]
  SUB_BRIGHTNESS_PERCENT = 0.5 # Percentage of main strike brightness for sub strikes
  subLightningColor = [int((c * SUB_BRIGHTNESS_PERCENT) + 0.5) for c in lightningColor]
  MAX_SUBSTRIKES = 4
  subStrikes = random.randint(0, MAX_SUBSTRIKES)
  buildingStrikes = random.randint(0, 4)
  fadeSpeed = 50 * BRIGHTNESS # color values
  iteration = 0

  currentColor = [0,0,0]

  def Strike(color):
    nonlocal currentColor
    config.stripLayersLocks[X].acquire()
    for i in range(illuminationArea[0], illuminationArea[1]):
      currentColor = color
      config.stripLayers[X][i] = currentColor
    config.stripLayersLocks[X].release()

  def Fade():
    Strike([max(0, int((c - fadeSpeed) + 0.5)) for c in currentColor])

  while config.layerManager[X]["run"] and not lightningOver:
    # Wait until the previous frame is done rendering
    config.prevFrameRendered.wait()

    if buildingStrikes > 0:
      if iteration % 4 == 0:
        Strike(subLightningColor)
        buildingStrikes -= 1
      else:
        Fade()
    elif buildingStrikes in range(0,-3,-1): # Number of frames before fading
      Strike(lightningColor) # BIG STRIKE
      buildingStrikes -= 1
    else:
      Fade()
      if random.randint(0,4) == 0 and subStrikes > 0:
        Strike(subLightningColor)
        subStrikes -= 1
      elif subStrikes == 0:
        if random.randint(0, 4) == 0:
          Strike([int((c * 1.25) + 0.5) for c in currentColor])

      if currentColor == [0, 0, 0]:
        config.stripLayersLocks[X].acquire()
        for i in range(illuminationArea[0], illuminationArea[1]):
          config.stripLayers[X][i] = None
        config.stripLayersLocks[X].release()
        lightningOver = False

    iteration += 1

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


# void RunningLights(byte red, byte green, byte blue, int WaveDelay) {
#     int Position = 0

#     for(int j=0
#         j < NUM_LEDS*2
#         j++)
#     {
#         Position++
#         // = 0
#         // Position + Rate
#         for(int i=0
#             i < NUM_LEDS
#             i++) {
#             // sine wave, 3 offset waves make a rainbow!
#             // float level = sin(i+Position) * 127 + 128
#             // setPixel(i, level, 0, 0)
#             // float level = sin(i+Position) * 127 + 128
#             setPixel(i, ((sin(i+Position) * 127 + 128)/255)*red,
#                      ((sin(i+Position) * 127 + 128)/255)*green,
#                      ((sin(i+Position) * 127 + 128)/255)*blue)
#         }

#         showStrip()
#         delay(WaveDelay)
#     }
# }

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
