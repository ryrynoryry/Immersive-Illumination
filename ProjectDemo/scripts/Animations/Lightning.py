from .BaseAnimation import BaseAnimation
import random

class Lightning(BaseAnimation):
  def __init__(self, layer, args):
      super().__init__(layer)
      self.name = "Lightning"
      self.looping = False
      self.illuminationArea = args[0]["value"] # [StartPos, EndPos]
      self.BRIGHTNESS = 1.0
      self.lightningOver = False
      self.originalLightningColor = (255, 255, 255)
      self.lightningColor = [int((c * self.BRIGHTNESS) + 0.5) for c in self.originalLightningColor]
      self.SUB_BRIGHTNESS_PERCENT = 0.5 # Percentage of main strike brightness for sub strikes
      self.subLightningColor = [int((c * self.SUB_BRIGHTNESS_PERCENT) + 0.5) for c in self.lightningColor]
      self.MAX_SUBSTRIKES = 4
      self.subStrikes = random.randint(0, self.MAX_SUBSTRIKES)
      self.buildingStrikes = random.randint(0, 4)
      self.MAIN_HOLD = 3 # Number of frames to hold the main strike
      self.fadeSpeed = 50 * self.BRIGHTNESS  # color values
      self.currentColor = [0, 0, 0]

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
      if random.randint(0, 4) == 0 and self.subStrikes > 0: # For each frame after the main strike, there is a 1/4 chance to substrike (if any remain)
        self.Strike(self.subLightningColor)
        self.subStrikes -= 1
      elif self.subStrikes == 0:
        if random.randint(0, 4) == 0:
          self.Strike([int((c * 1.25) + 0.5) for c in self.currentColor]) # Strike one last time, 0.25 times brighter

      # If the strikes have completelf faded, clear the strip and end the animation.
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
    self.illuminationArea = args[0]["value"] # [StartPos, EndPos]
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