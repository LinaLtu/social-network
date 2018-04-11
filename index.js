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

let onlineUsers = [];

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

const cookieSessionMiddleware = cookieSession({
    secret: 'a very secretive secret',
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
                res.json({
                    data: s3Url + results.url
                });
            });
    } else {
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

                    res.sendStatus(200);
                });
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post('/login', (req, res) => {
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

                hashedPass = hashedPassword;
                return true;
            })
            .then(() =>
                db.checkPassword(req.body.password, hashedPass.rows[0].password)
            )
            .then(isMatch => {
                if (isMatch === true) {
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
            results.rows[0].url = s3Url + results.rows[0].url;
        }
        res.json({ data: results.rows[0] });
    });
});

app.put('/user/:id', function(req, res) {
    db.insertBioIntoDB(req.body.bio, req.session.userId).then(results => {
        res.json({
            success: true
        });
    });
});

app.get('/get-user/:id', function(req, res) {
    if (req.params.id == req.session.userId) {
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
            res.sendStatus(500);
        });
});

app.post('/cancel-request/:id', function(req, res) {
    db
        .cancelFriendRequest(req.session.userId, req.params.id)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.post('/reject-request/:id', function(req, res) {
    db
        .rejectFriendRequest(req.session.userId, req.params.id)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => {
            console.log('Error from reject request', err);
            res.sendStatus(500);
        });
});

app.post('/delete-friend/:id', function(req, res) {
    db
        .deleteFriend(req.session.userId, req.params.id)
        .then(results => {
            res.json({ data: results.rows[0] });
        })
        .catch(err => res.sendStatus(500));
});

app.get('/get-friends', function(req, res) {
    db
        .getAllFriends(req.session.userId)
        .then(results => {
            res.json({ data: results.rows });
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

app.get('*', function(req, res) {
    if (!req.session.userId && req.url != '/welcome') {
        res.redirect('/welcome');
    } else if (req.session.userId && req.url == '/welcome') {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening Social Network 8080");
});

let messages = [];

io.on('connection', function(socket) {
    onlineUsers = [];
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }

    socket.on('chatMessage', msg => {
        messages.push(msg);
        io.sockets.emit('chat', msg);
    });

    const userId = socket.request.session.userId;

    onlineUsers.push({
        userId,
        socketId: socket.id
    });

    const userIds = onlineUsers.map(function(user) {
        return user.userId;
    });

    let data = [];

    db.getUsersByIds(userIds).then(results => {
        data = results.rows;

        socket.emit('onlineUsers', data);
    });

    const count = onlineUsers.filter(function(user) {
        return user.userId == userId;
    }).length;

    if (count == 1) {
        db.getUserWhoJoined(userId).then(results => {
            data = results.rows[0];
            socket.broadcast.emit('userJoined', data);
        });
    }

    io.on('userJoined', function() {
        const userJustJoined = userJoined.map(function(user) {
            return user.userId;
        });
        socket.broadcast.emit('userJoined', data);
    });

    socket.emit('chats', messages);

    socket.on('disconnect', function() {
        var idOfUserWhoLeft = onlineUsers.filter(
            userLeft => (userLeft.socketId = socket.id)
        );
        var userLeftId = idOfUserWhoLeft[0].userId;

        io.sockets.emit('userLeft', userLeftId);
    });
});
