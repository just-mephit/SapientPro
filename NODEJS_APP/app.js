const express = require("express");
const userRouter = require("./routers/userRouter");
const addressRouter = require("./routers/addressRouter");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/address", addressRouter);

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
