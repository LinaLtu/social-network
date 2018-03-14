const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./config/db");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const csurf = require("csurf");
const bcrypt = require("bcryptjs");

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}

app.use(bodyParser.json());

app.use(cookieSession({secret: "a secret",
    maxAge: 1000 * 60 * 60 * 24 * 14
}))

app.use(express.static('public'));

app.use(compression());

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

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


app.post("/registration", (req, res) => {
if (
     req.body.firstname &&
     req.body.lastname &&
     req.body.email &&
     req.body.password
 ) {
     // console.log("If not empty", req.body);
     db.hashPassword(req.body.password)
         .then(hash => {
             db.insertRegistration(
                 req.body.firstname,
                 req.body.lastname,
                 req.body.email,
                 hash
             ).then(insertRegistration => {

                 var id = insertRegistration.rows[0].id;
                 req.session.userId = id;
                console.log("Req.session: ", req.session);
                 res.sendStatus(200);
                 // console.log(
                 //     "This is your id: " + insertRegistrationInfo.rows[0].id
                 // );
                 console.log("You've registered");
             })
         })
     } else {
        res.json({
            success: false
        })
     }
})

app.post("/login", (req, res) => {
    console.log("We are in login!");
    if (req.body.email && req.body.password) {
        db.getUserInfo(req.body.email).then(hashedPassword => {
            if(!hashedPassword.rows[0]) {
                res.json({
                    success: false
                });
                return;
            }
                console.log(hashedPassword.rows[0].password);
            // check if user exists.....if they do proceed with checking the password
            // if the user does NOT exists, send an error back
            checkPassword(
                req.body.password,
                hashedPassword.rows[0].password)
                .then(isMatch => {
                    if (isMatch === true) {
                        console.log("Password is correct");
                        var userId = hashedPassword.rows[0].id;
                        req.session.userId = userId;
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                });
            }
        
        )
        .catch((err) => {console.log("There is an error in post /login", err);})
    }  else {
        res.json({
            success: false,
            error: "Password or email not filled out"
        })
    }
});



app.get("*", function(req, res) {
    console.log("Req.session from welcome", !req.session.userId);
    if(!req.session.userId && req.url != "/welcome") {
        console.log("You are in welcome");
        res.redirect("/welcome")
    } else if (req.session.userId && req.url == "/welcome") {
            console.log("You are in /");
        res.redirect("/")
    } else {
    res.sendFile(__dirname + "/index.html");
}
});

app.listen(8080, function() {
    console.log("I'm listening Social Network");
});
