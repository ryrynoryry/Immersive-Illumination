// For any sound button, start the addio context if one does not exist




// Loading the page creates the audio context.
// Load rain button loads rain sounds and displays loading gif
// Thunder button loads sounds.



// Play button starts rain and next thunder.
// Thunder is set with randoly assigned delay





// Python:
// One script, multiple threads
// Thread 1: listens for file changes and creates threads for the appropriate effect
// Thread 2: maintains the framerate. Transfers pixel array into led strip and runs .show() before sleeping until the next frame

// Pixel Array: Global list of arrays that act like a layering system.
//  When empty, nothing is happenign with the strip.
//  When an effect is started, an array of pixels is created and pushed to the global list.
//  The effect then updates this array while the render thread squashes all the arrays into a single layer and writes it to the strip

// Layer 0 is the lowest layer with values being overwritten by upper layers.