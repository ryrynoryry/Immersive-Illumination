const mock_timerBtn = document.querySelector("#timerStart");
const mock_remainingTime = document.querySelector("#remainingTime");

let timerRunning = false;

mock_timerBtn.onclick = function () {
  if (timerRunning) {
    // Stop Timer
    mock_remainingTime.hidden = true;
    this.innerHTML = "Start Timer";
  }
  else {
    // Start Timer
    mock_remainingTime.hidden = false;
    this.innerHTML = "Stop Timer";
  }
  timerRunning = !timerRunning;
}
