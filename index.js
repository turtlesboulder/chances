"use strict";
// TODO: Read the inputs and generate some text with the result of totalProbability().
//
//
// N: number of trials
// C: chance of success
// S: number of succeses needed
// K: Used in the methods for the EXACT number of succeses needed in this part of the calculation
//
//
//     1|
//      |        ____---
//      |    __--
//      |  _-
//      |_-
//     0+---------------
//      s               n
//
// Use exact formula for small number of trials (below 20?)
// Use normal approximation for larger numbers of trials
const MAX = 20;
const XOFFSET = 35;
const YOFFSET = 15;
const WIDTH = 400;
const HEIGHT = 400;
let button = document.querySelector("#submitButton");
button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
    let t = document.querySelector("input");
    let trials = document.querySelector("#trials");
    let chance = document.querySelector("#chance");
    let needed = document.querySelector("#needed");
    let n;
    let c;
    let s;
    try {
        n = trials.value;
        c = chance.value;
        s = needed.value;
        // Despite typescript's best efforts, my code doesn't work unless I multiply by 1 to convert to a number
        // on the javascript side of things.
        n = n * 1;
        c = c * 1;
        s = s * 1;
        if (n < s) {
            updateMessage("The number of successes needed cannot be greater than the number of trials!");
        }
        else {
            if (n > MAX) {
                updateMessage(`The number of trials cannot exceed ${MAX} :(`);
            }
            else {
                makeLineGraph(s, n, c);
                updateMessage(`The chance of at least ${s} successes in ${n} trials is ${totalProbability(n, c, s)}.`);
            }
        }
    }
    catch (_a) {
        // This doesn't actually trigger and I get NaN's instead
        updateMessage("All input fields must be numbers!");
    }
});
function updateMessage(text) {
    const messageElement = document.querySelector("#message");
    if (messageElement == null) {
        return;
    }
    messageElement.textContent = text;
}
function binomialCoefficient(n, k) {
    // Do not use with n larger than ~20
    if (n > MAX || k > n) {
        return -1;
    }
    return factorial(n) / (factorial(k) * factorial(n - k));
}
function binomialProbability(n, k, c) {
    const coefficient = binomialCoefficient(n, k);
    return coefficient * (c ** k) * ((1 - c) ** (n - k));
}
function totalProbability(n, c, s) {
    if (n > MAX || s > n) {
        return -1;
    }
    // add up a bunch of binomialProbablilities()...
    let total = 0;
    for (let i = s; i < n; i++) {
        // Calculate the exact number of successes needed or greater, so start i off equal to s
        // and then go until the number of trials minus 1
        // the number of successes equaling the number of trials is easy to calculate
        total += binomialProbability(n, i, c);
    }
    // Add the probability that every trial is a success
    total += c ** n;
    return total;
}
function normalApproximation(n, c, s) {
    // unfinished
    let mean = n * c;
    let deviation = (n * c * (1 - c)) ** 0.5;
    let zscore = ((s - 0.5) - mean) / deviation;
    const E = 2.72;
    const PI = 3.14;
    //(1/((2*PI)**0.5))*(E**(-((zscore**2)/2)))  ?????
    return 0;
}
function factorial(num) {
    if (num > MAX) {
        return -1;
    }
    let total = 1;
    for (let i = 2; i <= num; i++) {
        total *= i;
    }
    return total;
}
function recursiveFactorial(num) {
    if (num <= 1) {
        return 1;
    }
    return recursiveFactorial(num - 1) * num;
}
function makeLineString(x1, y1, x2, y2, style = "stroke:black; stroke-width:2") {
    let line = `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" style="${style}" />`;
    return line;
}
function makeTextString(x, y, text) {
    let textString = `<text x="${x}" y="${y}" fill="black">${text}</text>`;
    return textString;
}
function makeGridLines(numLines) {
    // numLines is equal to the number of attempts minus the number of successes; That is the number of
    // lines that make up the data displayed. The number of grid lines displayed is one less than that.
    // Always draws 10 vertical lines
    let xScale = WIDTH / numLines;
    let yScale = HEIGHT / 10;
    let htmlString = "";
    for (let x = XOFFSET; (x - 1) < WIDTH + XOFFSET; x += xScale) {
        htmlString += makeLineString(x, YOFFSET, x, HEIGHT + YOFFSET, "stroke:lightgray; stroke-width:1");
    }
    for (let y = YOFFSET; (y - 1) < HEIGHT + YOFFSET; y += yScale) {
        htmlString += makeLineString(XOFFSET, y, WIDTH + XOFFSET, y, "stroke:lightgray; stroke-width:1");
    }
    return htmlString;
}
function annotateGridLines(s, n) {
    let xScale = WIDTH / (n - s);
    let yScale = HEIGHT / 10;
    let htmlString = "";
    let textStartX = XOFFSET;
    let textStartY = YOFFSET + HEIGHT;
    for (let i = s; i <= n; i++) {
        htmlString += makeTextString(textStartX - 4, HEIGHT + 16 + YOFFSET, `${i}`);
        textStartX += xScale;
    }
    for (let i = 0; i <= 10; i++) {
        htmlString += makeTextString(XOFFSET - 24, textStartY, `${i / 10}`);
        textStartY -= yScale;
    }
    return htmlString;
}
function makeLineStrings(s, n, c) {
    let lines = "";
    let xScale = WIDTH / (n - s);
    let lineStartX = XOFFSET;
    let lineStartY = -1;
    for (let i = s; i < n; i++) {
        let x1 = lineStartX;
        let x2 = lineStartX + xScale;
        let y1;
        if (lineStartY == -1) {
            // Calculate the probability on the first iteration only, on next iterations can use the y2 from the previous calculations
            y1 = (HEIGHT + YOFFSET) - (totalProbability(i, c, s) * HEIGHT);
        }
        else {
            y1 = lineStartY;
        }
        let y2 = (HEIGHT + YOFFSET) - (totalProbability(i + 1, c, s) * HEIGHT);
        lineStartY = y2;
        lineStartX += xScale;
        lines += makeLineString(x1, y1, x2, y2);
    }
    return lines;
}
function makeLineGraph(s, n, c) {
    // Refactor this, take the for loop into a different method
    if (s >= n) {
        // Make sure n is at least 1 greater than s
        return;
    }
    let svg = document.querySelector("svg");
    let svgHtmlString = "";
    if (svg == null) {
        return;
    }
    svgHtmlString += makeGridLines(n - s);
    svgHtmlString += makeLineStrings(s, n, c);
    svgHtmlString += annotateGridLines(s, n);
    svg.innerHTML = svgHtmlString;
}
