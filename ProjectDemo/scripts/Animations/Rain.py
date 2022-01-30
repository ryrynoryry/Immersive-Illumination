from .BaseAnimation import BaseAnimation
import random

class Rain(BaseAnimation):
  def __init__(self, layer, args):
      super().__init__(layer)
      self.name = "Rain"
      self.looping = True
      # self.color = self.ToRGB(args[0]["value"])
      self.BRIGHTNESS = 1.0 # 0.07

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      if not self.strip[i] or self.strip[i][2] == 0:
        self.strip[i] = (0, 0, int(random.randint(int(255/4), 255) * self.BRIGHTNESS))
      elif random.randint(1, 4) == 1:
        self.strip[i] = (0, 0, max(0,int(self.strip[i][2] - (14 * self.BRIGHTNESS) + 0.5)))
    self.ReleaseLock()
    return True
