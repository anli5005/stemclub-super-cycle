var config = {
  programs: {
    ultrasonic: {command: "python", args: ["/home/pi/Documents/PythonTest/ultrasonic.py"]
  }
}

var child = require("child_process");

var ultrasonic = child.spawn(config.programs.ultrasonic.command, config.programs.ultrasonic.args);
ultrasonic.on("error", function(error) {
  console.warn("Failed to launch ultrasonic sensor")
});
