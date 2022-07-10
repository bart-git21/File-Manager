const express = require("express");
const app = express();
app.use(express.static("server"));
app.use(express.static("client")); 

require("./server/config/routes")(app);


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is started on port ${port}`)
});