"""
File to contain all the LED library specific functionality
"""

import time
import os
if os.name == 'nt': # On Windows
  import tkinter # Simulated LED strip GUI
else: # Linux on pi
  import board # Hardware interface
  import neopixel # NeoPixel LED Library

import config
import LED_SharedPatterns

root = None
canvas = None
sqList = None

def InitializePixels(pixelBrightness = 1.0):

  if os.name != 'nt':
    # NeoPixels must be connected to pins D10, D12, D18 or D21 to work.
    HARDWARE_PIN = board.D18

    # The order of the pixel colors - RGB or GRB (RGBW or GRBW)
    ORDER = neopixel.GRB

    # Deallocate NeoPixel object before re-initializing it.
    if config.stripInitialized:
      config.LEDstrip.deinit()
      pass

    config.LEDstrip = neopixel.NeoPixel(
        HARDWARE_PIN, config.NUM_PIXELS, brightness=pixelBrightness, auto_write=False, pixel_order=ORDER
    )
    print("Physical LEDs initialized")
  else:
    # TKINTER
    global root
    global canvas
    global sqList

    root = tkinter.Tk(baseName="Virtual Strip")
    root.configure(background='black') # Black background
    root.title("Virtual Strip") # Title
    root.attributes('-topmost', True) # Always on top
    # root.overrideredirect(True) # Remove toolbar and clear from taskbar
    root.geometry("+0+100")

    canvas = tkinter.Canvas(root, bg="black", height=2*32, width=2500)
    sqList = [None] * config.NUM_PIXELS
    closeBtn = tkinter.Button(root, text="X", command=lambda:root.destroy(), background="gray")
    closeBtn.place(x=0, y=0)

    color = (255,128,64)
    margin = 16
    padding = 3
    size = 32
    for i in range(len(sqList)):
      sqList[i] = canvas.create_rectangle(
        i*size + margin + padding, # Left
        margin, # Top
        margin + (i+1)*size, # Right
        margin + size, # Bottom
        fill=LED_SharedPatterns.tuple2hex(color),
        outline="#555555", width=2)
    canvas.pack()

    config.LEDstrip = [(0,0,0)] * config.NUM_PIXELS
    print("Simulated LEDs initialized")

  FillStrip(config.LEDstrip, (0, 0, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.2)

# Red
  FillStrip(config.LEDstrip, (255, 0, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.3)

  FillStrip(config.LEDstrip, (0, 0, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.2)
# Green
  FillStrip(config.LEDstrip, (0, 255, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.3)

  FillStrip(config.LEDstrip, (0, 0, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.2)
# Blue
  FillStrip(config.LEDstrip, (0, 0, 255))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.3)

  FillStrip(config.LEDstrip, (0, 0, 0))
  UpdateStrip(config.LEDstrip)
  time.sleep(0.2)
# White
  FillStrip(config.LEDstrip, (255, 255, 255))
  UpdateStrip(config.LEDstrip)
  time.sleep(1.0)

  FillStrip(config.LEDstrip, (0, 0, 0))
  UpdateStrip(config.LEDstrip)

  config.stripInitialized = True

def RenderPixels(localStripLayers):
  # Copy layers to local structure
  for i in range(config.NUM_LAYERS):
    if config.stripLayersLocks[i].acquire(False):
      localStripLayers[i] = config.stripLayers[i].copy()
      config.stripLayersLocks[i].release()
    else:
      print(f'Layer {i} busy. ({config.layerManager[i]["name"]})')

  # Copy pixel layers from top to bottom to the strip
  for i in range(config.NUM_PIXELS):
    for layer in reversed(localStripLayers):
      if layer[i] is not None:
        config.LEDstrip[i] = layer[i]
        break
    else:
      # If no break was reached, all values were None so set the pixel to zeros
      config.LEDstrip[i] = (0, 0, 0)

  UpdateStrip(config.LEDstrip)

def RenderLoop():
  FRAME_RATE = 1 / 60 # 60Hz (Reality is slower than this. ~15ms per frame)
  # Create empty pixel layers.
  localLayers = [[None] * config.NUM_PIXELS for i in config.LAYER_RANGE]

  InitializePixels(0.2)

  frameCount = 0
  # secondStart = time.time()
  # secondFrames = 0
  while config.run:
    config.prevFrameRendered.clear()
    config.curFrameRendering.set()

    # Stop sequence calculations now to sync with the frame time

    frameStart = time.time()
    if frameCount % 100 == 0:
      print(f'Frame {frameCount}')
    RenderPixels(localLayers)

    config.curFrameRendering.clear()
    config.prevFrameRendered.set()

    # Start sequence calculations now

    frameCount += 1
    # secondFrames += 1
    # Calculate the time needed to wait until the next frame.
    timeUntilNextFrame = (frameStart + FRAME_RATE) - time.time()
    # print(f'Time to sleep: {timeUntilNextFrame}')
    # Only sleep if we are not behind schedule. Alternative: time.sleep(max(timeUntilNextFrame, 0.0))
    if timeUntilNextFrame > 0.0:
      time.sleep(timeUntilNextFrame)
      pass

    # secondDuration = time.time() - secondStart
    # if secondDuration >= 1.0:
    #   print(f"Frames rendered in {secondDuration} seconds: {secondFrames}")
    #   secondFrames = 0
    #   secondStart = time.time()
  else:

    localLayers = [[(0, 0, 0)] * config.NUM_PIXELS for i in range(config.NUM_LAYERS)]
    RenderPixels(localLayers)

    if config.stripInitialized:
      config.LEDstrip.deinit()
      pass

    config.prevFrameRendered.set()
    config.curFrameRendering.set()
    print("exiting RenderLoop thread")


def FillStrip(strip, color):
  if os.name == 'nt':
    for i in config.PIXEL_RANGE:
      strip[i] = color
  else:
    strip.fill(color)

def UpdateStrip(strip):
  if os.name == 'nt':
    global root
    global canvas
    global sqList
    try:
      for i in range(config.NUM_PIXELS):
        canvas.itemconfigure(sqList[i], fill=LED_SharedPatterns.tuple2hex(strip[i]))
      root.update()
    except tkinter.TclError as e:
      print("GUI was closed")
      root.quit()
      config.run = False
      pass
  else:
    strip.show()




