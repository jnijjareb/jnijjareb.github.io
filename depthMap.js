const canvas = document.getElementById("depth-map");
console.log(canvas);
const ctx = canvas.getContext("2d");
console.log(ctx);
const width = canvas.width;
const height = canvas.height;

const rows = Math.floor(height / 5);
const cols = Math.floor(width / 5);

const cellWidth = width / cols;
const cellHeight = height / rows;

function generateRandomArray(rows, cols) {
    const arr = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.random()); // Push a random number between 0 and 1
        }
        arr.push(row);
    }
    return arr;
}

function getColor(value) {
    const gray = Math.floor(value * 255);
    return `rgb(${gray}, ${gray}, ${gray})`;
}

function applyGaussianBlur(array, rows, cols, kernelSize = 3, sigma = 1.0) {
    const kernel = generateGaussianKernel(kernelSize, sigma);
    const blurredArray = Array.from({ length: rows }, () =>
        Array(cols).fill(0),
    );
    const offset = Math.floor(kernelSize / 2);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let sum = 0;
            let weightSum = 0;
            for (let ki = -offset; ki <= offset; ki++) {
                for (let kj = -offset; kj <= offset; kj++) {
                    const x = i + ki;
                    const y = j + kj;
                    if (x >= 0 && x < rows && y >= 0 && y < cols) {
                        const weight = kernel[ki + offset][kj + offset];
                        sum += array[x][y] * weight;
                        weightSum += weight;
                    }
                }
            }
            blurredArray[i][j] = sum / weightSum;
        }
    }

    return blurredArray;
}

function generateGaussianKernel(size, sigma) {
    const kernel = Array.from({ length: size }, () => Array(size).fill(0));
    const mean = Math.floor(size / 2);
    let sum = 0.0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const exponent =
                -((x - mean) ** 2 + (y - mean) ** 2) / (2 * sigma ** 2);
            kernel[x][y] = Math.exp(exponent) / (2 * Math.PI * sigma ** 2);
            sum += kernel[x][y];
        }
    }
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            kernel[x][y] /= sum;
        }
    }

    return kernel;
}

function drawDepthMap() {
    const randomArray = generateRandomArray(rows, cols);
    const blurred = applyGaussianBlur(randomArray, rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const value = randomArray[i][j];
            ctx.fillStyle = getColor(value);
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight); // Draw each cell
        }
    }
}

// Call the draw function
drawDepthMap();
