let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let lastInput = ""; // Pēdējā ievadītā rakstzīme
let resultReplaced = false; // Vai rezultāts ir aizstāts?

// Funkcija pievieno ciparus vai punktu
function appendValue(value) {
    const display = document.getElementById('display');
    if (!resultReplaced && !isNaN(lastInput)) {
        // Pirmo reizi pēc rezultāta aizstāj esošo vērtību
        display.value = value;
        resultReplaced = true; // Atzīmē, ka rezultāts ir aizstāts
    } else {
        if (value === '.' && display.value.includes('.')) return; // Neļauj ievadīt vairākus punktus
        display.value += value; // Turpina pievienot ievadi
    }
    lastInput = value;
}

// Funkcija pievieno operatorus
function appendOperator(operator) {
    const display = document.getElementById('display');
    if (['+', '-', '*', '/'].includes(lastInput)) return; // Neļauj ievadīt vairākus operatorus pēc kārtas
    display.value += operator;
    lastInput = operator;
    resultReplaced = false; // Atļauj turpināt izteiksmi
}

// Funkcija notīra ievadi
function clearDisplay() {
    document.getElementById('display').value = '';
    lastInput = '';
}

// Funkcija aprēķiniem
function calculate() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        if (!isNaN(result)) {
            addHistory(display.value, result);
            display.value = result;
            lastInput = result.toString();
            resultReplaced = false; // Atļauj aizvietot nākamo ievadi
        } else {
            alert('Nederīga izteiksme!');
        }
    } catch (error) {
        alert('Kļūda aprēķinos!');
    }
}

// Kvadrātsakne
function calculateSquareRoot() {
    const display = document.getElementById('display');
    try {
        const value = parseFloat(display.value);
        if (value < 0) {
            alert('Kvadrātsakne negatīvam skaitlim nav definēta!');
            return;
        }
        const result = Math.sqrt(value);
        addHistory(`√(${value})`, result);
        display.value = result;
        lastInput = result.toString();
    } catch {
        alert('Nederīga izteiksme!');
    }
}

// Kvadrāts
function calculateSquare() {
    const display = document.getElementById('display');
    try {
        const value = parseFloat(display.value);
        const result = value ** 2;
        addHistory(`${value}²`, result);
        display.value = result;
        lastInput = result.toString();
    } catch {
        alert('Nederīga izteiksme!');
    }
}

// Procenti
function calculatePercentage() {
    const display = document.getElementById('display');
    try {
        const currentValue = display.value;

        // Atrodam pēdējo operatoru un pirmo skaitli pirms operatora
        const match = currentValue.match(/(.+?)([+\-*/])(\d+(\.\d+)?)$/);
        if (!match) {
            alert('Nav pietiekami daudz datu procentu aprēķinam!');
            return;
        }

        const [, previousExpression, operator, lastNumber] = match;
        const previousValue = eval(previousExpression); // Aprēķina iepriekšējo izteiksmi
        const percentageValue = (previousValue * parseFloat(lastNumber)) / 100;

        // Aizvieto pēdējo izteiksmi ar procentu vērtību
        const newValue = `${previousExpression}${operator}${percentageValue}`;
        display.value = newValue;
        lastInput = percentageValue.toString();
    } catch (error) {
        alert('Kļūda procentu aprēķinā!');
    }
}

// Pievieno vēsturi
function addHistory(expression, result) {
    const newEntry = `${expression} = ${result}`;
    history.push(newEntry);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

// Atjauno vēsturi
function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = entry;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Dzēst';
        deleteButton.onclick = () => {
            history.splice(index, 1);
            localStorage.setItem('calcHistory', JSON.stringify(history));
            renderHistory();
        };
        li.appendChild(deleteButton);
        historyList.appendChild(li);
    });
}

// Notīra visu vēsturi
function clearHistory() {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}

// Lapas ielādēšanas laikā
window.onload = renderHistory;
