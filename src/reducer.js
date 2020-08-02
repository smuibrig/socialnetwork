export default function reducer(state = {}, action) {
    if (action.type === "FRIENDS_AND_REQUESTS") {
        return {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        return {
            ...state,
            friends: state.friends.map((user) => {
                if (user.id === action.senderId) {
                    user.accepted = true;
                }
                return user;
            }),
        };
    }

    if (action.type === "END_FRIENDSHIP") {
        return {
            ...state,
            friends: state.friends.filter((user) => {
                return user.id != action.id;
            }),
        };
    }

    if (action.type === "SET_CHAT_MESSAGES") {
        return {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type === "ADD_CHAT_MESSAGE") {
        console.log("add_chat_message:", action.msg);
        return {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
    }
}
