import React from "react";

import { useStatefulFields } from "./hooks/useStatefulFields";
import { useAuthSubmit } from "./hooks/useAuthSubmit";

export default function Welcome() {
    const [values, handleChange] = useStatefulFields();
    const [errorLogin, handleSubmitLogin] = useAuthSubmit(
        "/api/login",
        values,
        "/"
    );
    const [errorRegister, handleSubmitRegister] = useAuthSubmit(
        "/api/register",
        values,
        "/"
    );

    return (
        <div>
            <div className="form">
                {(errorLogin || errorRegister) && (
                    <div className="error">
                        Oops.Something went wrong.
                        <br />
                        Please try again.
                    </div>
                )}
                <div className="form-elements">
                <div className="form-element">
                        <input
                            name="name"
                            placeholder="name"
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className="form-element">
                        <input
                            name="email"
                            placeholder="email"
                            onChange={e => handleChange(e)}
                        />
                    </div>
                    <div className="form-element">
                        <input
                            name="password"
                            type="password"
                            placeholder="password"
                            onChange={e => handleChange(e)}
                        />
                    </div>
                </div>
            </div>
            <div>
                <button className="btn-class" onClick={e => handleSubmitLogin(e)}>
                    Log in
                </button>
                <button className="btn-class" onClick={e => handleSubmitRegister(e)}>
                    Register
                </button>
            </div>
            <a href="/auth/google">sign up with Google</a>
        </div>
    );
}