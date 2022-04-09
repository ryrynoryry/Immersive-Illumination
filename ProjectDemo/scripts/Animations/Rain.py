from .BaseAnimation import BaseAnimation
import random

class Rain(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Rain"
    self.looping = True
    # self.color = self.ToRGB(args[0]["value"])
    self.brightness = float(int(args[0]["value"])) / 100.0 # Default: 11 | 15
    self.fadeAmount = (float(int(args[1]["value"])) / 100.0) * 255 # Default: 7 | 6
    self.fadeChance = int(args[2]["value"]) # Default: 4 | 6
    self.brightness = max(0.0, min(self.brightness, 1.0))
    self.fadeAmount = max(0.0, self.fadeAmount)
    self.fadeChance = max(1, self.fadeChance)
    self.targetColors = [[0, 0, 0]] * self.NUM_PIXELS
    self.swellPercents = [0.0] * self.NUM_PIXELS
    self.SWELL_STEP = 0.1 # 10%

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      # If None or 0 and done swelling, reset to random value.
      if not self.strip[i] or (self.strip[i][2] == 0 and self.swellPercents[i] >= 1.0):
        # Set target color to be random blue from [63, 255] modified by the brightness.
        self.targetColors[i] = [0, 0, int((random.randint(int(255/4), 255) * self.brightness) + 0.5)]
        self.swellPercents[i] = self.SWELL_STEP
        # Set strip color to the starting percentange of the target color.
        self.strip[i] = [min(int((self.swellPercents[i] * color) + 0.5),255) for color in self.targetColors[i]]
        self.swellPercents[i] += self.SWELL_STEP
      # If this pixel gets a fade chance and it is out of the swelling stage, fade the color.
      elif random.randint(1, self.fadeChance) == 1 and self.swellPercents[i] >= 1.0:
        self.strip[i] = (0, 0, max(0, int(self.strip[i][2] - (self.fadeAmount * self.brightness) + 0.5)))
      else:
        if self.swellPercents[i] < 1.0:
          # While the color is swelling, set the strip color to the swell percentange of the target color.
          self.strip[i] = [min(int((self.swellPercents[i] * color) + 0.5), color) for color in self.targetColors[i]]
          self.swellPercents[i] += self.SWELL_STEP
    self.ReleaseLock()
    return True

  def Setup(self, args):
    try:
      self.brightness = float(int(args[0]["value"])) / 100.0 # Default: 11
      self.fadeAmount = (float(int(args[1]["value"])) / 100.0) * 255 # Default: 14
      self.fadeChance = int(args[2]["value"]) # Default: 4
      self.brightness = max(0.0, min(self.brightness, 1.0))
      self.fadeAmount = max(0.0, self.fadeAmount)
      self.fadeChance = max(1, self.fadeChance)
    except ValueError as e:
      print(f"Error in layer {self.layer}: No change. {e}")
