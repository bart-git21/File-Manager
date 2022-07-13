

let fileManager__table = document.querySelector(".fileManager__table");
let fileManager__table__body = document.querySelector(".fileManager__table__body");
function createCell() {
    return cell = document.createElement("td");;
}
function isDirectoryOrFile(elem) {
    return elem.isDir ? "folder" : "file";
}

async function getFiles(userPath="", parentPath="") {
    const url = "http://localhost:8000/getFiles/?path=";
    try {
        await fetch(url+userPath)
        .then(response => response.json())
        .then(data => render(data, parentPath))
    } catch (e) {console.log(e)}
}
getFiles();

function render(data, parentPath) {
    document.querySelector(".fileManager__header").innerHTML = null;

    // ===================================== current folder path
    document.querySelector(".fileManager__header").innerHTML += 
        `
        <div class="buttons-wrapper">
            <h3>You are here: </h3>
            <span class="fileManager__text-underline">${data.path === "" ? "Home" : data.path}</span>
        </div>
        `

    // ===================================== folder maker & level up button
    let levelUpPath = parentPath.split("/");
    levelUpPath.pop();
    levelUpPath = levelUpPath.join("/");
    // if (data.path) {
    document.querySelector(".fileManager__header").innerHTML += 
        `
        <div class="buttons-wrapper">
            <div class="button fileManager__createNewDirButton" onclick="createDirectory('${data.path}', '${parentPath}')">Create a new directory</div>
            <button title="Level Up" class="button fileManager__levelUpButton" onclick="getFiles('${parentPath}', '${levelUpPath}')">
                <i class="fa-solid fa-turn-up"></i>
            </button>
        </div>
        `;
    // }

    // ===================================== folders list
    let parentName = data.path || "";
    let counter = 0; // counter нужен для определения размера delay в анимации отрисовки
    fileManager__table__body.innerHTML = null;
    data.files.map(e => {
        counter++;
        let elemName = data.path + "/" + e.name;
        const size = Math.ceil( e.size / 1000 ) || ""; // kb
        const birthtime = new Date(e.birthtime).toLocaleDateString();
        
        // если очередной элемент является файлом (не папкой) - ему добавляются иконка загрузки и иконка копирования
        let renderDownloadAndCopyIconsForFiles = 
        `
        <div title="download" class="fileManager__item__downloadButton" >
        <a href="/download/?path=${elemName}"><i class="fa-solid fa-download"></i></a>
        </div>
        <div title="copy" class="fileManager__item__copyButton" onclick="copyFile('${elemName}', '${parentName}', '${parentPath}')">
        <i class="fa-solid fa-copy"></i>
        </div>
        `

        const fileManager__item = 
        `
        <div title="${isDirectoryOrFile(e)} name" class="fileManager__item__name" onclick="getFiles('${elemName}', '${parentName}')">
            <i class="fa-solid fa-${isDirectoryOrFile(e)}"></i>
            ${e.name.toUpperCase()}
        </div>

        <div class="fileManager__item__tools">
            ${ e.isDir ? "" : renderDownloadAndCopyIconsForFiles }
            <div title="delete" class="fileManager__item__deleteButton" onclick="deleteTarget('${elemName}', '${parentName}', '${parentPath}')">
                <i class="fa-solid fa-trash-can"></i>
            </div>
            <div title="rename" class="fileManager__item__renameButton" onclick="renameTarget('${elemName}', '${parentName}', '${parentPath}')">
                <i class="fa-solid fa-pen"></i>
            </div>
        </div>
        `

        const row = document.createElement("tr");
        const cell_0 = createCell();
        cell_0.setAttribute("class", "fileManager__item__nameWrapper");
        cell_0.innerHTML = fileManager__item;
        const cell_1 = createCell();
        cell_1.innerHTML = size;
        cell_1.addEventListener("click", () => {getFiles(elemName, parentName)});
        const cell_2 = createCell();
        cell_2.innerHTML = birthtime;
        cell_2.addEventListener("click", () => {getFiles(elemName, parentName)});
        
        row.setAttribute("class", "fileManager__item")
        row.setAttribute("style", `--i:${counter}`)
        row.appendChild(cell_0);
        row.appendChild(cell_1);
        row.appendChild(cell_2);

        fileManager__table__body.appendChild(row);
    })
}

function foo() {
    console.log(11);
}


const url = "http://localhost:8000/";

async function renameTarget(elemOldPath, parentPath, levelUpPath) {
    let newName = prompt("Write a new name:", "");
    if (!newName) return;
    try {
        await fetch(url+"renameTarget/?path="+elemOldPath+"&parentPath="+parentPath+"&newName="+newName, {
            method: "post",
        })
        .then (response => response.json())
        .then (data => getFiles(data.path, levelUpPath))
    } catch(e) {console.warn("Error: ", e.message)}
}

async function deleteTarget(target, parentPath, levelUpPath) {
    try {
        await fetch(url+"deleteTarget/?path="+target+"&parentPath="+parentPath, {
            method: "post",
        })
        .then (response => response.json())
        .then (data => getFiles(data.path, levelUpPath))
    } catch(e) {console.warn("Error: ", e.message)}
}

async function copyFile(target, parentPath, levelUpPath) {
    let newFile = prompt("Write a file name:", "");
    if (!newFile) return;
    try {
        await fetch(url+"copyFile/?path="+target+"&parentPath="+parentPath+"&newFile="+newFile, {
            method: "post",
        })
        .then (response => response.json())
        .then (data => getFiles(data.path, levelUpPath))
    } catch(e) {console.warn("Error: ", e.message)}
}

async function createDirectory(path, parentPath) {
    let newDirName = prompt("Write a file name:", "");
    if (!newDirName) return;
    try {
        await fetch(url+"createDirectory/?path="+path+"&parentPath="+parentPath+"&newDirName="+newDirName, {
            method: "post",
        })
        .then (response => response.json())
        .then (data => getFiles(data.path, parentPath))
    } catch(e) {console.warn("Error: ", e.message)}
}
