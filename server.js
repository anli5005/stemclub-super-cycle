var config = {
  programs: {
    ultrasonic: {command: "python", args: ["/home/pi/Documents/PythonTest/ultrasonic.py"]}
  },
  display: {
    pins: {
      segments: [29, 31, 26, 24, 21, 23, 32, 33],
      digits: [8, 36, 22, 12]
    },
    segments: {
      " ": [0,0,0,0,0,0,0],
      "0": [1,1,1,1,1,1,0],
      "1": [0,1,1,0,0,0,0],
      "2": [1,1,0,1,1,0,1],
      "3": [1,1,1,1,0,0,1],
      "4": [0,1,1,0,0,1,1],
      "5": [1,0,1,1,0,1,1],
      "6": [1,0,1,1,1,1,1],
      "7": [1,1,1,0,0,0,0],
      "8": [1,1,1,1,1,1,1],
      "9": [1,1,1,1,0,1,1]
    }
  }
};

console.log("Setting up ultrasonic sensor");
var child = require("child_process");
var ultrasonic = child.spawn(config.programs.ultrasonic.command, config.programs.ultrasonic.args);
ultrasonic.on("error", function(error) {
  console.warn("Failed to launch ultrasonic sensor program");
});

console.log("Setting up 7-segment display");
var gpio = require("pi-gpio");
var segmentDisplay = {
  number: 0,
  decimals: [0, 0, 0, 0],
  currentDigit: 0
};

function setupSegmentDisplay() {
  for (var i = 0; i < 7; i++) {
    gpio.open(config.display.pins.segments[i], "output");
  }
  for (var i = 0; i < 4; i++) {
    gpio.open(config.display.pins.digits[i], "output");
  }
}

function updateSegmentDisplay(digit, str) {
  var lastDigit = (digit - 1 < 0) ? 3 : (digit - 1);
  gpio.write(config.display.pins.digits[lastDigit], 1);
  for (var segment = 0; segment < 7; segment++) {
    gpio.write(config.display.pins.segments[segment], config.display.segments[str.charAt(digit)][segment]);
  }
  gpio.write(config.display.pins.digits[digit], 0);
}

function recursivelyUpdateSegmentDisplay() {
  var nStr = segmentDisplay.number.toString().substr(-4);
  updateSegmentDisplay(segmentDisplay.currentDigit, (nStr.length >= 4) ? nStr : (new Array(4 - nStr.length + 1).join("0") + nStr));
  segmentDisplay.currentDigit++;
  if (segmentDisplay.currentDigit > 3) {
    segmentDisplay.currentDigit = 0;
  }
  window.setImmediate(recursivelyUpdateSegmentDisplay);
}

setupSegmentDisplay();
recursivelyUpdateSegmentDisplay();
