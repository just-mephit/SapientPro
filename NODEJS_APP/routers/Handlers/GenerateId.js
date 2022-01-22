function generateId(arrValues) {
    let id = Math.floor(Math.random() * 99998) + 1;

    return arrValues.includes(String(id)) ? generateId(arrValues) : id;
}

module.exports = generateId;
