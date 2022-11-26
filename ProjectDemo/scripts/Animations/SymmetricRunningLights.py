from .BaseAnimation import BaseAnimation

from math import cos

class SymmetricRunningLights(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "SymmetricRunningLights"
    self.looping = True
    self.color = self.ToRGB(args[0]["value"])
    # TODO: Change all py's to set default values then call Setup.
    self.freq = float(int(args[1]["value"]) / 500)
    self.speed = float((int(args[2]["value"]) - 75) / 100)
    self.center = int(args[3]["value"])
    self.reverse = args[4]["value"] == "true"

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      if self.reverse == False:
        if i < self.center:
          self.strip[i] = [int(((-cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                           int(((-cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                           int(((-cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
        else:
          self.strip[i] = [int(((cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                           int(((cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                           int(((cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
      else:
        if i < self.center:
          self.strip[i] = [int(((-cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                           int(((-cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                           int(((-cos((i-self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
        else:
          self.strip[i] = [int(((cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                           int(((cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                           int(((cos((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
    self.ReleaseLock()
    self.stepCount += 1
    return True

  def Setup(self, args):
    try:
      self.color = self.ToRGB(args[0]["value"])
      self.freq = float(int(args[1]["value"]) / 500)
      self.speed = float((int(args[2]["value"]))) / (100)
      self.center = int(args[3]["value"])
      self.reverse = args[4]["value"] == "true"
    except ValueError as e:
      print(f"Error in layer {self.layer}: No change. {e}")
