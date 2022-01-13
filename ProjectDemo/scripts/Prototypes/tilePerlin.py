# https://gamedev.stackexchange.com/questions/23625/how-do-you-generate-tileable-perlin-noise

import random
import math
from PIL import Image

import matplotlib.pyplot as plt

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

def fBm(x, y, per, octs):
    val = 0
    for o in range(octs):
        val += 0.5**o * noise(x*2**o, y*2**o, per*2**o)
    return val

size, freq, octs, data = 512, 1/64.0, 1, []
for y in range(size):
    for x in range(size):
        data.append(fBm(x*freq, y*freq, int(size*freq), octs))

# Save data as an image and save in current working directory
im = Image.new("L", (size, size))
im.putdata(data, 128, 128)
im.save("noise.png")

# MY CODE BELOW
myMax = 0
myMin = 1
mySum = 0

myMax = max(data)
myMin = min(data)
myAvg = sum(data) / len(data)

print(f"Prelim Max: {myMax}")
print(f"Prelim Min: {myMin}")
print(f"Prelim Avg: {myAvg}")
pic = [[(data[j * size + i] - myMin) / (myMax - myMin) for i in range(size)] for j in range(size)]

mySum = 0
myMax = 0
myMin = 1
for y in range(size):
  for x in range(size):
    mySum += pic[y][x]
    myMax = max(myMax, pic[y][x])
    myMin = min(myMin, pic[y][x])
avg = mySum / (size * size)
print(f"Final Max: {myMax}")
print(f"Final Min: {myMin}")
print(f"Final Avg: {avg}")

# Show matplotlib plot window
plt.imshow(pic, cmap='gray')
plt.show()
