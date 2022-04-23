from .BaseAnimation import BaseAnimation
import random

class Lightning(BaseAnimation):
  def __init__(self, layer, args):
      super().__init__(layer)
      self.name = "Lightning"
      self.looping = False
      try:
        self.brightness = float(max(min(int(float(args[0]["value"])), 100),0)) / 100.0
        self.illuminationArea = [max(min(int(float(args[1]["value"])), int(float(args[2]["value"]))), 0),
                                 min(max(int(float(args[1]["value"])), int(float(args[2]["value"]))), self.NUM_PIXELS - 1)]  # [StartPos, EndPos]
      except ValueError as e:
        self.brightness = 1.0
        self.illuminationArea = [0, self.NUM_PIXELS - 1]
      self.lightningOver = False
      self.originalLightningColor = (255, 255, 255)
      self.lightningColor = [int((c * self.brightness) + 0.5) for c in self.originalLightningColor]
      self.SUB_BRIGHTNESS_PERCENT = 0.5 # Percentage of main strike brightness for sub strikes
      self.subLightningColor = [int((c * self.SUB_BRIGHTNESS_PERCENT) + 0.5) for c in self.lightningColor]
      self.MAX_SUBSTRIKES = 10
      self.subStrikes = random.randint(0, self.MAX_SUBSTRIKES)
      self.buildingStrikes = random.randint(0, 6)
      self.MAIN_HOLD = 5 # Number of frames to hold the main strike
      self.fadeSpeed = 50 * self.brightness  # color values
      self.currentColor = [0, 0, 0]
      self.MIN_VALUES = [24, 26, 20]

  def Step(self):
    # Num strikes to build up before the main strike
    if self.buildingStrikes > 0:
      if self.stepCount % 4 == 0: # Strike every 4th step, and fade for the rest
        self.Strike(self.subLightningColor)
        self.buildingStrikes -= 1
      else:
        self.Fade()
    elif self.buildingStrikes in range(0, -self.MAIN_HOLD, -1):  # Second parameter is the number of frames to hold the big strike
      self.Strike(self.lightningColor)  # BIG STRIKE
      self.buildingStrikes -= 1
    else: # Begin fading after main strike
      self.Fade() # Only fade if none of the following conditions are true
      if random.randint(0, 8) == 0 and self.subStrikes > 0: # For each frame after the main strike, there is a 1/4 chance to substrike (if any remain)
        self.Strike(self.subLightningColor)
        self.subStrikes -= 1
      elif self.subStrikes == 0:
        if random.randint(0, 4) == 0:
          self.Strike([min(int((c * 1.25) + 0.5), 255) for c in self.currentColor]) # Strike one last time, 0.25 times brighter

      # If the strikes have completely faded, clear the strip and end the animation.
      if self.currentColor == [0, 0, 0]:
        self.AquireLock()
        for i in range(self.illuminationArea[0], self.illuminationArea[1]):
          self.strip[i] = None
        self.ReleaseLock()
        return True

    self.stepCount += 1
    return False

  def Setup(self, args):
    self.AquireLock()
    for i in range(self.illuminationArea[0], self.illuminationArea[1]):
      self.strip[i] = None
    self.ReleaseLock()
    try:
      self.brightness = float(max(min(int(float(args[0]["value"])), 100), 0)) / 100.0
      self.illuminationArea = [max(min(int(float(args[1]["value"])), int(float(args[2]["value"]))), 0),
                               min(max(int(float(args[1]["value"])), int(float(args[2]["value"]))), self.NUM_PIXELS - 1)]  # [StartPos, EndPos] Default: [50, 160]
      self.lightningColor = [int((c * self.brightness) + 0.5) for c in self.originalLightningColor]
      self.subLightningColor = [int((c * self.SUB_BRIGHTNESS_PERCENT) + 0.5) for c in self.lightningColor]
      self.subLightningColor = [max(e1, e2) for e1, e2 in zip(self.subLightningColor, self.MIN_VALUES)] # Ensure the minimum values are satisfied
      self.fadeSpeed = 50 * self.brightness  # color values
    except ValueError as e:
      pass

    self.subStrikes = random.randint(0, self.MAX_SUBSTRIKES)
    self.buildingStrikes = random.randint(0, 4)
    self.stepCount = 0

  def Strike(self, color):
    self.AquireLock()
    self.currentColor = color
    for i in range(self.illuminationArea[0], self.illuminationArea[1]):
      self.strip[i] = self.currentColor
    self.ReleaseLock()

  def Fade(self):
    self.Strike([max(0, int((c - self.fadeSpeed) + 0.5)) for c in self.currentColor])