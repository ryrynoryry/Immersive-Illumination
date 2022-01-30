from .BaseAnimation import BaseAnimation

class Clear(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Clear"
    self.looping = False

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = None
    self.ReleaseLock()
    return True
