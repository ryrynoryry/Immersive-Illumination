from .BaseAnimation import BaseAnimation

class Stop(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Stop"
    self.looping = False

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = (0, 0, 0)
    self.ReleaseLock()
    return True
