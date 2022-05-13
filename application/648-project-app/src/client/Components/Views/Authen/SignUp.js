import React, { useRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga';
import LandingNavbar from '../../Nav/LandingNavbar';
import MobileLandingNav from '../../Nav/MobileLandingNav';
// import "./App.css";
import Modal from '../../Modal/Modal';

const SignUp = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const usernameRegex = /^(?=.*\d)(|.*[a-z])(|.*[A-Z])[0-9+a-zA-Z]{3,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phoneNumberRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

    const history = useHistory();
    const firstNameMessage = useRef();
    const lastNameMessage = useRef();
    const phoneNumberMessage = useRef();
    const emailMessage = useRef();
    const usernameMessage = useRef();
    const passwordMessage = useRef();
    const confirmPasswordMessage = useRef();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmpassword] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [allValid, setAllValid] = useState(false);
    const [result, setResult] = useState();
    const [tosChecked, settosChecked] = useState(null);
    function handleChange(e) {
        ReactGA.event({
            category: 'Button',
            action: 'signup user sent to backend',
        });

        e.preventDefault();
        const event = e.target.name;
        switch (event) {
        case 'firstname':
            setFirstname(e.target.value);
            break;
        case 'lastname':
            setLastname(e.target.value);
            break;
        case 'phonenumber':
            setPhone(e.target.value);
            break;
        case 'email':
            setEmail(e.target.value);
            break;
        case 'username':
            setUsername(e.target.value);
            break;
        case 'password':
            setPassword(e.target.value);
            break;
        case 'confirmpassword':
            setConfirmpassword(e.target.value);
        }
    }
    function handleSubmit() {
        if (allValid) {
            // DO POST REQUEST
            const uri = `http://${window.location.host}/api/user`;
            const body = {
                username,
                password,
                password_confirmation: confirmPassword,
                firstname,
                lastname,
                phone,
                email,
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
                        console.log(results.status);
                        history.push('/signin');
                    } else {
                        setResult(results);
                    }
                })
                .catch((validationError) => {
                    console.validationError('validationError:', validationError);
                });
        }
    }

    function validChecker() {
        if (nameRegex.test(firstname)) {
            firstNameMessage.current.innerHTML = '';
        } else firstNameMessage.current.innerHTML = 'First name should only have alphabetical characters';

        if (nameRegex.test(lastname)) {
            lastNameMessage.current.innerHTML = '';
        } else lastNameMessage.current.innerHTML = 'Last name should only have alphabetical characters';

        if (phoneNumberRegex.test(phone)) {
            phoneNumberMessage.current.innerHTML = '';
        } else phoneNumberMessage.current.innerHTML = 'Phone number should be 10 digits';

        if (emailRegex.test(email)) {
            emailMessage.current.innerHTML = '';
        } else emailMessage.current.innerHTML = 'Email format should be standard';

        if (usernameRegex.test(username)) {
            usernameMessage.current.innerHTML = '';
        } else usernameMessage.current.innerHTML = 'Username must be atleast 3 alphanumerical characters';

        if (passwordRegex.test(password)) {
            passwordMessage.current.innerHTML = '';
        } else passwordMessage.current.innerHTML = 'Must be length >= 8, contain number, letter and special character';

        if (password !== confirmPassword) {
            confirmPasswordMessage.current.innerHTML = 'Password confirmation must match';
        } else confirmPasswordMessage.current.innerHTML = '';
    }
    function checkAll() {
        const validateFirstname = nameRegex.test(firstname);
        const validateLastname = nameRegex.test(lastname);
        const validatephone = phoneNumberRegex.test(phone);
        const validateEmail = emailRegex.test(email);
        const validateUsername = usernameRegex.test(username);
        const validatePW = passwordRegex.test(password);
        const validateConfirmPW = password === confirmPassword;
        if (validateFirstname && validateLastname && validatephone && validateEmail && validateUsername && validatePW
            && validateConfirmPW && tosChecked) {
            setAllValid(true);
        } else setAllValid(false);
    }
    function handleClick(e) {
        settosChecked(e.target.checked);
    }
    useEffect(() => {
        validChecker();
        checkAll();
    }, [firstname, lastname, email, phone, password, confirmPassword, username, tosChecked]);

    const modalOnClose = () => {
        setResult(null);
    };
    return (
      <div>
            <h1 style = {
               {
                textAlign: "center",
                position:"relative",
                top: "120px",
               }
           }>SFSU Software Engineering Project CSC 648-848, Fall 2021 Team 2. <br/> For Demonstration Only</h1>
          {result && <Modal title="Signup" message={result.message} onClose={modalOnClose} />}

          <div className="sign-up">

              <form className="register">
                  <h3>Sign Up!</h3>

                  <div className="first-name">
                      <label>First Name:</label>
                      <input name="firstname" type="text" placeholder="Enter First Name" onChange={handleChange} required />
                      <p ref={firstNameMessage} />
                    </div>

                  <div className="last-name">
                      <label>Last Name:</label>
                      <input name="lastname" type="text" placeholder="Enter Last Name" onChange={handleChange} required />
                      <p ref={lastNameMessage} />
                    </div>

                  <div className="phone-number">
                      <label>Phone Number:</label>
                      <input name="phonenumber" type="number" placeholder="Enter Phone Number" onChange={handleChange} required />
                      <p ref={phoneNumberMessage} />
                    </div>

                  <div className="email">
                      <label>Email:</label>
                      <input name="email" type="email" placeholder="Enter Email" onChange={handleChange} required />
                      <p ref={emailMessage} />
                    </div>

                  <div className="username">
                      <label>Username:</label>
                      <input name="username" type="text" placeholder="Enter Username" onChange={handleChange} required />
                      <p ref={usernameMessage} />
                    </div>

                  <div className="password">
                      <label>Password:</label>
                      <input name="password" type="password" placeholder="Enter Password" onChange={handleChange} required />
                      <p ref={passwordMessage} />
                    </div>

                  <div className="confirm-password">
                      <label>Confirm Password:</label>
                      <input name="confirmpassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
                      <p ref={confirmPasswordMessage} />
                    </div>
                  <div className="tos">
                      <label>I agree to TOS!:</label>
                      <input type="checkbox" required onClick={handleClick} />
                    </div>
                  <div className="authen-submit">
                        <input type="button" value="Sign Up!" onClick={handleSubmit} />
                    </div>
                  <div className="alt-opt">
                        <p>Already have an account?</p>
                        <a href="/#/signin">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
