from .BaseAnimation import BaseAnimation
from Noise import fBmNoise

class LavaLamp(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "LavaLamp"
    self.looping = True
    self.color1 = self.ToRGB(args[0]["value"])
    self.color2 = self.ToRGB(args[1]["value"])
    self.speed = abs(float(args[2]["value"]))

    self.iteration = 0
    self.row = 0
    self.nextRow = 0
    self.transition = 0
    self.size = 512
    self.noisePic = None

    self.localStrip = [[self.color1[0], self.color1[1], self.color1[2]]] * self.NUM_PIXELS

  def Step(self):
    self.row = int(self.iteration)
    self.nextRow = (self.row + 1) % self.size
    self.transition = self.iteration - self.row
    for i in range(self.NUM_PIXELS):
      pixelColor = self.Lerp(
          self.color1, self.color2, self.noisePic[self.row][i])
      nextPixelColor = self.Lerp(
          self.color1, self.color2, self.noisePic[self.nextRow][i])
      self.localStrip[i] = [int(x + 0.5) for x in self.Lerp(pixelColor, nextPixelColor, self.transition)]

    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = self.localStrip[i]
    self.ReleaseLock()

    # Number of rows between each frame.
    # If the speed is < 1, linear interpolation will be used between rows.
    self.iteration += self.speed
    if self.iteration >= self.size:
      self.iteration = self.iteration - int(self.iteration)

    return True

  def Setup(self, args):
    freq, octs, noise = 1/64.0, 1, []
    for y in range(self.size):
      for x in range(self.size):
        # Execute noise function to add each pixel to a 1D list.
        noise.append(fBmNoise(x*freq, y*freq, int(self.size*freq), octs))
      print(f"Working on row: {y}")

    # Normalize to [0,1] while converting to a 2D list of "size x size"
    myMax = max(noise)
    myMin = min(noise)
    self.noisePic = [[(noise[j * self.size + i] - myMin) / (myMax - myMin)
                      for i in range(self.size)] for j in range(self.size)]

