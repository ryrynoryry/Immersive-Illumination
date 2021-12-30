"""
File containing code examples for reference
"""

Xsize = 5
Ysize = 3
List2D = [[0] * Xsize for i in range(Ysize)]  # 5x3 matrix
# Deep copy
localList2D = [x[:] for x in List2D]
