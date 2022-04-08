function initiateEvents(){
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseOut, false);
}

var drawing = false;
var inScreen = false;

var lastMouseX = null;
var lastMouseY = null;

var mouseBufferX = [];
var mouseBufferY = [];

var allowedDrawing = false;

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

function mouseMove(event){

    inScreen = true;

    if(inScreen == true && drawing == true && allowedDrawing == true){

        if(lastMouseX != null){

            drawLine(lastMouseX, lastMouseY, event.offsetX, event.offsetY, "#000000", 1, true);

        }

        lastMouseX = event.offsetX;
        lastMouseY = event.offsetY;

        mouseBufferX[mouseBufferX.length] = event.offsetX;
        mouseBufferY[mouseBufferY.length] = event.offsetY;

    }

}

function mouseDown(event){

    console.log(allowedDrawing);

    drawing = true;

    if(inScreen == true && allowedDrawing == true){

        if(lastMouseX != null){

            //drawLine(lastMouseX, lastMouseY, event.offsetX, event.offsetY, "#000000", 1);

        }
        
        lastMouseX = event.offsetX;
        lastMouseY = event.offsetY;

    }

}

function mouseUp(event){

    drawing = false;
    console.log("Stopped drawing");
    
}

function mouseOut(event){

    inScreen = false;
    drawing = false;
    console.log("Cancelled drawing");

}

function changeDrawState(){
    allowedDrawing = document.getElementById("drawing").checked;
}

function endDrawing(){

    for(var index = 1; index < mouseBufferX.length; index++){

        drawLine(mouseBufferX[index - 1], mouseBufferY[index - 1], mouseBufferX[index], mouseBufferY[index], "#000000", 1, true);

    }

    drawLine(mouseBufferX[0], mouseBufferY[0], mouseBufferX[mouseBufferX.length - 1], mouseBufferY[mouseBufferY.length - 1], "#000000", 1, true);

}

function toVectors(){

    var input = [];

    for(var index = 0; index < mouseBufferY.length; index++){

        input[index] = mouseBufferY[index] - lerp(0, canvas.height, 0.5);

    }

    var output = dft(input);

    for(var index = 0; index < output.length; index++){

        var signal = output[index];
        
        var polar = signal.getPolarForm(false);

        var newVector = index;
        var amplitude = polar.re;
        var phase = polar.im;

        vectors[newVector] = new Vector();
        vectors[newVector].speed = newVector;
        vectors[newVector].size = amplitude;
        vectors[newVector].begin = phase;

    }

    resetEditor();
}

function testStart(){
    var input = [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0];
    var output = dft(input);
    //console.log(output);
    for(var index = 0; index < output.length; index++){
        //console.log(index);
        var signal = output[index];
        var polar = signal.getPolarForm(false);
        //console.log(signal);
        //console.log(polar);
    }
}

/****************************************************************************
Index of array = frequency
re = amplitude
im = phase
*****************************************************************************/

class ComplexNumber {
    /**
     * z = re + im * i
     * z = radius * e^(i * phase)
     *
     * @param {number} [re]
     * @param {number} [im]
     */
    constructor({ re = 0, im = 0 } = {}) {
        this.re = re;
        this.im = im;
    }
  
    /**
     * @param {ComplexNumber|number} addend
     * @return {ComplexNumber}
     */
    add(addend) {
      // Make sure we're dealing with complex number.
        const complexAddend = this.toComplexNumber(addend);
  
        return new ComplexNumber({
            re: this.re + complexAddend.re,
            im: this.im + complexAddend.im,
        });
    }
  
    /**
     * @param {ComplexNumber|number} subtrahend
     * @return {ComplexNumber}
     */
    subtract(subtrahend) {
      // Make sure we're dealing with complex number.
        const complexSubtrahend = this.toComplexNumber(subtrahend);
  
        return new ComplexNumber({
            re: this.re - complexSubtrahend.re,
            im: this.im - complexSubtrahend.im,
        });
    }
  
    /**
     * @param {ComplexNumber|number} multiplicand
     * @return {ComplexNumber}
     */
    multiply(multiplicand) {
      // Make sure we're dealing with complex number.
        const complexMultiplicand = this.toComplexNumber(multiplicand);
  
        return new ComplexNumber({
            re: this.re * complexMultiplicand.re - this.im * complexMultiplicand.im,
            im: this.re * complexMultiplicand.im + this.im * complexMultiplicand.re,
        });
    }
  
