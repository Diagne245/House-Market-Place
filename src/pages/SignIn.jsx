import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../js/components/OAuth';
import { Button, Container, Form } from 'react-bootstrap';

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign In User to Firebase
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        navigate('/profile');
      }
    } catch (error) {
      toast.error('Bad User Credentials');
    }
  };

  return (
    <>
      <Container fluid="mlg" className="pageContainer sign-in pt-5">
        <header>
          <h4 className="opacity-85 ms-3">Welcome Back!</h4>
        </header>

        <Form onSubmit={onSubmit}>
          <Form.Group className="vstack gap-4 mb-5">
            <Form.Control
              type="email"
              id="email"
              className="emailInput"
              placeholder="Email"
              value={email}
              onChange={onChange}
              spellCheck='false'
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
            <Link to="/forgot-password" className="d-flex justify-content-end">
              <Button
                variant="transparent"
                className="fw-semibold text-primary px-2 mt-n3"
              >
                Forgot Password
              </Button>
            </Link>
            <div className="signInBar ms-3">
              <Button
                type="submit"
                variant="transparent"
                className="fs-4 fw-bold px-2 text-secondary"
              >
                Sign In
              </Button>
              <Button
                type="submit"
                variant="secondary"
                style={{ padding: '.8rem' }}
              >
                <img src={arrowRightIcon} alt="sign in icon" width={'30px'} />
              </Button>
            </div>
          </Form.Group>
        </Form>

        <OAuth />

        <Link to="/sign-up" className="text-center">
          <Button variant="transparent" className="fw-semibold text-primary">
            Sign Up Instead
          </Button>
        </Link>
      </Container>
    </>
  );
}

export default SignIn;
