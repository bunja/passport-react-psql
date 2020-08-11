const express = require('express');
//require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

//app.use(express.json());

app.get('/', (req, res) => {
    res.json({ succes: true});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});