# This file contains the functions needed to generate 
# tileable Fractal Brownian Noise, which is very similar to Perlin Noise.
# The 'period' can be modified to change the interval of which the "texture" tiles.
# This code was originaly taken from the following StackExchange answer:
# https://gamedev.stackexchange.com/a/23705

import random
import math
from PIL import Image
from os.path import exists

import matplotlib.pyplot as plt

# If iterations == 1, it will return the noise image
def GenerateNoiseImage(iterations):

  # Declare variables
  period = 512
  ySizeMultiple = 4
  perm = list(range(period))
  # random.seed(0)
  random.shuffle(perm)
  perm += perm
  dirs = [(math.cos(a * 2.0 * math.pi / period),
          math.sin(a * 2.0 * math.pi / period))
          for a in range(period)]

  # Define inner functions
  def noise(x, y, per):

    def surflet(gridX, gridY):
      distX, distY = abs(x-gridX), abs(y-gridY)
      polyX = 1 - 6*distX**5 + 15*distX**4 - 10*distX**3
      polyY = 1 - 6*distY**5 + 15*distY**4 - 10*distY**3
      hashed = perm[min(perm[min(int(gridX) % per, len(perm) - 1)] + int(gridY) % (per * ySizeMultiple), len(perm) - 1)]
      grad = (x-gridX)*dirs[hashed][0] + (y-gridY)*dirs[hashed][1]
      return polyX * polyY * grad

    intX, intY = int(x), int(y)
    return (surflet(intX+0, intY+0) + surflet(intX+1, intY+0) +
            surflet(intX+0, intY+1) + surflet(intX+1, intY+1))

  def fBm(x, y, per, octs):
    val = 0
    for o in range(octs):
      val += 0.5**o * noise(x*2**o, y*2**o, per*2**o)
    return val

  # Perform actions to Generate Noise Image
  for saveCount in range(iterations):
    perm = list(range(period))
    # random.seed(0)
    random.shuffle(perm)
    perm += perm
    dirs = [(math.cos(a * 2.0 * math.pi / period),
            math.sin(a * 2.0 * math.pi / period))
            for a in range(period)]

    size, data = period, []
    factors = [n for n in range(3, size + 1) if size % n == 0] # Search for factors greater than 2
    frequencies = [1/float(f) for f in factors]
    maxOctaves = 5
    for octaves in range(1, maxOctaves):
      for freq in frequencies:
        data = []
        for y in range(size * ySizeMultiple):
            for x in range(size):
                data.append(fBm(x*freq, y*freq, int(size*freq), octaves))

        # Save data as an image and save in current working directory
        im = Image.new("L", (size, size * ySizeMultiple))
        im.putdata(data, 128, 128)

        fileCount = 0
        while exists("noise/noise%03d_%01d_%03d.png" % (fileCount, octaves, int(1/freq))):
            fileCount += 1
        fileName = "noise/noise%03d_%01d_%03d.png" % (fileCount, octaves, int(1/freq))
        im.save(fileName)
        print(f"Saved image for variant: {saveCount} (octaves: {octaves}, frequency {int(1/freq)})")

        # Evaluate the image to get average pixel values.
        # myMax = 0
        # myMin = 1
        # mySum = 0

        # myMax = max(data)
        # myMin = min(data)
        # myAvg = sum(data) / len(data)

        # print(f"Prelim Max: {myMax}")
        # print(f"Prelim Min: {myMin}")
        # print(f"Prelim Avg: {myAvg}")
        # pic = [[(data[j * size + i] - myMin) / (myMax - myMin) for i in range(size)] for j in range(size)]

        # mySum = 0
        # myMax = 0
        # myMin = 1
        # for y in range(size):
        #   for x in range(size):
        #     mySum += pic[y][x]
        #     myMax = max(myMax, pic[y][x])
        #     myMin = min(myMin, pic[y][x])
        # avg = mySum / (size * size)
        # print(f"Final Max: {myMax}")
        # print(f"Final Min: {myMin}")
        # print(f"Final Avg: {avg}")

        # Show matplotlib plot window
        # plt.imshow(pic, cmap='gray')
        # plt.show()

        if iterations == 1:
          data = list(im.getdata())
          data2D = [data[i:(i+im.width)] for i in range(0, len(data), im.width)]
          return data2D

if __name__ == "__main__":
  GenerateNoiseImage(10)