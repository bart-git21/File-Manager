function foo(userPath="", parent="") {
    const url = "http://localhost:8000/files/?path=";
    fetch(url+userPath)
    .then(response => response.json())
    .then(data => {
        renderFolders(data, parent);
    }, (error)=>{console.log(error)})
}
foo();

function renderFolders(data, parent) {
    document.querySelector(".fileManager").innerHTML = null;
    document.querySelector(".fileManager").innerHTML += 
        `
        <div>
            <span>Вы здесь: </span>
            <span class="fileManager__text-underline">${data.path === "" ? "Home" : data.path}</span>
        </div>
        `

    let grandparentPath = parent.split("/");
    grandparentPath.pop();
    grandparentPath = grandparentPath.join("/");
    if (data.path) {
        document.querySelector(".fileManager").innerHTML += 
            `
            <div>
                <span>Вернуться на уровень выше: </span>
                <button class="button fileManager__levelUpButton" onclick="foo('${parent}', '${grandparentPath}')">
                    <i class="fa-solid fa-turn-up"></i>
                </button>
            </div>
            `;
    }


    let parentPath = data.path || "";


    console.log("parentPath", parentPath);
    console.log("grandparentPath", grandparentPath);


    data.files.map(e => {
        function isDirectoryOrFile() {
            return e.isDir ? "folder" : "file";
        }

        let path = data.path + "/" + e.name;
        console.log("path", path);

        document.querySelector(".fileManager").innerHTML += 
            `
            <li class="fileManager__item">
                <div class="fileManager__item__name" onclick="foo('${path}', '${parentPath}')">
                    <i class="fa-solid fa-${isDirectoryOrFile()}"></i>
                    ${e.name.toUpperCase()}
                </div>

                <div class="fileManager__item__tools">
                    <div class="fileManager__item__deleteButton">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                    <div class="fileManager__item__downloadButton">
                        <i class="fa-solid fa-download"></i>
                    </div>
                    <div class="button fileManager__item__renameButton" onclick="rename('${path}', '${parentPath}', '${grandparentPath}')">rename</div>
                </div>
            </li>
            `
        }
    )
}

async function rename(elemOldName, parent, levelUp) {
    console.log("elemOldName", elemOldName);
    console.log("parent", parent);
    console.log("levelUp", levelUp);

    const url = "http://localhost:8000/renamefile/?path=";
    const parentPath = "&parentPath="+parent;
    let newName = prompt("Write a new name:", "");
    if (!newName) return;
    newName = "&newName=".concat(newName);
    console.log(newName);

    try {
        fetch(url+elemOldName+parentPath+newName, {
            method: "post",
        })
        .then (response => response.json)
        .then (foo(parent, levelUp))
    } catch(e) {console.warn("Error: ", e.message)}
}