import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="flex-column">
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
