"""
File to house all of the shared global variables between the different files
"""
import threading

"""
LED Controller related globals
"""
NUM_PIXELS = 300  # The number of NeoPixels
PIXEL_RANGE = range(NUM_PIXELS)
LEDstrip = []
stripInitialized = False

prevFrameRendered = threading.Event()
curFrameRendering = threading.Event()

"""
LED Strip representation
"""
NUM_LAYERS = 5
LAYER_RANGE = range(NUM_LAYERS)
# Create 2D array of parallel virtual strips
stripLayers = [[None] * NUM_PIXELS for i in range(NUM_LAYERS)]
stripLayersLocks = []
for i in range(NUM_LAYERS):
  stripLayersLocks.append(threading.Lock())

layerAnimationSpeed = [1.0] * NUM_LAYERS

# Class example below:
# class Car:
#   def __init__(self, color, mileage, automatic):
#     self.color = color
#     self.mileage = mileage
#     self.automatic = automatic


"""
Threading globals
"""
run = True

layerManager = []
for i in range(NUM_LAYERS):
  layerManager.append({"layer": i,
                        "name": "", "nameChanged": False,
                        "args": [], "argsChanged": False,
                        "newAnimation": threading.Event()})


"""
Misc
"""

def Bound(n, maxIN, minIN = 0):
  if maxIN < minIN:
    maxn = minIN
    minn = maxIN
  return max(min(maxn, n), minn)

