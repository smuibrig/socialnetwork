const express = require("express");
const app = express();
const compression = require("compression");
const pg = require("./pg");
//const { Redirect } = require('react-router');
const cookieSession = require("cookie-session");
const bc = require("./bc.js");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

// socket.io boilerplate
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(compression());
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// File upload boilerplate - DON'T TOUCH /////////////////////////////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// Routes ///////////////////////////////////////////////////////////////

app.post("/register", async (req, res) => {
    const hashedPassword = await bc.hash(req.body.password);

    let userId;

    try {
        userId = await pg.createUser(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            hashedPassword
        );
    } catch (err) {
        res.status(400).send({
            message: "Please fill out every field in the form.",
        });
        return;
    }

    req.session.userId = userId;

    res.status(200).send();
});

app.post("/login", async (req, res) => {
    let user;

    try {
        user = await pg.getUserInfo(req.body.email);
    } catch (err) {
        res.status(400).send({
            message: "Something went wrong",
        });
    }

    if (!user) {
        res.status(400).send({
            message: "Please enter a valid password and email address",
        });
        return;
    }

    let match;
    try {
        match = await bc.compare(req.body.password, user.password);
    } catch (err) {
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }

    if (!match) {
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }

    req.session.userId = user.id;

    res.status(200).send();
});

app.post("/reset/start", async (req, res) => {
    let user;

    try {
        user = await pg.getUserInfo(req.body.email);
    } catch (err) {
        res.status(400).send({
            message: "Something went wrong",
        });
    }

    if (!user) {
        res.status(400).send({
            message: "Please enter a valid password and email address",
        });
        return;
    }

    const secretCode = cryptoRandomString({
        length: 6,
    });

    let id;
    try {
        id = await pg.setSecretCode(req.body.email, secretCode);
    } catch (err) {
        res.status(400).send({
            message: "Something went wrong try again",
        });
        return;
    }

    if (!id) {
        res.status(400).send({
            message: "Something went wrong try again.",
        });
        return;
    }

    try {
        await ses.sendEmail(req.body.email, "reset your password", secretCode);
    } catch (err) {
        res.status(400).send({
            message: "Something went wrong try again",
        });
        return;
    }

    res.status(200).send();
});

app.post("/reset/verify", async (req, res) => {
    let code;

    try {
        code = await pg.validSecretCode(req.body.email, req.body.code);
    } catch (err) {
        console.log("error: ", err);
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }

    if (!code) {
        res.status(400).send({
            message: "The code is incorrect",
        });
        return;
    }

    if (req.body.password == "") {
        res.status(400).send({
            message: "Enter a new password",
        });
        return;
    }

    const hashedPassword = await bc.hash(req.body.password);

    try {
        await pg.updateUserPassword(hashedPassword, req.body.email);
    } catch (err) {
        console.log("Problem with updating the hashed password: ", err);
    }

    res.status(200).send();
});

app.post(
    "/profilepic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        const { filename } = req.file;
        const url = s3Url + filename;

        if (req.file) {
            try {
                await pg.updateUserPic(url, req.session.userId);
            } catch (err) {
                console.log(err);
                res.status(400).send({
                    message: "Something went wrong...",
                });
                return;
            }

            res.json({ url: url });
        } else {
            res.status(400).send({
                message: "Something went wrong...",
            });
            return;
        }
    }
);

app.post("/bio", async (req, res) => {
    let ok;

    try {
        ok = await pg.updateBio(req.body.bio, req.session.userId);
    } catch (err) {
        console.log("Error while uploading bio: ", err);
    }

    if (!ok) {
        res.status(400).send({
            message: "Something went wrong...",
        });
        return;
    }

    res.status(200).send();
});

app.post("/make-friend-request/:id", async (req, res) => {
    const myId = req.session.userId;
    const otherId = req.params.id;

    let success;
    try {
        success = await pg.insertFriendRequest(myId, otherId);
    } catch (err) {
        console.log(err);
    }

    if (success) {
        res.json(success);
    }
});

