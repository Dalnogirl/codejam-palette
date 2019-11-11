let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');
let color = '#000000';
let inputColor = document.querySelector('#input-color');
inputColor.oninput = function () {
    color = this.value;
}


let pencilButton = document.querySelector('#pencil')
pencilButton.onmousedown = function () {
    eyeDropperButton.classList.remove('active')
    bucketButton.classList.remove('active');
    if (!pencilButton.classList.contains('active')) {
        pencilButton.classList.add('active')
    } else {
        Array.from(document.querySelectorAll('.active')).map(item => { item.classList.remove('active') });
        pencilButton.classList.add('active')
    }
}


let eyeDropperButton = document.querySelector('#eye-dropper')
eyeDropperButton.onmousedown = function () {
    pencilButton.classList.remove('active');
    bucketButton.classList.remove('active');
    if (!eyeDropperButton.classList.contains('active')) {
        eyeDropperButton.classList.add('active')
    } else {
        eyeDropperButton.classList.remove('active')
    }
}

let bucketButton = document.querySelector('#bucket')
bucketButton.onmousedown = function () {
    pencilButton.classList.remove('active');
    eyeDropperButton.classList.remove('active');
    if (!bucketButton.classList.contains('active')) {
        bucketButton.classList.add('active')
    } else {
        bucketButton.classList.remove('active')
    }
}

let matrix;

if (!!localStorage.matrix) {
    let matrixRes = localStorage.matrix.split(',');

    matrix = [];
    let removeNum = matrixRes.length ** (1 / 2)

    for (let i = 0; i < matrixRes.length; i += removeNum) {
        matrix.push(matrixRes.slice(i, removeNum + i))
    }


    let ceilHeight = Math.floor(512 / matrix[0].length),
        ceilWidth = Math.floor(512 / matrix[0].length),
        heightY = 0,
        widthX = 0;

    for (let i = 0; i < matrix.length; i++) {
        for (let k = 0; k < matrix.length; k++) {
            color = matrix[i][k]

            ctx.fillStyle = color;
            ctx.fillRect(widthX, heightY, ceilWidth, ceilWidth)

            ctx.fill();
            widthX += ceilWidth
        }
        heightY += ceilHeight
        widthX = 0;
    }


} else {
    color = inputColor.value
    matrix = [];
    
    matrixGenerate(16)
}

function matrixGenerate(num) {
    for (let i = 0; i < num; i++) {
        let matrixRow = [];
        for (let k = 0; k < num; k++) {
            matrixRow.push('#ffffff')
        }
        matrix.push(matrixRow);
    }
}





function draw(event, color) {
    let x = event.offsetX,
        y = event.offsetY;

    let horizontalCeil = -1,
        verticalCeil = -1;

    for (let i = 0; i <= 512; i += 512 / matrix[0].length) {
        if (x < i) {
            for (let k = 0; k <= 512; k += 512 / matrix[0].length) {
                if (y < k) {
                    break
                } else { verticalCeil++; }
            }
            break;
        } else { horizontalCeil++; }
    }

    let ceilHeight = 512 / matrix[0].length + 1,
        ceilWidth = 512 / matrix[0].length + 1;

    ctx.fillStyle = color;
    ctx.fillRect(512 / matrix[0].length * horizontalCeil, 512 / matrix[0].length * verticalCeil, ceilHeight, ceilWidth);
    ctx.fill();

    matrix[verticalCeil][horizontalCeil] = color;

    localStorage.matrix = matrix;
}


function bucket(event) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    ctx.fill();

}

function eyeDrop(event) {
    let x = event.offsetX,
        y = event.offsetY;

    let horizontalCeil = -1,
        verticalCeil = -1;

    for (let i = 0; i <= 512; i += 512 / matrix[0].length) {
        if (x < i) {
            for (let k = 0; k <= 512; k += 512 / matrix[0].length) {
                if (y < k) {
                    break
                } else { verticalCeil++; }
            }
            break;
        } else { horizontalCeil++; }
    }

    color = matrix[verticalCeil][horizontalCeil];
    inputColor.value = color;
}



/////////////

document.querySelector('body').addEventListener('keydown', function (e) {

    if (e.code === 'KeyP') {
        pencilButton.classList.toggle('active')
        eyeDropperButton.classList.remove('active')
        bucketButton.classList.remove('active')
    }
    if (e.code = 'KeyC') {
        eyeDropperButton.classList.toggle('active')
        pencilButton.classList.remove('active')
        bucketButton.classList.remove('active')
    }
    if (e.code = 'KeyB') {
        bucketButton.classList.toggle('active')
        pencilButton.classList.remove('active')
        eyeDropperButton.classList.remove('active')
    }
})

canvas.onmousedown = function (event) {
    if (pencilButton.classList.contains('active')) draw(event, color);
    if (eyeDropperButton.classList.contains('active')) eyeDrop(event);
    if (bucketButton.classList.contains('active')) bucket(event);
    canvas.onmousemove = function (event) {
        if (pencilButton.classList.contains('active')) draw(event, color);
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
    canvas.onmouseout = function () {
        canvas.onmousemove = null;
    }
}





