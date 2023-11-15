const express = require("express");
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

app.use((req, res, next) => {
    console.log(`${req.method} Request Received`);
    next();
});

app.use(["/beans/", "/beans/:beanName"], (req, res, next) => {
    let bodyData = "";
    req.on("data", (data) => {
        bodyData += data;
    });
    req.on("end", () => {});
});

app.use("/beans/:beanName", (req, res, next) => {
    const beanName = req.params.beanName;

    if (!jellybeanBag[beanName]) {
        console.log("Response Sent");
        return res.status(404).send("Bean with that name does not exist");
    }

    req.bean = jellybeanBag[beanName];
    req.beanName = beanName;
    next();
});

app.get("/beans/", (req, res, next) => {
    res.send(jellybeanBag);
    console.log("Response Sent");
});

app.post("/beans/", (req, res, next) => {
    let queryData = "";
    req.on("data", (data) => {
        queryData += data;
    });

    req.on("end", () => {
        const body = JSON.parse(queryData);
        const beanName = body.name;
        if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
            return res.status(404).send("Bean with that name does not exist");
        }
        const numberOfBeans = Number(body.number) || 0;
        jellybeanBag[beanName] = {
            number: numberOfBeans,
        };
        res.send(jellybeanBag[beanName]);
        console.log("Response Sent");
    });
});

app.get("/beans/:beanName", (req, res, next) => {
    res.send(jellybeanBag[req.beanName]);
    console.log("Response Sent");
});

app.post("/beans/:beanName/add", (req, res, next) => {
    let queryData = "";
    req.on("data", (data) => {
        queryData += data;
    });

    req.on("end", () => {
        const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
        jellybeanBag[req.beanName].number += numberOfBeans;
        res.send(jellybeanBag[req.beanName]);
        console.log("Response Sent");
    });
});

app.post("/beans/:beanName/remove", (req, res, next) => {
    let queryData = "";
    req.on("data", (data) => {
        queryData += data;
    });

    req.on("end", () => {
        const numberOfBeans = Number(JSON.parse(queryData).number) || 0;
        if (jellybeanBag[req.beanName].number < numberOfBeans) {
            return res
                .status(400)
                .send("Not enough beans in the jar to remove!");
        }
        jellybeanBag[req.beanName].number -= numberOfBeans;
        res.send(jellybeanBag[req.beanName]);
        console.log("Response Sent");
    });
});

app.delete("/beans/:beanName", (req, res, next) => {
    jellybeanBag[req.beanName] = null;
    res.status(204).send();
    console.log("Response Sent");
});

app.put("/beans/:beanName/name", (req, res, next) => {
    let queryData = "";
    req.on("data", (data) => {
        queryData += data;
    });

    req.on("end", () => {
        const newName = JSON.parse(queryData).name;
        jellybeanBag[newName] = jellybeanBag[req.beanName];
        jellybeanBag[req.beanName] = null;
        res.send(jellybeanBag[newName]);
        console.log("Response Sent");
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