app.post("/accept-friend-request/:id", async (req, res) => {
    const myId = req.session.userId;
    const otherId = req.params.id;

    try {
        await pg.acceptFriendRequest(myId, otherId);
    } catch (err) {
        console.log(err);
    }

    res.status(200).send();
});

app.post("/end-friendship/:id", async (req, res) => {
    const myId = req.session.userId;
    const otherId = req.params.id;

    try {
        await pg.deleteFriendRequest(myId, otherId);
    } catch (err) {
        console.log(err);
    }

    res.status(200).send();
});

// Get routes

app.get("/friends-and-requests", async (req, res) => {
    let userData;
    try {
        userData = await pg.getFriendsAndRequests(req.session.userId);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }
    //console.log("getFriendsAndRequests data: ", userData);
    res.json(userData);
});

app.get(`/user/:id.json`, async (req, res) => {
    let userData;
    try {
        userData = await pg.getUserInfoById(req.params.id);
    } catch (err) {
        console.log("Error while retrieving new user: ", err);
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }
    res.json(userData);
});

app.get("/user.json", async (req, res) => {
    let userData;
    try {
        userData = await pg.getUserInfoById(req.session.userId);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }
    res.json(userData);
});

app.get("/latestusers", async (req, res) => {
    let userData;

    try {
        userData = await pg.getLatestUsers();
    } catch (err) {
        console.log("Something went wrong");
    }

    res.json(userData.rows);
});

app.get("/api/getmatch", async (req, res) => {
    let userData;
    try {
        userData = await pg.getMatch(req.query.name);
    } catch (err) {
        console.log("Something went wrong");
    }
    res.json(userData.rows);
});

app.get("/api/friendship-status/:otherId", async (req, res) => {
    const myId = req.session.userId;
    const otherId = req.params.otherId;

    let status;
    try {
        status = await pg.getFriendshipStatus(myId, otherId);
    } catch (err) {
        console.log(err);
        res.status(400).send({
            message: "Something went wrong",
        });
        return;
    }

    if (status) {
        res.json(status);
    } else {
        res.status(404).send();
    }
});

app.get("/logout", (req, res) => {
    console.log("req.session.userId before deletion", req.session.userId); 
    delete req.session.userId;
    console.log("req.session.userId AFTER deletion", req.session.userId); 
    res.status(200).send();
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        // if the user is logged in...
        res.redirect("/");
    } else {
        // the user is NOT logged in...
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

////////////////////////////////////////////////////////////////////////
/////////////////////////////// socket code ////////////////////////////
///////////////////////////////////////////////////////////////////////

io.on("connection", async (socket) => {
    // all of the socket code has to go inside here
    console.log(`socket id ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    let msgs;
    try {
        msgs = await pg.getLastTenMessages();
    } catch (err) {
        console.log(
            "Error while getting the last ten messages from the db; ",
            err
        );
    }

    // Reverse the last ten messages
    msgs.reverse();

    io.sockets.emit("chatMessages", msgs);

    socket.on("My amazing chat message", async (nextMsg) => {
        let msgCreatedAt;

        try {
            msgCreatedAt = await pg.insertChatMessage(nextMsg, userId);
        } catch (err) {
            console.log("Error while inserting the new chat message: ", err);
        }

        if (!msgCreatedAt) {
            console.log(
                "Something went wrong inserting the chat message:",
                msgCreatedAt
            );
            res.status(404).send();
        }

        console.log(" msgCreatedAt", msgCreatedAt);

        let userData;

        try {
            userData = await pg.getUserInfoById(userId);
        } catch (err) {
            console.log("Error while inserting the new chat message: ", err);
        }

        if (!userData) {
            console.log("Something went wrong getting the userData");
            res.status(404).send();
        }

        console.log(userData.created_at);

        let newMsgData = {
            id: userId,
            first: userData.first,
            last: userData.last,
            url: userData.url,
            message: nextMsg,
            created_at: msgCreatedAt,
        };

        try {
            io.sockets.emit("chatMessage", newMsgData);
        } catch (err) {
            console.log(err);
        }
    });
});
