const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");
const equationInput = document.getElementById("equationInput");
const generateButton = document.getElementById("generateButton");
const zoomInput = document.getElementById("zoomInput");
const zoomButton = document.getElementById("zoomButton");

let userSeed = 0; // Default seed value

let zoom = 1; // Zoom level
let centerX = 0; // Center X coordinate
let centerY = 0; // Center Y coordinate

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFractal();
}

function evaluateEquation(input) {
  try {
    const result = new Function(`return ${input}`)();
    if (isNaN(result)) {
      throw new Error("Invalid equation");
    }
    return result;
  } catch (error) {
    alert("Invalid equation. Please enter a valid mathematical expression.");
    return 0;
  }
}

function getComplexConstant(seed) {
  const real = (seed % 1000) / 1000; // Real part from seed
  const imaginary = (Math.floor(seed / 1000) % 1000) / 1000; // Imaginary part
  return { real, imaginary };
}

function drawFractal() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const width = canvas.width;
  const height = canvas.height;

  const scale = 250 * zoom; // Adjust scale by zoom
  const maxIterations = 300;

  const { real: cRe, imaginary: cIm } = getComplexConstant(userSeed);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / scale + centerX;
      let zy = (y - height / 2) / scale + centerY;

      let iteration = 0;
      while (iteration < maxIterations) {
        const zx2 = zx * zx;
        const zy2 = zy * zy;

        if (zx2 + zy2 > 4) break;

        const temp = zx2 - zy2 + cRe;
        zy = 2 * zx * zy + cIm;
        zx = temp;

        iteration++;
      }

      const color =
        iteration === maxIterations
          ? "black"
          : `hsl(${(iteration / maxIterations) * 360}, 100%, 50%)`;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Zoom functionality on button click
zoomButton.addEventListener("click", () => {
  const zoomValue = parseFloat(zoomInput.value);
  if (zoomValue >= 0.1) {
    zoom = zoomValue; // Set the zoom level from input
    drawFractal();
  } else {
    alert("Zoom level must be greater than or equal to 0.1");
  }
});

window.addEventListener("resize", resizeCanvas);

// Handle fractal generation with user input
generateButton.addEventListener("click", () => {
  const equation = equationInput.value.trim();
  const result = evaluateEquation(equation);
  userSeed = Math.abs(result);
  drawFractal();
});

resizeCanvas();
