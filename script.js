let SIZE = Math.min(document.body.clientWidth, document.body.clientHeight) / 9;
const RADS = Math.PI / 180;
let randomNumber = 0;
let colors = ['ff0000', 'ffff85', 'ff6e4a', '00e600', 'ffba70', '6600ff', '6666ff', '42aaff', '008000', 'ff890a', 'a3ff66', 'e0ff14', 'ff6666', 'ffdf84', 'a6bdd7', '5d9b9b', '6dae81', '287233', '00382b', '2a6478', '4d5d53', '48442d', '735184', 'cadaba'];

function fillDoc() {
    let $body = document.body;
    $body.innerHTML = '';
    let count = 1;
    for (let i = 1; i <= 5; i++) {
        let $newDiv = document.createElement('div');
        $newDiv.className = 'line';
        for (let j = 1; j <= 5; j++) {
            let $newCanvas = document.createElement('canvas');
            $newCanvas.id = 'clock' + count; 
            $newDiv.appendChild($newCanvas);
            count++;
        }
        $body.appendChild($newDiv);
    }
    setParams();
    moveTheClock();
}

function setParams() {
    for (let i = 1; i <= 25; i++) {
        let $clock = document.getElementById("clock" + i);
        $clock.width = $clock.height = SIZE;
    }
}

function moveTheClock() {
    SIZE = Math.min(document.body.clientWidth, document.body.clientHeight) / 6;
    for (let n = 1; n <= 25; n++) {
        let clock = document.getElementById("clock" + n);
        let ctx = clock.getContext('2d');
        ctx.clearRect(0, 0, SIZE, SIZE);
        //getting current time
        let Data = new Date();
        let minutes = Data.getMinutes();
        let seconds = Data.getSeconds();
        let milliseconds = Data.getMilliseconds();
        let timeDivision = -Data.getTimezoneOffset() / 60;
        let hours = Data.getHours() % 12 - timeDivision - (13 - n);
        //converting time to the angle of the arrow
        let hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;
        let minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
        let secondAngle = (seconds / 60) * 360 + (milliseconds / 1000) * 6;
        if (timeDivision + (13 - n)) {
            ctx.beginPath();
            ctx.fillStyle = '#' + colors[(n + randomNumber) % 24];
            ctx.fillRect(0, 0, SIZE, SIZE)
        }else{
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, SIZE, SIZE)    
        }
        document.body.style.background = '#' + colors[(randomNumber + 13) % 24];
        //painting hour marks
        secondColor = '#' + (parseInt(colors[(n + randomNumber) % 24], 16) ^ 0xFFFFFF | 0x1000000).toString(16).substring(1);
        for (let i = 0; i < 360; i += 6) {
            let degree = (i > 180) ? (360 - i) : i;
            let subtractionTime = (i > 180);
            if (i > 180) {
                degree = 360 - i;
                subtractionTime = true;
            }
            else {
                degree = i;
                subtractionTime = false;
            }
            let x = SIZE / 2 + SIZE / 2 * (Math.sin((180 - degree) * RADS)) * (subtractionTime ? -1 : 1);
            let y = SIZE / 2 + SIZE / 2 * (Math.cos((180 - degree) * RADS));
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = i % 5 === 0 ? 'red' : secondColor;
            ctx.fillStyle = i % 5 === 0 ? 'red' : secondColor;
            ctx.arc(x, y, i % 5 === 0 ? 1 : 0.5, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }
        drawClockHand(ctx, 5, SIZE / 3, hourAngle, secondColor);
        drawClockHand(ctx, 3, SIZE / 2.2, minuteAngle, secondColor);
        drawClockHand(ctx, 2, SIZE / 2.2, secondAngle, 'red');
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = secondColor;
        ctx.fillStyle = secondColor;
        ctx.arc(SIZE / 2, SIZE / 2, 1, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
    }
}

function drawClockHand(ctx, width, length, angle, color) {
    let subtractionTime = (angle > 180);
    if (angle > 180) {
        angle = 360 - angle;
        subtractionTime = true;
    }
    else {
        subtractionTime = false;
    }
    let x = SIZE / 2 + (length * Math.sin((180 - angle) * RADS) * (subtractionTime ? -1 : 1));
    let y = SIZE / 2 + (length * Math.cos((180 - angle) * RADS));
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(SIZE / 2, SIZE / 2);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function changeRandom() {
    let previousRandom = randomNumber;
    while (previousRandom === randomNumber){
        randomNumber = Math.floor(Math.random() * 24);
    }
}

setInterval(fillDoc, 30); //~30fps

setInterval(changeRandom, 1000);