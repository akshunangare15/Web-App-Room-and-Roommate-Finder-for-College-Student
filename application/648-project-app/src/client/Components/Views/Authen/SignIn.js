import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import LandingNavbar from '../../Nav/LandingNavbar';
import MobileLandingNav from '../../Nav/MobileLandingNav';
import './index.css';
import Modal from '../../Modal/Modal';
// import { ReactSession } from "react-client-session";
import { AuthContext } from '../../../context/auth-context';
import ReactGA from 'react-ga';

const SignIn = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const history = useHistory();
    const [result, setResult] = useState();

    const auth = useContext(AuthContext);
    const modalOnClose = () => {
        setResult(null);
    };

    function handleSubmit() {
        ReactGA.event({
            category: 'Button',
            action: 'login user sent to backend',
        });

        const uri = `http://${window.location.host}/api/user/login`;
        const body = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        fetch(uri, {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            headers: new Headers({
                'content-type': 'application/json',
            }),
        })
            .then((response) => response.json())
            .then((results) => {
                if (results.status === 'success') {
                    auth.login(results.user_id, results.username);
                    history.push('/');
                    location.replace('/#/home');
                    // TODO add username to client session
                } else {
                    setResult(results);
                }
            })
            .catch((validationError) => {
                console.validationError('validationError:', validationError);
            });
    }
    return (
      <div>
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
          {result && <Modal title="Login failed" message={result.message} onClose={modalOnClose} />}

          <div className="sign-in">
              <form id="loginForm">
                  <div className="username">
                      <label>Username:</label>
                      <input type="text" placeholder="Enter Username" required ref={usernameRef} />
                    </div>

                  <div className="password">
                      <label>Password:</label>
                      <input type="password" placeholder="Enter Password" required ref={passwordRef} />
                    </div>

                  <div className="authen-submit">
                      <input type="button" value="Login!" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>

    );
};

export default SignIn;
