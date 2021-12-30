"""
File to house all of the shared global variables between the different files
"""
import threading

"""
LED Controller related globals
"""
NUM_PIXELS = 10  # The number of NeoPixels
LEDstrip = []
stripInitialized = False

prevFrameRendered = threading.Event()
curFrameRendering = threading.Event()

"""
LED Strip representation
"""
NUM_LAYERS = 5
# Create 2D array of parallel virtual strips
stripLayers = [[None] * NUM_PIXELS for i in range(NUM_LAYERS)]
stripLayersLocks = []
for i in range(NUM_LAYERS):
    stripLayersLocks.append(threading.Lock())

# Class example below:
# class Car:
#   def __init__(self, color, mileage, automatic):
#     self.color = color
#     self.mileage = mileage
#     self.automatic = automatic


"""
Threading globals
"""
threadPool = []
threadPoolRun = True
run = True

"""
Misc
"""
LEDSequence = ''