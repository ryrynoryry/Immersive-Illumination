from datetime import datetime

now = datetime.now()

current_time = now.strftime("%H:%M:%S")


f = open("/home/pi/Desktop/NewFile.txt", "a")
f.write("Time: " + current_time)