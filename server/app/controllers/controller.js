


const path = require("path");
const fs = require("fs");

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory() 
}

const basePathToFiles = path.join(`${__dirname}/../../files/`);

const getFiles = (req, res)=> {
    let userPath = "";
    if ("path" in req.query) {
        userPath = req.query.path;
    }
    const resultPath = basePathToFiles + userPath;

    if(isDirectory(resultPath)) {
        let files = fs.readdirSync(resultPath).map(elemName => {
            const isDir = isDirectory(resultPath + "/" + elemName);
            // const stat = fs.lstatSync(resultPath + "/" + elemName);
            return {
                name: elemName,
                isDir: isDir,
                // size: stat.size,
                // birthtime: stat.birthtime,
                // stat: stat,
            }
        })
        res.status(200).json({
            path: userPath,
            result: true,
            files: files,
        });
    }
}

const renameTarget = (req, res) => {

    const oldPath = basePathToFiles + req.query.path;
    let newPath = basePathToFiles + req.query.parentPath + "/" + req.query.newName;

    if ( isDirectory(oldPath) ) {
        // если каталог с таким именем уже существует:
        if (fs.existsSync( basePathToFiles + req.query.parentPath + "/" + req.query.newName )) newPath += " - copy";
    } else {
        // если файл с таким именем уже существует:
        const description = req.query.path.split(".").pop();
        if ( fs.existsSync( basePathToFiles + req.query.parentPath + "/" + req.query.newName + "." + description ) ) newPath += " - copy" + "." + description
        else newPath += "." + description;
    }
    
    let file = fs.rename(oldPath, newPath, ()=>{console.log("Renamed successful !")} )
    res.status(200).json({
        path: req.query.parentPath,
        result: true,
        file: file,
    });
}

const deleteTarget = (req, res) => {
    const targetPath = basePathToFiles + req.query.path;
    fs.rm(targetPath, { recursive: true }, (err) => {
        if (err) throw err;
        console.log('Target is deleted!');
    })
    res.status(200).json({
        path: req.query.parentPath,
        result: true,
    });
}

const copyFile = (req, res) => {
    const description = req.query.path.split(".").pop();
    let newFile = req.query.newFile + "." + description;

    try {
        // если файл с таким именем уже существует:
        fs.existsSync( basePathToFiles + req.query.parentPath + "/" + newFile ) ? ( newFile = req.query.newFile + " - copy" + "." + description ) : newFile;
    
        fs.copyFileSync( basePathToFiles+req.query.path, basePathToFiles + req.query.parentPath + "/" + newFile );
    } catch (err) {
        return res
                .status(400)
                .json({
                    path: req.query.parentPath,
                    result: false,
                })
    }

    res.status(200).json({
        path: req.query.parentPath,
        result: true,
    });
}

const createDirectory = (req, res) => {
    let newDirName = req.query.newDirName;
    
    // если каталог с таким именем уже существует:
    fs.existsSync( basePathToFiles + req.query.path + "/" + req.query.newDirName ) ? ( newDirName += " - copy" ) : newDirName;

    fs.mkdir( basePathToFiles+req.query.path + "/" + newDirName,  { recursive: true }, (err) => {
        if (err) throw err;
        console.log('Directory is created!');
    });
    res.status(200).json({
        path: req.query.path,
        result: true,
    });
}

const download = (req, res) => {
    const name = req.query.path;
    const filePath = path.join(__dirname, '/../../files', name);
    res.download( filePath, name, function (err) {
        if (err) throw err;
        console.log('Directory is created!');
      });
}

module.exports = {
    getFiles,
    renameTarget,
    deleteTarget,
    copyFile,
    createDirectory,
    download,
}