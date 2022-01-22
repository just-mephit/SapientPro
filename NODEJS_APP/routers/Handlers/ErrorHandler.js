module.exports = (e, res) => {
    console.log(e.message);
    return res.status(500).json({message: "Something went wrong..."});
}
