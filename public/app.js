function sendCommand(command) {
    console.log(command + ' button pressed');
    document.getElementById('status-text').innerText = '忙碌中';
    setTimeout(() => {
        document.getElementById('status-text').innerText = '空閒';
    }, 2000); // 模擬一些操作後恢復空閒狀態
}

document.addEventListener("DOMContentLoaded", function() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        const width = box.offsetWidth;
        const height = box.offsetHeight;
        const left = box.offsetLeft;
        const top = box.offsetTop;

        console.log(`Box dimensions and position:
            Width: ${width}px,
            Height: ${height}px,
            Left: ${left}px,
            Top: ${top}px`);
    });
});

function sendCommand(command) {
    switch (command) {
        case '送醫材':
            window.location.href = 'page1送醫材.html';
            break;
        case '播放衛教影片':
            window.location.href = 'page2播放衛教影.html';
            break;
        case '地點引導':
            window.location.href = 'page3地點引導.html';
            break;
        case '回待機點':
            window.location.href = 'page4回待機點.html';
            break;
        case '去充電':
            window.location.href = 'page5去充電.html';
            break;

    }
}

