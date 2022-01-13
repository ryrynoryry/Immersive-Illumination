# This file contains the functions needed to generate 
# tileable Fractal Brownian Noise, which is very similar to Perlin Noise.
# The 'period' can be modified to change the interval of which the "texture" tiles.
# This code was originaly taken from the following StackExchange answer:
# https://gamedev.stackexchange.com/a/23705

import random
import math

period = 256
perm = list(range(period))
random.shuffle(perm)
perm += perm
dirs = [(math.cos(a * 2.0 * math.pi / period),
         math.sin(a * 2.0 * math.pi / period))
        for a in range(period)]

def noise(x, y, per):

  def surflet(gridX, gridY):
    distX, distY = abs(x-gridX), abs(y-gridY)
    polyX = 1 - 6*distX**5 + 15*distX**4 - 10*distX**3
    polyY = 1 - 6*distY**5 + 15*distY**4 - 10*distY**3
    hashed = perm[perm[int(gridX) % per] + int(gridY) % per]
    grad = (x-gridX)*dirs[hashed][0] + (y-gridY)*dirs[hashed][1]
    return polyX * polyY * grad

  intX, intY = int(x), int(y)
  return (surflet(intX+0, intY+0) + surflet(intX+1, intY+0) +
          surflet(intX+0, intY+1) + surflet(intX+1, intY+1))


def fBmNoise(x, y, per, octs):
  val = 0
  for o in range(octs):
    val += 0.5**o * noise(x*2**o, y*2**o, per*2**o)
  return val
