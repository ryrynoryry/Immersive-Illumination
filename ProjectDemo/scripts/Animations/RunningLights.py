from .BaseAnimation import BaseAnimation

from math import sin

class RunningLights(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "RunningLights"
    self.looping = True
    self.color = self.ToRGB(args[0]["value"])
    # TODO: Change all py's to set default values then call Setup.
    self.freq = float(int(args[1]["value"]) / 50)
    self.reverse = args[2]["value"]

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      if self.reverse == False:
        self.strip[i] = [int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                         int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                         int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
      else:
        self.strip[(self.NUM_PIXELS - 1)-i] = [int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[0] + 0.5),
                                               int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[1] + 0.5),
                                               int(((sin((i+self.stepCount)*self.freq) * 0.5) + 0.5) * self.color[2] + 0.5)]
    self.ReleaseLock()
    self.stepCount += 1
    return True

  def Setup(self, args):
    try:
      self.color = self.ToRGB(args[0]["value"])
      self.freq = int(args[1]["value"])
      if self.freq == 0:
        self.freq = 1
      self.reverse = args[2]["value"] == ''
    except ValueError as e:
      print(f"Error in layer {self.layer}: No change. {e}")
