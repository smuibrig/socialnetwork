import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople(props) {
    const [latestUsers, setLatestUsers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [name, setInput] = useState("");

    useEffect(() => {
        let userData;
        (async () => {
            try {
                userData = await axios.get("/latestusers");
            } catch (err) {
                console.log("error: ", err);
            }
            setLatestUsers(userData.data);
        })();

        if (name) {
            let matchData;
            (async () => {
                try {
                    matchData = await axios.get(`/api/getmatch?name=${name}`);
                } catch (err) {
                    console.log("error: ", err);
                }

                console.log("matchData", matchData.data);
                setMatches(matchData.data);
            })();
        }
    }, [name]);

    return (
        <div className="flex-column">
            {name == "" && <h3>See who is new to this plattform</h3>}
            {name == "" && (
                <div className="grid-container">
                    {latestUsers.map((user, index) => (
                        <div className="person" key={index}>
                            <img className="find-pics" src={user.url} />
                            <Link to={`/user/${user.id}`}>
                                <span>
                                    {user.first} {user.last}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            {name == "" && <h3>Find your friends here</h3>}
            <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter the name or email"
            />
            {name != "" && <h3>Here are your search results</h3>}
            {name != "" && (
                <div className="grid-container">
                    {matches.map((match, index) => (
                        <div className="person" key={index}>
                            <img className="find-pics" src={match.url} />
                            <Link to={`/user/${match.id}`}>
                                <span>
                                    {match.first} {match.last}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
