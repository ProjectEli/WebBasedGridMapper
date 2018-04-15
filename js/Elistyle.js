var map = document.querySelector('.map');
window.onclick = hideContextMenu;
window.onkeydown = listenKeys;
var contextMenu = document.querySelector('#contextMenu');
var arrowarray = [
    ['nw', 'n', 'ne'],
    ['w', 'o', 'e'],
    ['sw', 's', 'se']
];

$("#fileimporter").change(function () {
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var type = input.files[0].type;
        var name = input.files[0].name;
        console.log(type);
        if ((type.search('text/') > -1) || (name.search('.json') > -1)) {
            //텍스트이다.
            $('#readimage').attr('src', '#');
            $('#readimage').attr('style', 'display:none;');
            reader.onload = function (e) {
                var strings = event.target.result;
                document.querySelector('#readdata').innerHTML = strings.split('\n').join('<br>').split(' ').join('&nbsp;');
            };
            reader.readAsText(input.files[0]);
            $('#readdata').attr('style', 'display:block;');
        }
        else if (type.search('image/') > -1) {
            // 그림일때
            $('#readdata').innerHTML = '';
            $('#readdata').attr('style', 'display:none;');
            reader.onload = function (e) {
                $('#readimage').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
            $('#readimage').attr('style', 'display:block;');
        }
        else {
            $('#readimage').attr('src', '#');
            $('#readimage').attr('style', 'display:none;');
            document.querySelector('#readdata').innerHTML = '읽을 수 없는 형식의 파일. (가능한 목록: 단순 텍스트파일, json, 이미지파일들)';
            $('#readdata').attr('style', 'display:block;');
        }
    }
}

function openfile() {
    document.querySelector("#fileimporter").click();
}

function jsondownload(content) {
    var a = document.createElement("a");
    a.href = "data:application/json;charset=utf-8," + content;
    a.download = "filename.json";
    a.click();
}

function makeCell() {
    var square = document.createElement('div');
    square.className = 'square';
    for (var i = 0; i < 3; i++) {
        var row = document.createElement('div');
        row.className = "row";
        for (var j = 0; j < 3; j++) {
            var box = document.createElement('div');
            var arrow = document.createElement('arrow');
            arrow.className = arrowarray[i][j];
            var rnd = getRndInteger(0, 10);
            if (rnd <= 3) { //확률적 제거
                arrow.className = 'o';
            }
            box.appendChild(arrow);
            box.className = "column";
            row.appendChild(box);
        }
        square.appendChild(row);
    }
    square.oncontextmenu = function (event) {
        return showContextMenu(event);
    };
    return square;
}

function Initialize() {
    for (i = 0; i < 10; i++) {
        var newrow = map.insertRow(0);
        for (j = 0; j < 10; j++) {
            var newcol = newrow.insertCell();
            newcol.appendChild(makeCell());
        }
    }
    console.log('초기화완료');
}

function expandRowBottom(event) {
    var ncols = map.rows[0].cells.length;
    var newrow = map.insertRow();
    for (i = 0; i < ncols; i++) {
        var newcol = newrow.insertCell();
        newcol.appendChild(makeCell());
    }
}

function expandRowTop(event) {
    var ncols = map.rows[0].cells.length;
    var newrow = map.insertRow(0);
    for (i = 0; i < ncols; i++) {
        var newcol = newrow.insertCell();
        newcol.appendChild(makeCell());
    }
}

function expandColLeft(event) {
    var nrows = map.rows.length;
    for (i = 0; i < nrows; i++) {
        var newcell = map.rows[i].insertCell(0);
        newcell.appendChild(makeCell());
    }
}

function expandColRight(event) {
    var nrows = map.rows.length;
    for (i = 0; i < nrows; i++) {
        var newcell = map.rows[i].insertCell(-1);
        newcell.appendChild(makeCell());
    }
}

function getPos(element) {
    return [element.parentNode.rowIndex, element.cellIndex];
}



function showContextMenu(event) {
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    var pos = coordinateConversion(getPos(event.path[3]));
    document.querySelector('#pos').innerHTML = '[' + (pos[0] + 1) + ',' + (pos[1] + 1) + ']';
    return false;
}

function coordinateConversion(pos) { //pos =[x,y]
    var nrows = map.rows.length;
    var ncols = map.rows[0].cells.length;
    return [nrows - pos[0] - 1, pos[1]];
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}

function listenKeys(event) {
    var keyCode = event.which || event.KeyCode;
    if (keyCode == 27) { // ESC키
        hideContextMenu();
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Initialize();