from .BaseAnimation import BaseAnimation

class Red(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Red"
    self.looping = False

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = (255, 0, 0)
    self.ReleaseLock()
    return True
