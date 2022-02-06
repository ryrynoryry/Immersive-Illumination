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
      self.Fill((self.strip[0][0] + self.risingStepSize, 0, 0))
    elif self.stepCount > 5:
      self.Fill((max(0, self.strip[0][0] - self.fallingStepSize), 0, 0))
      if self.strip[0][0] == 0:
        self.Fill(None)
        self.ReleaseLock()
        return True
    self.ReleaseLock()
    self.stepCount += 1
    return False

  def Setup(self, args):
    self.AquireLock()
    self.Fill((0,0,0))
    self.ReleaseLock()
    self.stepCount = 0