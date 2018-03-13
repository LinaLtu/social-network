const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./config/db");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');


app.use(bodyParser.json());

app.use(cookieSession({secret: "a secret"}))

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

// app.get("/singers", function(req, res) {
//     console.log("inside GET /singers");
//
//     //this is where you query your DB, then res.json the results
//
//     res.json([
//         {name : 'Freddie Mercury', band: 'Queen'},
//         {name: 'Beyonce', band: 'Destiny\'s Child'},
//         {name: 'David Hasselhof', band: 'N/a'},
//     ])
// });

// app.get("/", (req, res) => {
//     console.log("We are inside Inside /");
// });

app.post("/registration", (req, res) => {
if (
     req.body.firstname &&
     req.body.lastname &&
     req.body.email &&
     req.body.password
 ) {
     console.log("If not empty", req.body);
     db.hashPassword(req.body.password)
         .then(hash =>
             db.insertRegistration(
                 req.body.firstname,
                 req.body.lastname,
                 req.body.email,
                 hash
             ).then(insertRegistration => {

                 // id = insertRegistrationInfo.rows[0].id;
                 req.session.userId = id;
                 // console.log(
                 //     "This is your id: " + insertRegistrationInfo.rows[0].id
                 // );
                 console.log("You've registered");
             })
         )
     }
     res.sendStatus(200);
});


app.get("*", function(req, res) {
    if(!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome")
    } else if (req.session.userId && req.url == "/welcome") {
        res.redirect("/")
    } else {
    res.sendFile(__dirname + "/index.html");
}
});

app.listen(8080, function() {
    console.log("I'm listening Social Network");
});
