from .BaseAnimation import BaseAnimation
# from Noise import fBmNoise
from PIL import Image
from os.path import exists

class LavaLamp(BaseAnimation):
  def __init__(self, layer, args):
    super().__init__(layer)
    self.name = "LavaLamp"
    self.looping = True
    self.color1 = self.ToRGB(args[0]["value"])
    self.color2 = self.ToRGB(args[1]["value"])
    self.speed = float(args[2]["value"])/25

    self.iteration = 0
    self.row = 0
    self.nextRow = 0
    self.transition = 0
    self.finalRow = 2048
    self.noisePic = None
    self.needNewPic = True

    self.localStrip = [[self.color1[0], self.color1[1], self.color1[2]]] * self.NUM_PIXELS

  def Step(self):
    self.row = int(self.iteration)
    if self.speed >= 1:
      for i in range(self.NUM_PIXELS):
        self.localStrip[i] = [int(x + 0.5) for x in self.Lerp(self.color1, self.color2, self.noisePic[self.row][i]/128)]
    else:
      self.nextRow = (self.row + 1) % self.finalRow
      self.transition = self.iteration - self.row # Fractional value between the two rows
      for i in range(self.NUM_PIXELS):
        pixelColor = self.Lerp(self.color1, self.color2, self.noisePic[self.row][i]/128)
        nextPixelColor = self.Lerp(self.color1, self.color2, self.noisePic[self.nextRow][i]/128)
        self.localStrip[i] = [int(x + 0.5) for x in self.Lerp(pixelColor, nextPixelColor, self.transition)]

    self.AquireLock()
    for i in range(self.NUM_PIXELS):
      self.strip[i] = self.localStrip[i]
    self.ReleaseLock()

    # Number of rows between each frame.
    # If the speed is < 1, linear interpolation will be used between rows.
    self.iteration += self.speed
    if self.iteration >= self.finalRow:
      self.iteration = self.iteration - self.finalRow

    return True

  def Setup(self, args):
    self.color1 = self.ToRGB(args[0]["value"])
    self.color2 = self.ToRGB(args[1]["value"])
    self.speed = float(args[2]["value"])/25

    if self.speed >= 1.0:
      self.iteration = self.iteration - int(self.iteration)

    imageIndex = 0
    octaves = 1
    period = 64
    if self.needNewPic:
      self.noisePic = self.GetNoiseFile(imageIndex, octaves, period)
      self.needNewPic = False

  def GetNoiseFile(self, imgIndex, octaves, period):
    fileName = "noise/noise%03d_%01d_%03d.png" % (imgIndex, octaves, period)
    if (not exists(fileName)):
      fileName = "noise/noise%03d_%01d_%03d.png" % (0, octaves, period)

    # https://stackoverflow.com/a/41925811
    im = Image.open(fileName)
    data = list(im.getdata())
    data2D = [data[i:(i+im.width)] for i in range(0, len(data), im.width)]
    return data2D

