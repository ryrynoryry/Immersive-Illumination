from .BaseAnimation import BaseAnimation

class Green(BaseAnimation):
  def __init__(self, layer, args):
      super().__init__(layer)
      self.name = "Green"
      self.looping = True
      self.numPixels = args[0]["value"]

  def Step(self):
    self.AquireLock()
    for i in range(self.numPixels):
      self.strip[i] = (0, self.stepCount % 256, 0)
    self.ReleaseLock()
    self.stepCount += 1
    return True

  def Setup(self, args):
    self.AquireLock()
    for i in range(self.numPixels):
      self.strip[i] = None
    self.ReleaseLock()
    self.numPixels = args[0]["value"]