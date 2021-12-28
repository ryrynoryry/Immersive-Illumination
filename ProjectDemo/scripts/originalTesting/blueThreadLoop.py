import board
import neopixel
from time import sleep
import time
import random


def MainBlue(inputVar):
  # On a Raspberry pi, use this instead, not all pins are supported
  pixel_pin = board.D18

  # The number of NeoPixels
  num_pixels = 300

  # The order of the pixel colors - RGB or GRB. Some NeoPixels have red and green reversed!
  # For RGBW NeoPixels, simply change the ORDER to RGBW or GRBW.
  ORDER = neopixel.GRB

  pixels = neopixel.NeoPixel(
      pixel_pin, num_pixels, brightness=1.0, auto_write=False, pixel_order=ORDER
  )
  print("Pixels initialized")

  newBrightness = pixels.brightness

  WHITE = (255, 255, 255)
  OFF = (0, 0, 0)
  RED = (255, 0, 0)

  DURATION = 1 * 60 * 60
  #          hours minutes seconds

  whileCount = 0
  timeEntered = time.time()
  timeNow = time.time()
  while inputVar[0]:
    whileCount += 1
    for i in range(len(pixels)):
      if pixels[i][2] == 0:
        pixels[i] = (0, 0, random.randint(5,20))
      elif random.randint(1,4) == 1:
        pixels[i] = (0, 0, pixels[i][2] - 1)
      if i == 1:
        print("[{0}] Pixel {1}: {2}".format(whileCount, i, pixels[i][2]))
      # pixels[i] = (0, 0, random.randint(0,20))
      # sleep(0.03)
    pixels.show()
    timeNow = time.time()
    if timeNow - timeEntered > DURATION:
      inputVar[0] = False

  # for i in reversed(range(len(pixels))):
  #     pixels[i] = WHITE
  #     if i < len(pixels) - 1:
  #         pixels[i+1] = OFF
  #     pixels.show()

  # input("Press Enter to clear")
  print("Sleeping")
  sleep(1)
  print("Pixels deinit")
  pixels.deinit()

  print("Exiting...")

if __name__ == "__main__":
  print("Starting MainBlueLoop")
  MainBlue()
  print("Exited MainBlueLoop")

