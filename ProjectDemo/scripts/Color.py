"""
Color class to contain color-related utility functions.
"""

class Color():
  @staticmethod
  def Lerp(start, end, t=0.5):
    # (1-t) * start + t * end
    return [(1-t) * start[i] + t * end[i] for i in range(min(len(start), len(end)))]

  @staticmethod
  def GetColorOnGradient(position, gradient):
    # Check for invalid input
    if type(gradient) is not list:
      return None

    # Initialize the variables to the default case of a 2-stop gradient with one color at 0.0 and the other at 1.0.
    startIndex = 0
    endIndex = 1
    t = min(max(position, 0.0), 1.0) # If the stops are at 0 and 1 then the position does not need to be rescaled. But ensure it is within bounds.
    stops = len(gradient)

    # 0.0        0.6     1.0  <-- Position
    # |----|----|-+--|----|
    # 0    1    2    3    4   <-- Stop Indices

    # Find the indices that the position lies between
    if stops > 2:
      # Divide to convert the [0..1] position the scale on the indices.
      # Then truncate the decimal portion to get the index to the left.
      startIndex = int(t/(stops-1))
      # Index on the right is the next integer
      endIndex = startIndex + 1
      # Rescale the overall position value to be the percentage between the two bordering indices.
      t = t * (stops - 1) - startIndex
      # 0.0    0.4         1.0  <-- Position
      # |-------+-----------|
      # 2                   3   <-- Start/End Stop Indices

      # Above equation is reduced from:
      # t = (t - startIndex) / (endIndex - startIndex)

    elif stops == 1: # If only one color is in the gradient, return the solid color.
      return gradient[0]

    # Calculate the linear interpolation between the two gradient stops.
    returnColor = Color.Lerp(gradient[startIndex], gradient[endIndex], t)

    return returnColor



