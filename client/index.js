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
    document.querySelector(".fileManager__header").innerHTML += 
        `
        <div class="buttons-wrapper">
            <h3>You are here: </h3>
            <span class="fileManager__text-underline">${data.path === "" ? "Home" : data.path}</span>
        </div>
        `

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

    let parentName = data.path || "";

    document.querySelector(".fileManager__content").innerHTML = null;

    let counter = 0;
    data.files.map(e => {
        counter++;
        // const birthtime = new Date(e.birthtime).toLocaleDateString();

        function isDirectoryOrFile() {
            return e.isDir ? "folder" : "file";
        }

        let elemName = data.path + "/" + e.name;

        

        let renderDownloadAndCopyIconsForFiles = 
        `
        <div title="download" class="fileManager__item__downloadButton" >
        <a href="/download/?path=${elemName}"><i class="fa-solid fa-download"></i></a>
        </div>
        <div title="copy" class="fileManager__item__copyButton" onclick="copyFile('${elemName}', '${parentName}', '${parentPath}')">
        <i class="fa-solid fa-copy"></i>
        </div>
        `

        document.querySelector(".fileManager__content").innerHTML += 
        `
        <li class="fileManager__item" style="--i:${counter}">
            <div title="${isDirectoryOrFile()} name" class="fileManager__item__name" onclick="getFiles('${elemName}', '${parentName}')">
                <i class="fa-solid fa-${isDirectoryOrFile()}"></i>
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
        </li>
        `
    })
}


/* <div title="download" class="fileManager__item__downloadButton" >
<a href="/download/?path=${elemName}"><i class="fa-solid fa-download"></i></a>
</div>
<div title="copy" class="fileManager__item__copyButton" onclick="copyFile('${elemName}', '${parentName}', '${parentPath}')">
<i class="fa-solid fa-copy"></i>
</div> */


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
    console.log("path", path);
    console.log("levelUpPath", parentPath);
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

// async function download(targetPath) {
//     console.log("targetPath", targetPath);
//     try {
//         await fetch(url+"download/?path="+targetPath, {
//             method: "get",
//         })
//         .then (response => response.json())
//         .then (data => console.log(data))
//         // .then (data => getFiles(parentPath, levelUpPath))
//         .then(console.log(3))
//     } catch(e) {console.warn("Error: ", e.message)}
// }