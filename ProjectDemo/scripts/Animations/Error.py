from .BaseAnimation import BaseAnimation

class Error(BaseAnimation):
  def __init__(self, layer, args):
      super().__init__(layer)
      self.name = "Error"
      self.looping = False
      self.levels = 10
      self.apexMet = False
      self.risingStepSize = 50
      self.fallingStepSize = 25

  def Step(self):
    self.AquireLock()
    if self.stepCount < 5:
      for i in range(self.NUM_PIXELS):
        self.strip[i] = (self.strip[i][0] + self.risingStepSize, 0, 0)
    elif self.stepCount > 5:
      for i in range(self.NUM_PIXELS):
        self.strip[i] = (max(0, self.strip[i][0] - self.fallingStepSize), 0, 0)
      if self.strip[0][0] == 0:
        for i in range(self.NUM_PIXELS):
          self.strip[i] = None
        self.ReleaseLock()
        return True
    self.ReleaseLock()
    self.stepCount += 1
    return False

  def Setup(self, args):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = (0,0,0)
    self.ReleaseLock()
    self.stepCount = 0