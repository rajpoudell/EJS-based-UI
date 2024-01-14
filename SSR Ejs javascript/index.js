const express = require('express');
const urlRouter = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const {connectToMongoose} = require('./conect');
const app = express();
const URL = require("./model/url"); // Import the URL model
const PORT  = 8001;

const path = require('path');  // for ejs only

connectToMongoose("mongodb://127.0.0.1:27017/shorturl").then(() => {console.log("Mongodb is connected:")});
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));



app.use("/url",urlRouter);
app.use("/",staticRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true }
    );

    if (entry && entry.redirectURL) {
        res.redirect(entry.redirectURL);
    } else {
        // Assuming entry or entry.redirectURL is null
        res.status(404).send('URL not found');
    }
});

app.listen(PORT,() =>{ console.log(`PORT started at ${PORT}`);})


