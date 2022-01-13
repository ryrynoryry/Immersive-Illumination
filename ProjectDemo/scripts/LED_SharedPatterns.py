import config
"""
File containing functions that can be shared between different Sequences.
"""

def GetPixelIndexRange(pixelNum, startPos = 0):
  if pixelNum <= 0:
    return []
  # Bound the position to be on the strip
  startPos = config.Bound(startPos, config.NUM_PIXELS - 1)
  # Do not let the range extend past the end of the strip
  pixelNum = config.Bound(startPos + pixelNum, config.NUM_PIXELS) - startPos

  # Return a range of index values: [startPos, startPos + pixelNum - 1]
  return range(startPos, startPos + pixelNum)

def SetColor(layer, color, pixelNum, startPos = 0):
  pixelRange = GetPixelIndexRange(pixelNum, startPos)
  if not pixelRange and layer not in config.LAYER_RANGE: # Abort if layer is invalid or pixel range is empty
    return False

  config.stripLayersLocks[layer].acquire()
  for i in pixelRange:
    config.stripLayers[layer][i] = color
  config.stripLayersLocks[layer].release()
  return True

# def FadeColor(layer, startColor, endColor, pixelNum, startPos = 0):
#   for startColor

#   config.stripLayersLocks[layer].acquire()
#   for i in pixelRange:
#     config.stripLayers[layer][i] = color
#   config.stripLayersLocks[layer].release()
#   return True

def FadeColor(layer, startColor, endColor, pixelNum, startPos = 0):
  STEPS = 30
  colorList = GenerateLinearGradient(startColor, endColor, STEPS)

  for i in range(STEPS):
    SetColor(layer, colorList[i], pixelNum, startPos)


def GenerateLinearGradient(startColor, endColor=(255,255,255), n=10):
  ''' returns a gradient list of (n) colors between two colors. '''
  # Initilize a list of the output colors with the starting color in list format
  RGB_list = [[startColor[0], startColor[1], startColor[2]]]
  # Calcuate a color at each evenly spaced value of t from 1 to n
  for t in range(1, n):
    # Interpolate RGB vector for color at the current value of t
    curr_vector = [
        int(Lerp(startColor[j], endColor[j], t/(n-1)) + 0.5) # Integer rounding
        for j in range(3)]
    # Add it to our list of output colors
    RGB_list.append(curr_vector)

  return RGB_list


def Lerp(start, end, t=0.5):
  # (1-t) * start + t * end
  return [(1-t) * start[i] + t * end[i] for i in range(min(len(start), len(end)))]


def tuple2hex(color):
  return rgb2hex(color[0], color[1], color[2])

def rgb2hex(r, g, b):
    return "#{:02x}{:02x}{:02x}".format(max(0, min(r, 255)), max(0, min(g, 255)), max(0, min(b, 255)))

def hex2rgb(hexcode):
    return tuple(map(ord, hexcode[1:].decode('hex')))


