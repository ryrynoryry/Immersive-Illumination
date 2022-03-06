from .BaseAnimation import BaseAnimation

class Chase(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Chase"
    self.looping = True
    self.pos = 0
    self.color = self.ToRGB(args[0]["value"])

  def Step(self):
    self.AquireLock()
    if self.pos < self.NUM_PIXELS:
      self.strip[self.pos] = self.color
      if self.pos > 0:
        self.strip[self.pos - 1] = None
      self.pos += 1
    else:
      self.strip[self.NUM_PIXELS - 1] = None
      self.pos = 0
    self.ReleaseLock()
    self.stepCount += 1
    return True

  def Setup(self, args):
    self.pos = 0
    self.color = self.ToRGB(args[0]["value"])
