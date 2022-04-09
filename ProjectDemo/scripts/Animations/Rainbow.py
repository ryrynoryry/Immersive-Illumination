from .BaseAnimation import BaseAnimation
import random

class Rainbow(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "Rainbow"
    self.looping = True
    self.brightness = float(int(args[0]["value"])) / 100.0 # Default: 100
    self.speed = int(args[1]["value"]) # Default: 1 [-25, 25]
    self.brightness = max(0.0, min(self.brightness, 1.0))

  def Step(self):
    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      pixel_index = ((i * 256) // self.NUM_PIXELS) + self.stepCount
      self.strip[i] = [int((x * self.brightness) + 0.5) for x in self.Wheel(pixel_index & 255)]
    self.ReleaseLock()
    self.stepCount += int(self.speed)
    self.stepCount %= 255
    return True

  def Setup(self, args):
    try:
      self.brightness = float(int(args[0]["value"])) / 100.0  # Default: 100
      self.speed = int(args[1]["value"])  # Default: 1 [-25, 25]
      self.brightness = max(0.0, min(self.brightness, 1.0))
    except ValueError as e:
      print(f"Error in layer {self.layer}: No change. {e}")
