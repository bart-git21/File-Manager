
// **********************************************************************************
//                                           запросы
// **********************************************************************************

const controller = require("./../app/controllers/controller");
module.exports = (app) => {
    app.get("/getFiles", controller.getFiles);
    app.get("/download", controller.download);
    app.post("/renameTarget", controller.renameTarget);
    app.post("/deleteTarget", controller.deleteTarget);
    app.post("/copyFile", controller.copyFile);
    app.post("/createDirectory", controller.createDirectory);
}