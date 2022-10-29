from .BaseAnimation import BaseAnimation

class ColorSplit(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "ColorSplit"
    self.looping = False
    self.colors = self.ToRGB(['#880000', '#008800', '#000088'])
    self.numSections = 3
    self.sectionLength = int((self.NUM_PIXELS / self.numSections) + 0.5)

  def Step(self):
    self.AquireLock()
    for i in range(self.numSections):
      self.Fill(self.colors[i], i * self.sectionLength, self.sectionLength)
      # Find if there will be any unused pixels
    if self.numSections * self.sectionLength < self.NUM_PIXELS:
      remainderStart = self.numSections * self.sectionLength
      remainderLength = self.NUM_PIXELS - remainderStart
      # Fill remainder with last color
      # self.Fill(self.colors[self.numSections - 1], remainderStart, remainderLength)
      # Fill remainder with none
      self.Fill(None, remainderStart, remainderLength)
    self.FlipStrip()
    self.ReleaseLock()
    return True

  def Setup(self, args):
    colorsArg = next((obj['colors'] for obj in args if 'colors' in obj), None)
    if colorsArg:
      self.colors = self.ToRGB(colorsArg)
    self.numSections = len(self.colors)
    self.sectionLength = int((self.NUM_PIXELS / self.numSections) + 0.5)
