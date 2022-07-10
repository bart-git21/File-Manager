


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
        res.json({
            path: userPath,
            result: true,
            files: files,
        });
    }
}

const renameTarget = (req, res) => {

    const oldPath = basePathToFiles + req.query.path;
    let newPath = basePathToFiles + req.query.parentPath + "/" + req.query.newName
    
    const description = req.query.path.split(".").pop();
    isDirectory(oldPath) ? newPath : (newPath += "." + description);
    
    let file = fs.rename(oldPath, newPath, ()=>{console.log("Renamed successful !")} )
    res.json({
        path: req.query.parentPath,
        result: true,
        file: file,
    });
}

const deleteTarget = (req, res) => {
    // const basePathToFiles = path.join(`${__dirname}/../../files/`);
    const targetPath = basePathToFiles + req.query.path;
    fs.rm(targetPath, { recursive: true }, (err) => {
        if (err) throw err;
        console.log('File is deleted!');
    })
    res.json({
        path: req.query.parentPath,
        result: true,
    });
}

const copyFile = (req, res) => {
    const description = req.query.path.split(".").pop();
    const newFile = req.query.newFile + "." + description;
    fs.copyFileSync(basePathToFiles+req.query.path, basePathToFiles+req.query.parentPath+"/"+newFile);
    res.json({
        path: req.query.parentPath,
        result: true,
    });
}

const createDirectory = (req, res) => {
    fs.mkdir(basePathToFiles+req.query.path+"/"+req.query.newDirName,  { recursive: true }, (err) => {
        if (err) throw err;
        console.log('Directory is created!');
    });
    res.json({
        path: req.query.path,
        result: true,
    });
}

const download = (req, res) => {
    const name = req.query.path;
    const filePath = path.join(__dirname, '/../../files', name);
    res.download(filePath, name, function (err) {
        if (err) {
            throw err;
        }
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