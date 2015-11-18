var config = {
  programs: {
    ultrasonic: {command: "python", args: ["/home/pi/Documents/PythonTest/ultrasonic.py"]
  }
};

console.log("Setting up child processes");

var child = require("child_process");

console.log("Setting up ultrasonic sensor");
var ultrasonic = child.spawn(config.programs.ultrasonic.command, config.programs.ultrasonic.args);
ultrasonic.on("error", function(error) {
  console.warn("Failed to launch ultrasonic sensor program");
});
