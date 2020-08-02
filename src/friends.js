import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const users = useSelector((state) => {
        console.log("FOO", state);
        if (state) {
            if (state.friends) {
                return state.friends;
            }
        }
        return [];
    });

    let friends = users.filter((user) => user.accepted);
    let requests = users.filter((user) => !user.accepted);

    useEffect(() => {
        dispatch(actions.getFriendsAndRequests());
    }, []);

    return (
        <div className="flex-column">
            <h3>Friends</h3>
            <div className="grid-container">
                {friends &&
                    friends.map((user, index) => (
                        <div className="person" key={index}>
                            <img className="find-pics" src={user.url} />
                            <Link to={`/user/${user.id}`}>
                                <span className='friends-name'>
                                    {user.first} {user.last}
                                </span>
                            </Link>
                            <button
                                className="friends-buttons"
                                onClick={(e) =>
                                    dispatch(
                                        actions.deleteFriendRequest(user.id)
                                    )
                                }
                            >
                                End friendship
                            </button>
                        </div>
                    ))}
            </div>
            <h3>People who'd like to be your friend</h3>
            <div className="grid-container margin_bottom">
                {requests &&
                    requests.map((user, index) => (
                        <div className="person" key={index}>
                            <img className="find-pics" src={user.url} />
                            <Link to={`/user/${user.id}`}>
                                <span className='friends-name'>
                                    {user.first} {user.last}
                                </span>
                            </Link>
                            <button
                                className="friends-buttons"
                                onClick={(e) =>
                                    dispatch(
                                        actions.deleteFriendRequest(user.id)
                                    )
                                }
                            >
                                Decline request
                            </button>
                            <button
                                className="friends-buttons"
                                onClick={(e) =>
                                    dispatch(
                                        actions.acceptedFriendRequest(user.id)
                                    )
                                }
                            >
                                Accept request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
