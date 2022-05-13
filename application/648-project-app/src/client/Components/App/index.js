import React, { useCallback, useEffect, useState } from 'react';
import {
    HashRouter as Router, Redirect, Route, Switch, useLocation,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
/*
Google Analytics for React
    Reference:
        React JS Google Analytics to Track User Behavior in your react js website (Page Views, Click Events)
            Reference:
                https://www.youtube.com/watch?v=H-D-kaCjKfc

        Set up Analytics for a website (Universal Analytics)
            Notes:
                Google by default will create a Measurement Id, you nened a
            Reference:
                https://support.google.com/analytics/answer/10269537

        How to use Google Analytics with React?
            Reference:
                https://stackoverflow.com/a/62621476/9133458
 */
import ReactGA from 'react-ga';
import Home from '../Views/Home';
import SignUp from '../Views/Authen/SignUp';
import SignIn from '../Views/Authen/SignIn';
import LandingPage from '../Views/LandingPage';
import Upload from '../Views/UploadListing/Upload';
import './App.css';
import UserSettings from '../Views/Users/UserSettings';
import { AuthContext } from '../../context/auth-context';
import MainNavbar from '../Nav/MainNavbar';
import UserProfile from '../Views/Users/UserProfile';
import ListingProfile from '../Views/Listings/ListingProfile';

function googleAnalytics() {
    // const location = useLocation();

    useEffect(() => {
        ReactGA.initialize('UA-214423504-1');
        // ReactGA.pageview(location.pathname + location.search);
        // console.log(location.pathname + location.search);

        ReactGA.pageview(window.location.pathname + window.location.search);
        console.log(window.location.pathname + window.location.search);
    }, []);
}

const App = () => {
    googleAnalytics();

    const [userId, setUserId] = useState(false);
    const [userName, setUserName] = useState(false);
    const [token, setToken] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // remember to set back to false
    const login = useCallback((user_id, username) => {
        setUserId(user_id);
        setUserName(username);
        setIsLoggedIn(true);
        const sessionCookie = cookie.load('connect.sid');
        if (sessionCookie) {
            setToken(sessionCookie);
        }
        localStorage.setItem('userData', JSON.stringify({
            userId: user_id,
            userName: username,
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserName(null);
        setIsLoggedIn(false);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        // check whether the user is already login
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            login(user.userId, user.userName);
        }
    }, [login]);

    // useEffect(() => {
    //    // check whether the user is logout
    //    setToken(null);
    // }, [token])

    let routes;
    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path="/home" exact>
                    <Home />
              </Route>
                <Route path="/uploadlisting" exact>
                    <Upload />
              </Route>
                <Route path="/settings" exact>
                    <UserSettings />
              </Route>
                <Route path="/users/:userId" exact component={UserProfile} />
                <Route path="/listings/:listingId" exact component={ListingProfile} />
                <Redirect to="/home" exact/>
          </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <LandingPage />
              </Route>
                <Route path="/home" exact>
                    <Home />
              </Route>
                <Route path="/signin" exact>
                    <SignIn />
              </Route>
                <Route path="/signup" exact>
                    <SignUp />
              </Route>
                <Redirect to="/" exact/>
          </Switch>
        );
    }
    return (
        <AuthContext.Provider
            value={{
                // Initialization of auth context
                isLoggedIn: !!token,
                token,
                userName,
                userId,
                login,
                logout,
            }}
      >
            <div className="App">

                <Router>
                    <MainNavbar />
                    <main>{routes}</main>
              </Router>
          </div>
      </AuthContext.Provider>
    );
};
const root = document.getElementById('root');
if (root) ReactDOM.render(<App />, root);
export default App;
