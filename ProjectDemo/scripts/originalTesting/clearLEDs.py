import board
import neopixel
from time import sleep


# On a Raspberry pi, use this instead, not all pins are supported
pixel_pin = board.D18

# The number of NeoPixels
num_pixels = 300

# The order of the pixel colors - RGB or GRB. Some NeoPixels have red and green reversed!
# For RGBW NeoPixels, simply change the ORDER to RGBW or GRBW.
ORDER = neopixel.GRB

pixels = neopixel.NeoPixel(
    pixel_pin, num_pixels, brightness=0.2, auto_write=False, pixel_order=ORDER
)
print("Pixels initialized")
pixels[0] = (0, 0, 0)
pixels[1] = (0, 0, 0)
pixels[2] = (0, 0, 0)
pixels[3] = (0, 0, 0)
pixels[4] = (0, 0, 0)
pixels[5] = (0, 0, 0)
pixels[6] = (0, 0, 0)
pixels[7] = (0, 0, 0)
pixels[8] = (0, 0, 0)
pixels[9] = (0, 0, 0)
print("Pixels set")

pixels.show()
print("Pixels shown")

pixels.deinit()
print("Pixels deinit")

