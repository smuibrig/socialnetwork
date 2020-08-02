import axios from "./axios";

export async function getFriendsAndRequests() {
    console.log("firing get friends and aspirants"); 
    let result;
    try {
        result = await axios.get("/friends-and-requests");
    } catch (err) {
        console.log(err);
    }

    console.log("getFriendsAspirants Data:", result.data); 

    return {
        type: "FRIENDS_AND_REQUESTS",
        friends: result.data,
    };
}

export async function acceptedFriendRequest(id) {
    
    try {
        await axios.post(`/accept-friend-request/${id}`);
    } catch (err) {
        console.log(err);
    }

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        senderId: id,
    };
}

export async function deleteFriendRequest(id) {
    try {
        await axios.post(`/end-friendship/${id}`);
    } catch (err) {
        console.log(err);
    }

    return {
        type: "END_FRIENDSHIP",
        id: id,
    };
}

export async function chatMessages(msgs) {
    console.log("action msgs:", msgs); 
    return {
        type: "SET_CHAT_MESSAGES",
        msgs: msgs,
    };
}

export async function chatMessage(msg) {
    console.log("in actions.js: ", msg); 
    return {
        type: "ADD_CHAT_MESSAGE",
        msg: msg,
    };
}
