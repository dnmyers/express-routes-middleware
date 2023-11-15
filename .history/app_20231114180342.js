const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));

const jellybeanBag = {
    mystery: {
        number: 4,
    },
    lemon: {
        number: 5,
    },
    rootBeer: {
        number: 25,
    },
    cherry: {
        number: 3,
    },
    licorice: {
        number: 1,
    },
};

/*****************************
 **       Middleware        **
 *****************************/
app.use(morgan("dev"));

app.use(bodyParser.json());

//! Using body-parser package instead of this custom Middleware
//// Parse incoming data
//// const bodyParser = (req, res, next) => {
////     let bodyData = "";
////     req.on("data", (data) => {
////         bodyData += data;
////     });
////     req.on("end", () => {
////         if (bodyData) {
////           req.body = JSON.parse(bodyData);
////         }
////     });
////     next();
//// };

/******************************
 **         Routes           **
 ******************************/

app.use("/beans/:beanName", (req, res, next) => {
    const beanName = req.params.beanName;

    if (!jellybeanBag[beanName]) {
        const err = new Error("Bean with that name does not exist");
        err.status = 404;
        return next(err);
        // return res.status(404).send("Bean with that name does not exist");
    }

    req.bean = jellybeanBag[beanName];
    req.beanName = beanName;
    next();
});

app.get("/beans/", (req, res, next) => {
    res.send(jellybeanBag);
});

app.post("/beans/", (req, res, next) => {
    const body = req.body;
    const beanName = body.name;
    if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
        const err = new Error("Bean with that name does not exist");
        err.status = 404;
        return next(err);
        // return res.status(404).send("Bean with that name does not exist");
    }
    const numberOfBeans = Number(body.number) || 0;
    jellybeanBag[beanName] = {
        number: numberOfBeans,
    };
    res.send(jellybeanBag[beanName]);
});

app.get("/beans/:beanName", (req, res, next) => {
    res.send(jellybeanBag[req.beanName]);
});

app.post("/beans/:beanName/add", (req, res, next) => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    jellybeanBag[req.beanName].number += numberOfBeans;
    res.send(jellybeanBag[req.beanName]);
});

app.post("/beans/:beanName/remove", (req, res, next) => {
    const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
    if (jellybeanBag[req.beanName].number < numberOfBeans) {
        const err = new Error("Not enough beans in the jar to remove!");
        err.status = 400;
        return next(err);
        // return res.status(400).send("Not enough beans in the jar to remove!");
    }
    jellybeanBag[req.beanName].number -= numberOfBeans;
    res.send(jellybeanBag[req.beanName]);
});

app.delete("/beans/:beanName", (req, res, next) => {
    jellybeanBag[req.beanName] = null;
    res.status(204).send();
});

app.put("/beans/:beanName", (req, res, next) => {
    const newName = JSON.parse(req.query.name);
    jellybeanBag[newName] = jellybeanBag[req.beanName];
    jellybeanBag[req.beanName] = null;
    res.send(jellybeanBag[newName]);
});

// Error handler
app.use((err, req, res, next) => {
    if (err.status) {
        console.log("err: ", err);
        console.log("err.message: ", err.message);
        res.status(err.status).send(err.message);
    } else {
        console.log("err: ", err);
        console.log("err.message: ", err.message);
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`\nServer is listening on port ${PORT}...\n`);
});
