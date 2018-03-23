const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require('compression');
const db = require('./config/db');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const bcrypt = require('bcryptjs');
const s3 = require('./s3.js');
const upload = s3.upload;

const s3Url = 'https://s3.amazonaws.com/bodyjamnetwork/';

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());

app.use(
    cookieSession({
        secret: 'a secret',
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(express.static('public'));

app.use(compression());

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV !== 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    if (req.file) {
        db
            .insertImageIntoDB(req.file.filename, req.session.userId)
            .then(results => {
                console.log('Upload Successful', results);
                res.json({
                    data: s3Url + results.url
                });
            });
    } else {
        console.log("Upload didin't work");
        res.json({
            success: false
        });
    }
});

app.post('/registration', (req, res) => {
    if (
        req.body.firstname &&
        req.body.lastname &&
        req.body.email &&
        req.body.password
    ) {
        // console.log("If not empty", req.body);
        db.hashPassword(req.body.password).then(hash => {
            db
                .insertRegistration(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash
                )
                .then(insertRegistration => {
                    var id = insertRegistration.rows[0].id;
                    req.session.userId = id;
                    console.log('Req.session: ', req.session);
                    res.sendStatus(200);
                    // console.log(
                    //     "This is your id: " + insertRegistrationInfo.rows[0].id
                    // );
                    console.log("You've registered");
                });
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post('/login', (req, res) => {
    console.log('We are in login!');
    if (req.body.email && req.body.password) {
        let hashedPass;

        db
            .getUserInfo(req.body.email)
            .then(hashedPassword => {
                if (!hashedPassword.rows[0]) {
                    res.json({
                        success: false
                    });
                    return;
                }
                console.log(hashedPassword.rows[0].password);
                // check if user exists.....if they do proceed with checking the password
                // if the user does NOT exists, send an error back
                hashedPass = hashedPassword;
                return true;
            })
            .then(() =>
                db.checkPassword(req.body.password, hashedPass.rows[0].password)
            )
            .then(isMatch => {
                if (isMatch === true) {
                    console.log('Password is correct');
                    let userId = hashedPass.rows[0].id;
                    req.session.userId = userId;
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false
                    });
                }
            })
            .catch(err => {
                console.log('There is an error in post /login', err);
            });
    } else {
        res.json({
            success: false,
            error: 'Password or email not filled out'
        });
    }
});

app.get('/user', function(req, res) {
    db.getUserInfoById(req.session.userId).then(results => {
        if (results.rows[0].url) {
            console.log(results.rows[0].url);
            results.rows[0].url = s3Url + results.rows[0].url;
        }
        res.json({ data: results.rows[0] });
    });
});

app.put('/user/:id', function(req, res) {
    console.log('Running /user/:id', req.body);

    db.insertBioIntoDB(req.body.bio, req.session.userId).then(results => {
        console.log('Upload Successful', results);
        res.json({
            success: true
        });
    });
});

app.get('/get-user/:id', function(req, res) {
    console.log('From the other OtherUser page', req.params.id);
    if (req.params.id == req.session.userId) {
        console.log('Same');
        res.json({
            data: 'same'
        });
    } else {
        Promise.all([
            db.getUserInfoById(req.params.id),
            db.getFriendshipStatus(req.session.userId, req.params.id)
        ]).then(function([userInfo, friendshipStatus]) {
            if (userInfo.rows.length === 0) {
                res.sendStatus(404);
            } else {
                if (userInfo.rows[0].url) {
                    console.log(userInfo.rows[0].url);
                    userInfo.rows[0].url = s3Url + userInfo.rows[0].url;
                }
            }
            res.json({
                userInfo: userInfo.rows[0],
                friendshipStatus: friendshipStatus.rows[0]
            });
        });
    }
});

app.post('/send-request/:id', function(req, res) {
    db
        .sendFriendRequest(req.session.userId, req.params.id, 1)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => res.sendStatus(500));
});

app.post('/accept-request/:id', function(req, res) {
    db
        .acceptFriendRequest(req.params.id, req.session.userId)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => {
            console.log('Error from accept', err);
            res.sendStatus(500);
        });
    // res.json({data: "ok"});
});

app.post('/cancel-request/:id', function(req, res) {
    db
        .cancelFriendRequest(req.session.userId, req.params.id)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => {
            console.log('Error from cancel', err);
            res.sendStatus(500);
        });
    // res.json({data: "ok"});
});

app.post('/reject-request/:id', function(req, res) {
    console.log("We are making to the reject page");
    db
        .rejectFriendRequest(req.session.userId, req.params.id)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => {
            console.log('Error from reject request', err);
            res.sendStatus(500);
        });
    // res.json({data: "ok"});
});

app.post('/delete-friend/:id', function(req, res) {
    db
        .deleteFriend(req.session.userId, req.params.id)
        .then(results => {
            console.log("From DELETE", results);
            res.json({ data: results.rows[0] });
        })
        .catch(err => res.sendStatus(500));
});

app.get('/get-friends', function(req, res) {
    db
        .getAllFriends(req.session.userId)
        .then(results => {
                console.log('We have results from friends/SELECT', results);
            res.json({ data: results.rows });
        })
        .catch(err => {
            console.log('Something went wrong', err);
            res.sendStatus(500)});
});

// app.post('/cancel-request/:id', function(req, res) {
//     console.log("Req body ",req.params.id);
//     db.cancelFriendRequest(req.session.userId, req.params.id, 1).then(results => {
//     res.json({ data: results.rows[0] });
// }).catch(err => console.log(err));
//     // res.json({data: "ok"});
// });

app.get('*', function(req, res) {
    // console.log("Req.session from welcome", !req.session.userId);
    if (!req.session.userId && req.url != '/welcome') {
        // console.log("You are in welcome");
        res.redirect('/welcome');
    } else if (req.session.userId && req.url == '/welcome') {
        // console.log("You are in /");
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening Social Network");
});

//Handing the connection event

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    //we need to keep track of user and socket ides because people can have the same site open in different tabs
    socket.on('disconnect', function() {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on('thanks', function(data) {
        console.log(data);
    });

    socket.emit('welcome', {
        message: 'Welome. It is nice to see you'
    });
});
