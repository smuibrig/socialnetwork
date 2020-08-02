const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || `postgres:sophie@localhost:5432/sophie`
);

exports.createUser = async (firstName, lastName, email, password) => {
    let result = await db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, lastName, email, password]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.getUserInfo = async (email) => {
    let result = await db.query(
        `SELECT id, password FROM users WHERE email = $1 `,
        [email]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0];
    }
};

exports.getUserInfoById = async (userId) => {
    let result = await db.query(
        `
    SELECT id, first, last, url, bio, to_char(created_at, 'YYYY Mon DD HH24:MI') as created_at
    FROM users 
    WHERE id = $1 
    `,
        [userId]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0];
    }
};

exports.setSecretCode = async (email, code) => {
    let result = await db.query(
        `
    INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING id
    `,
        [email, code]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.updateUserPic = async (pic, userId) => {
    let result = await db.query(
        `
        UPDATE users 
        SET url = $1
        WHERE id = $2
        RETURNING email
        `,
        [pic, userId]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.updateBio = async (bio, userId) => {
    let result = await db.query(`UPDATE users SET bio = $1 WHERE id = $2`, [
        bio,
        userId,
    ]);
    return result && result.rowCount == 1;
};

exports.validSecretCode = async (email, inputCode) => {
    let result = await db.query(
        `
        SELECT 1 FROM reset_codes
         WHERE created_at > NOW() - INTERVAL '15 minutes'
         AND email = $1
         AND code = $2
        `,
        [email, inputCode]
    );
    return result != undefined && result.rows.length == 1;
};

exports.updateUserPassword = async (password, email) => {
    let result = await db.query(
        `
        UPDATE users 
        SET password = $1
        WHERE email = $2
        RETURNING id
        `,
        [password, email]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.getLatestUsers = async () => {
    let result = await db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 3`);
    return result;
};

exports.getMatch = async (val) => {
    let result = await db.query(
        `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1 OR email ILIKE $1`,
        [val + "%"]
    );
    return result;
};

exports.getFriendshipStatus = async (myId, otherId) => {
    let result = await db.query(
        `
        SELECT * FROM friendshipstatus
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        LIMIT 1
    `,
        [myId, otherId]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0];
    }
};

exports.insertFriendRequest = async (myId, otherId) => {
    let result = await db.query(
        `
        INSERT INTO friendshipstatus (sender_id, receiver_id)
        VALUES ($1, $2) RETURNING id;
    `,
        [myId, otherId]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.acceptFriendRequest = async (myId, otherId) => {
    let result = await db.query(
        `
        UPDATE friendshipstatus 
        SET accepted = TRUE
        WHERE receiver_id = $1
        AND sender_id = $2 
        RETURNING sender_id;
    `,
        [myId, otherId]
    );
    if (result != undefined && result.rows.length == 1) {
        return result.rows[0].id;
    }
};

exports.deleteFriendRequest = async (myId, otherId) => {
    let result = await db.query(
        `
        DELETE FROM friendshipstatus
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1);
    `,
        [myId, otherId]
    );
    return result;
};

exports.getFriendsAndRequests = async (myId) => {
    let result = await db.query(
        `
        SELECT users.id, first, last, url, accepted
        FROM friendshipstatus
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    `,
        [myId]
    );
    return result.rows;
};

exports.getLastTenMessages = async () => {
    let result = await db.query(
        `
        SELECT first, last, url, message, users.id, to_char(chat.created_at, 'YYYY Mon DD HH24:MI') as created_at
        FROM users
        JOIN chat
        ON (sender_id = users.id)
        ORDER BY chat.id DESC
        LIMIT 10
        `
    );
    return result.rows;
};

exports.insertChatMessage = async (msg, id) => {
    let result = await db.query(
        `
        INSERT INTO chat (message, sender_id)
        VALUES ($1, $2) RETURNING to_char(chat.created_at, 'YYYY Mon DD HH24:MI') as created_at
        `,
        [msg, id]
    );
    return result.rows[0].created_at;
};
