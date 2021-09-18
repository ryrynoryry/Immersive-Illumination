import board
import neopixel
from time import sleep
import random



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

for i in range(len(pixels)):
    pixels[i] = (0, 0, random.randint(0,20))
    # if i > 0:
    #     pixels[i-1] = OFF
    pixels.show()
    sleep(0.03)
# for i in reversed(range(len(pixels))):
#     pixels[i] = WHITE
#     if i < len(pixels) - 1:
#         pixels[i+1] = OFF
#     pixels.show()

input("Press Enter to clear")
print("Pixels deinit")
pixels.deinit()

print("Exiting...")
