from .BaseAnimation import BaseAnimation

from math import cos
from math import pi

class SymmetricRunningLights(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "SymmetricRunningLights"
    self.looping = True
    self.color = self.ToRGB(args[0]["value"])
    # TODO: Change all py's to set default values then call Setup.
    self.freq = int(args[1]["value"])
    self.speed = float(int(args[2]["value"]) / 100)
    self.center = int(args[3]["value"])
    self.reverse = -1 if args[4]["value"] == "true" else 1

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = [int(((cos(((pi/self.freq) * abs(i-self.center)) - (self.stepCount * self.speed * self.reverse)) * 0.5) + 0.5) * self.color[0] + 0.5),
                       int(((cos(((pi/self.freq) * abs(i-self.center)) - (self.stepCount * self.speed * self.reverse)) * 0.5) + 0.5) * self.color[1] + 0.5),
                       int(((cos(((pi/self.freq) * abs(i-self.center)) - (self.stepCount * self.speed * self.reverse)) * 0.5) + 0.5) * self.color[2] + 0.5)]
    self.ReleaseLock()
    self.stepCount += 1
    return True

  def Setup(self, args):
    try:
      self.color = self.ToRGB(args[0]["value"])
      self.freq = max(int(args[1]["value"]), 0)
      self.speed = float(int(args[2]["value"]) / 100)
      self.center = int(args[3]["value"])
      self.reverse = -1 if args[4]["value"] == "true" else 1
    except ValueError as e:
      print(f"Error in layer {self.layer}: No change. {e}")
