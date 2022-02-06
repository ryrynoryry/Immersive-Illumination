from .BaseAnimation import BaseAnimation

class ColorFill(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "ColorFill"
    self.looping = False
    self.color = self.ToRGB(args[0]["value"])

  def Step(self):
    self.AquireLock()
    self.Fill(self.color)
    self.ReleaseLock()
    return True

  def Setup(self, args):
    self.color = self.ToRGB(args[0]["value"])
