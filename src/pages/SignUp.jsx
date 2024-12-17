import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db } from '../firebase.config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

import { toast } from 'react-toastify';
import OAuth from '../js/components/OAuth';
import { Button, Container, Form } from 'react-bootstrap';

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add User to Firebase
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Add user to FireStore
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/profile');
    } catch (error) {
      toast.error('Something Went Wrong!');
    }
  };

  return (
    <>
      <Container fluid="mlg" className="pageContainer sign-in pt-5">
        <header>
          <h4 className="opacity-85 ms-3">Welcome!</h4>
        </header>

        <Form.Group onSubmit={onSubmit} className="vstack gap-4 mb-5">
          <Form.Control
            type="text"
            id="name"
            className="nameInput"
            placeholder="Enter Name"
            value={name}
            onChange={onChange}
            spellCheck="false"
          />

          <Form.Control
            type="email"
            id="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={onChange}
            spellCheck="false"
          />

          <div className="passwordInputDiv">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="passwordInput"
              placeholder="Enter Password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="Visibility Icon"
              className="showPassword"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          </div>

          <div className="signUpBar ms-3 text-secondary">
            <Button
              type="submit"
              variant="transparent"
              className="fs-4 fw-bold px-2 text-secondary"
            >
              Sign Up
            </Button>
            <Button
              type="submit"
              variant="secondary"
              style={{ padding: '.8rem' }}
            >
              <img src={arrowRightIcon} alt="sign up icon" width={'30px'} />
            </Button>
          </div>
        </Form.Group>

        <OAuth />

        <Link to="/sign-in" className="text-center">
          <Button variant="transparent" className="fw-semibold text-primary">
            Sign In Instead
          </Button>
        </Link>
      </Container>
    </>
  );
}

export default SignUp;
