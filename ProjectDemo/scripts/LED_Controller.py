"""
File to contain all the LED library specific functionality
"""

# import board
# import neopixel
import time
import config

def InitializePixels(pixelBrightness = 1.0):
  # NeoPixels must be connected to pins D10, D12, D18 or D21 to work.
  # HARDWARE_PIN = board.D18

  # The order of the pixel colors - RGB or GRB (RGBW or GRBW)
  # ORDER = neopixel.GRB

  # Deallocate NeoPixel object before re-initializing it.
  if config.stripInitialized:
    # config.LEDstrip.deinit()
    pass

  # config.LEDstrip = neopixel.NeoPixel(
  #     HARDWARE_PIN, config.NUM_PIXELS, brightness=pixelBrightness, auto_write=False, pixel_order=ORDER
  # )
  config.LEDstrip = [(0,0,0)] * config.NUM_PIXELS

  config.stripInitialized = True

def RenderPixels(localStripLayers):
  # Copy layers to local structure
  for i in range(config.NUM_LAYERS):
    if config.stripLayersLocks[i].acquire(False):
      localStripLayers[i] = config.stripLayers[i].copy()
      config.stripLayersLocks[i].release()
    else:
      print(f'Layer {i} busy')

  # Iterate over the strip layers to print
  for i in range(config.NUM_PIXELS):
    for layer in reversed(localStripLayers):
      if layer[i] is not None:
        config.LEDstrip[i] = layer[i]
        break

  # config.LEDstrip.show()
  print(config.LEDstrip)

def RenderLoop():
  FRAME_RATE = 1 / 30 # 30Hz
  localLayers = [None] * config.NUM_LAYERS

  InitializePixels(1.0)

  frameCount = 0
  # secondStart = time.time()
  # secondFrames = 0
  while config.run:
    config.prevFrameRendered.clear()
    config.curFrameRendering.set()

    # Stop sequence calculations now to sync with the frame time

    frameStart = time.time()
    print(f'Frame {frameCount}')
    RenderPixels(localLayers)

    config.curFrameRendering.clear()
    config.prevFrameRendered.set()

    # Start sequence calculations now

    frameCount += 1
    # secondFrames += 1
    # Calculate the time needed to wait until the next frame.
    timeUntilNextFrame = (frameStart + FRAME_RATE) - time.time()
    print(f'Time to sleep: {timeUntilNextFrame}')
    # Only sleep if we are not behind schedule. Alternative: time.sleep(max(timeUntilNextFrame, 0.0))
    if timeUntilNextFrame > 0.0:
      time.sleep(timeUntilNextFrame)
      pass
    # secondDuration = time.time() - secondStart
    # if secondDuration >= 1.0:
    #   print(f"Frames rendered in {secondDuration} seconds: {secondFrames}")
    #   secondStart = time.time()
    #   secondFrames = 0
  else:
    config.prevFrameRendered.set()
    config.curFrameRendering.set()
    print("exiting RenderLoop thread")
