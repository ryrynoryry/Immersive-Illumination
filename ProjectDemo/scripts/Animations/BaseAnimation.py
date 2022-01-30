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
    raise NotImplementedError(
      "Do not use BaseSequence directly, use a subclass with setup() implemented")

  def Step(self):
    raise NotImplementedError(
      "Do not use BaseSequence directly, use a subclass with step() implemented")

  def AquireLock(self):
    self.lock.acquire()
    pass

  def ReleaseLock(self):
    self.lock.release()
    pass

  def WaitForRenderingStart(self):
    curFrameRendering.wait()

  def WaitForRenderingComplete(self):
    prevFrameRendered.wait()

  def FrameSync(self):
    curFrameRendering.wait()
    prevFrameRendered.wait()

  def Wheel(self, position, random=False):
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
