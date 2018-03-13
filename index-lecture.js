const express = require("express");
const app = express();
const compression = require("compression");

app.use(express.static('public'));

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/singers", function(req, res) {
    console.log("inside GET /singers");

    //this is where you query your DB, then res.json the results

    res.json([
        {name : 'Freddie Mercury', band: 'Queen'},
        {name: 'Beyonce', band: 'Destiny\'s Child'},
        {name: 'David Hasselhof', band: 'N/a'},
    ])
});


app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
