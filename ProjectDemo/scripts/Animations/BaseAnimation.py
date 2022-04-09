from config import NUM_PIXELS, stripLayers, stripLayersLocks, curFrameRendering, prevFrameRendered
# Base Animation class that implements nearly all necessary functionality.
# Implementing classes must override the step() method
class BaseAnimation():
  def __init__(self, layer):
    self.name = "Default"
    self.NUM_PIXELS = NUM_PIXELS
    self.layer = layer
    self.lock = stripLayersLocks[layer]
    self.strip = stripLayers[layer]
    self.stepCount = 0
    self.looping = False

  def Setup(self, args):
    # If a subclass does not have Setup() implemented, no action will be taken
    pass

  def Step(self):
    raise NotImplementedError(
      "Do not use BaseSequence directly, use a subclass with step() implemented")

  def AquireLock(self):
    self.lock.acquire()

  def ReleaseLock(self):
    self.lock.release()

  def WaitForRenderingStart(self):
    curFrameRendering.wait()

  def WaitForRenderingComplete(self):
    prevFrameRendered.wait()

  def FrameSync(self):
    curFrameRendering.wait()
    prevFrameRendered.wait()

  def Fill(self, color):
    for i in range(self.NUM_PIXELS):
      self.strip[i] = color

  def ToRGB(self, hex):
    r,g,b = (None,None,None)
    if isinstance(hex, str):
      r, g, b = bytes.fromhex(hex.replace('#', ''))
    else:
      r = hex[0]
      g = hex[1]
      b = hex[2]
    return (r, g, b)

  def Lerp(self, start, end, t=0.5):
    # (1-t) * start + t * end
    return [(1-t) * start[i] + t * end[i] for i in range(min(len(start), len(end)))]

  def Wheel(self, pos):
    # Input a value 0 to 255 to get a color value.
    # The colors are a transition r - g - b - back to r.
    if pos < 0 or pos > 255:
      r = g = b = 0
    elif pos < 85:
      r = int(pos * 3)
      g = int(255 - pos * 3)
      b = 0
    elif pos < 170:
      pos -= 85
      r = int(255 - pos * 3)
      g = 0
      b = int(pos * 3)
    else:
      pos -= 170
      r = 0
      g = int(pos * 3)
      b = int(255 - pos * 3)
    return [r, g, b]

  def Wheel2(self, position, random=False):
    r = 0
    g = 0
    b = 0

    if position / 128 == 0:
      r = 127 - position % 128
      g = position % 128
      b = 0
    elif position / 128 == 1:
      g = 127 - position % 128
      b = position % 128
      r = 0
    elif position / 128 == 2:
      b = 127 - position % 128
      r = position % 128
      g = 0

    return [r, g, b]

  def __repr__(self):
    return self.name

  def __del__(self):
    print('Destructor called: ' + self.name)
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = None
    self.ReleaseLock()