    /**
     * @param {ComplexNumber|number} divider
     * @return {ComplexNumber}
     */
    divide(divider) {
      // Make sure we're dealing with complex number.
        const complexDivider = this.toComplexNumber(divider);
  
      // Get divider conjugate.
        const dividerConjugate = this.conjugate(complexDivider);
  
      // Multiply dividend by divider's conjugate.
        const finalDivident = this.multiply(dividerConjugate);
  
      // Calculating final divider using formula (a + bi)(a − bi) = a^2 + b^2
        const finalDivider = (complexDivider.re ** 2) + (complexDivider.im ** 2);
  
        return new ComplexNumber({
            re: finalDivident.re / finalDivider,
            im: finalDivident.im / finalDivider,
        });
    }
  
    /**
     * @param {ComplexNumber|number} number
     */
    conjugate(number) {
      // Make sure we're dealing with complex number.
        const complexNumber = this.toComplexNumber(number);
  
        return new ComplexNumber({
            re: complexNumber.re,
            im: -1 * complexNumber.im,
        });
    }
  
    /**
     * @return {number}
     */
    getRadius() {
      return Math.sqrt((this.re ** 2) + (this.im ** 2));
    }
  
    /**
     * @param {boolean} [inRadians]
     * @return {number}
     */
    getPhase(inRadians = true) {
        let phase = Math.atan(Math.abs(this.im) / Math.abs(this.re));
  
        if (this.re < 0 && this.im > 0) {
            phase = Math.PI - phase;
        } else if (this.re < 0 && this.im < 0) {
            phase = -(Math.PI - phase);
        } else if (this.re > 0 && this.im < 0) {
            phase = -phase;
        } else if (this.re === 0 && this.im > 0) {
            phase = Math.PI / 2;
        } else if (this.re === 0 && this.im < 0) {
            phase = -Math.PI / 2;
        } else if (this.re < 0 && this.im === 0) {
            phase = Math.PI;
        } else if (this.re > 0 && this.im === 0) {
            phase = 0;
        } else if (this.re === 0 && this.im === 0) {
            // More correctly would be to set 'indeterminate'.
            // But just for simplicity reasons let's set zero.
            phase = 0;
        }
  
        if (!inRadians) {
            phase = radianToDegree(phase);
        }
  
        return phase;
    }
  
    /**
     * @param {boolean} [inRadians]
     * @return {{radius: number, phase: number}}
     */
    getPolarForm(inRadians = true) {
        return {
            radius: this.getRadius(),
            phase: this.getPhase(inRadians),
        };
    }
  
    /**
     * Convert real numbers to complex number.
     * In case if complex number is provided then lefts it as is.
     *
     * @param {ComplexNumber|number} number
     * @return {ComplexNumber}
     */
    toComplexNumber(number) {
        if (number instanceof ComplexNumber) {
            return number;
        }
  
            return new ComplexNumber({ re: number });
    }
}
  
function dft(inputAmplitudes, zeroThreshold = CLOSE_TO_ZERO_THRESHOLD) {
    const N = inputAmplitudes.length;
    const signals = [];
  
    // Go through every discrete frequency.
    for (let frequency = 0; frequency < N; frequency += 1) {
        // Compound signal at current frequency that will ultimately
        // take part in forming input amplitudes.
        let frequencySignal = new ComplexNumber();
  
        // Go through every discrete point in time.
        for (let timer = 0; timer < N; timer += 1) {
            const currentAmplitude = inputAmplitudes[timer];
  
            // Calculate rotation angle.
            const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);
  
            // Remember that e^ix = cos(x) + i * sin(x);
            const dataPointContribution = new ComplexNumber({
                re: Math.cos(rotationAngle),
                im: Math.sin(rotationAngle),
            }).multiply(currentAmplitude);
  
            // Add this data point's contribution.
            frequencySignal = frequencySignal.add(dataPointContribution);
        }
  
        // Close to zero? You're zero.
        if (Math.abs(frequencySignal.re) < zeroThreshold) {
            frequencySignal.re = 0;
        }
  
        if (Math.abs(frequencySignal.im) < zeroThreshold) {
            frequencySignal.im = 0;
        }
  
        // Average contribution at this frequency.
        // The 1/N factor is usually moved to the reverse transform (going from frequencies
        // back to time). This is allowed, though it would be nice to have 1/N in the forward
        // transform since it gives the actual sizes for the time spikes.
        frequencySignal = frequencySignal.divide(N);
    
        // Add current frequency signal to the list of compound signals.
        signals[frequency] = frequencySignal;
    }
  
    return signals;
}
  
function radianToDegree(radian) {
    return radian * (180 / Math.PI);
  }