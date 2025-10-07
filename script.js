let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

const display = document.getElementById('result');

function updateDisplay(value) {
    display.value = value;
}

function clearDisplay() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    updateDisplay('0');
}

function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (number === '.' && currentInput.includes('.')) {
        return; // Prevent multiple decimal points
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    
    updateDisplay(currentInput);
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') {
        return;
    }
    
    if (currentInput === '' && previousInput !== '') {
        operator = op;
        return;
    }
    
    if (previousInput !== '' && currentInput !== '' && operator !== '') {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    shouldResetDisplay = false;
}

function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                updateDisplay('Error');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    updateDisplay(result.toString());
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay('0');