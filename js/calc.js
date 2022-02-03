const clock = document.querySelector(".clock");
const buttons = document.querySelectorAll(".button");
const output = document.querySelector(".output");

let inputVal = 0;
let storedVal = null;
let decimal = false;
let operator = null;
let waiting = false;
let decimalPlace = -1;
let dbz = false;
let neg = false;

buttons.forEach((b) => {
  if (b.classList.contains("number")) b.addEventListener("click", addNumber);
  if (b.classList.contains("modifier"))
    b.addEventListener("click", addModifier);
  if (b.classList.contains("operator"))
    b.addEventListener("click", addOperator);
});

function addNumber(e) {
  n = strToInt(e.target.id);
  if (n == "decimal") {
    if (!decimal) {
      decimal = true;
    }
  } else {
    if (neg) {
      inputVal *= -1;
    }
    if (decimal) {
      inputVal = inputVal + n * 10 ** decimalPlace;
      decimalPlace -= 1;
    } else {
      inputVal = inputVal * 10 + n;
    }
    if (waiting) waiting = false;
    if (neg) {
      inputVal *= -1;
    }
  }

  updateScreen(inputVal);
}

function addModifier(e) {
  id = e.target.id;
  switch (id) {
    case "clear": {
      clearAll();
      break;
    }
    case "negative": {
      neg = neg ? false : true;
      inputVal *= -1;
      break;
    }
    case "percent": {
      if (inputVal != 0) inputVal /= 100;
      break;
    }
  }
  updateScreen(inputVal);
}

function addOperator(e) {
  id = e.target.id;

  switch (id) {
    case "equals": {
      if (!operator) break;
      storedVal = operate();
      updateScreen(storedVal);
      waiting = true;
      break;
    }
    default: {
      if (storedVal) {
        if (!waiting) {
          storedVal = operate();
          waiting = true;
        }
      } else {
        storedVal = inputVal;
      }
      operator = id;
      clearInput(storedVal);
      inputVal = 0;

      break;
    }
  }
}

function operate() {
  switch (operator) {
    case "plus":
      return storedVal + inputVal;
    case "minus":
      return storedVal - inputVal;
    case "multiply":
      return storedVal * inputVal;
    case "divide": {
      if (inputVal == 0) {
        dbz = true;
        return storedVal;
      }
      return storedVal / inputVal;
    }
    default:
      break;
  }
}

function updateScreen(num) {
  let fontSize = "72px";

  if (dbz) {
    output.setAttribute("style", `font-size: 40px`);
    output.textContent = "Cannot divide by zero";
    dbz = false;
    return;
  }

  if (num > 999999) num = num.toExponential(2);

  num = String(num);
  let len = num.length;

  if (len >= 7) {
    fontSize = "64px";
  }
  if (len >= 9) {
    i = num.indexOf(".");
    if (i >= 0) num = String((+num).toFixed(6 - i));
  }

  if (decimal && !num.includes(".")) {
    num += ".";
  }

  output.setAttribute("style", `font-size: ${fontSize}`);
  output.textContent = num;
}

function clearInput(val) {
  inputVal = 0;
  decimal = false;
  waiting = false;
  neg = false;
  decimalPlace = -1;
  updateScreen(val);
}

function clearAll() {
  operator = null;
  inputVal = 0;
  storedVal = null;
  decimal = false;
  waiting = false;
  neg = false;
  decimalPlace = -1;
  updateScreen(0);
}

function strToInt(n) {
  switch (n) {
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    case "zero":
      return 0;
    case "nine":
      return 9;
    default:
      return n;
  }
}
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let s = "AM";
  if (h >= 12) {
    h = h % 12;
    s = "PM";
  }
  let m = today.getMinutes();
  m = m < 10 ? "0" + m : m;
  clock.textContent = h + ":" + m + " " + s;
  setTimeout(startTime, 1000);
}

startTime();
