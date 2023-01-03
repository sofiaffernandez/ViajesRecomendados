require("dotoenv").config();
const express = requiere ("express");
const app = express();


//Middleware 404 // otros
app.use ((req, res) => {
    res.status(404).send({
        status: "error",
        message: "Not found",
    });
});

app.use ((error, req, res, next) =>{
    console.error (error);
    res.status(error.httpStatus || 500).send({
        status:"error",
        message:error.message,
    })
})
