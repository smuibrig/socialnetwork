import React, { useEffect } from "react";
import axios from "./axios";

export default function Logout() {
    useEffect(() => {
        (async () => {
            console.log("logout is fired");
            let ok;
            try {
                ok = await axios.get("/logout");
            } catch (err) {
                console.log("error: ", err);
            }
            if (ok) {
                location.replace("/");
            }
        })();
    }, []);
    return null;
}
