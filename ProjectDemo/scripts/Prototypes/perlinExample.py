# https://pypi.org/project/perlin-noise/

import matplotlib.pyplot as plt
# from collections.abc import Iterable
from perlin_noise import PerlinNoise

noise = PerlinNoise(octaves=5, seed=1)
xpix, ypix = 300, 150
pic = [[noise([i/xpix, j/ypix]) for j in range(xpix)] for i in range(ypix)]
sum = 0
myMax = 0
myMin = 1
for y in range(ypix):
  for x in range(xpix):
    sum += pic[y][x]
    myMax = max(myMax, pic[y][x])
    myMin = min(myMin, pic[y][x])
avg = sum / (xpix * ypix)
# print(f"Max: {myMax}")
# print(f"Min: {myMin}")
# print(f"Sum: {sum}")
# print(f"Avg: {avg}")
pic2 = [[(pic[i][j] - myMin) / (myMax - myMin) for j in range(xpix)] for i in range(ypix)]
sum = 0
myMax = 0
myMin = 1
for y in range(ypix):
  for x in range(xpix):
    sum += pic2[y][x]
    myMax = max(myMax, pic2[y][x])
    myMin = min(myMin, pic2[y][x])
avg = sum / (xpix * ypix)
print(f"Max: {myMax}")
print(f"Min: {myMin}")
print(f"Sum: {sum}")
print(f"Avg: {avg}")

plt.imshow(pic2, cmap='gray')
plt.show()
