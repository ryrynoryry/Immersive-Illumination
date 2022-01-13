from time import sleep
import tkinter
import random
import config
import LED_SharedPatterns

root = tkinter.Tk(baseName="Virtual Strip")
C = tkinter.Canvas(root, bg="black", height=2*32, width=2500)# (config.NUM_PIXELS+1) * (32 + 1))
# root.overrideredirect(True)
# root.configure(background='black')

closeBtn = tkinter.Button(root, text="X", command=lambda:root.destroy(), background="gray")
closeBtn.place(x=0, y=0)

# sq = C.create_rectangle(0, 0, 200, 1200/2, fill="blue", outline="gray", width=10)
olcolor = "#555555"
color = (255,128,64)
margin = 16
padding = 3
size = 32
sqList = [None] * config.NUM_PIXELS
for i in range(len(sqList)):
  sqList[i] = C.create_rectangle(i*size + margin + padding, margin, margin + (i+1)*size, margin + size, fill=LED_SharedPatterns.tuple2hex(color), outline=olcolor, width=2)
C.pack()
root.title("Virtual Strip")



def Rain():
  for i in range(config.NUM_PIXELS):
    C.itemconfigure(sqList[i], fill=LED_SharedPatterns.tuple2hex((0, 0, random.randint(5, 255))))
    root.update()
  # root.after(30, Rain)

def StartMainLoop():
  root.mainloop()


# guiThread = threading.Thread(target=StartMainLoop, name='guiThread', args=(), daemon=True)

# guiThread.start()
run = True
# Continuously poll keyboard input
count = 0
while run:
  # i = input("Enter text ('exit' to quit): ")
  # print(f'Input received: <{i}>')
  Rain()
  if count > 10000:
    break
  # if not i:
  #   break
  # sleep(1)
  count += 1
print("Keyboard loop has exited")

# guiThread.join()

# root.after(30, Rain) # Milliseconds

# root.mainloop()


