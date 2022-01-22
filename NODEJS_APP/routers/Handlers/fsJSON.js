const fs = require("fs");

function read(model="") {
    if (model === "") {
        throw new Error("Model name not specified")
    }

    return fs.promises.readFile(`./data/${model}Data.json`, "utf8")
        .then(content => JSON.parse(content))
        .catch(err => {
            console.log(err.message);
            return null;
        });
}

function write(model="", data) {
    if (model === "") {
        throw new Error("Model name not specified");
    }

    return fs.promises.writeFile(`./data/${model}Data.json`, JSON.stringify(data))
        .catch(err => console.log(err.message));
}

module.exports = {read, write}
