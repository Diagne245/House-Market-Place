import { useState } from 'react';
import { Link } from 'react-router-dom';
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Button, Container, Form } from 'react-bootstrap';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email Was Sent');
    } catch (error) {
      toast.error('Could Not Send Reset Email');
    }
  };

  return (
    <Container fluid="mlg" className="forgot-password pageContainer pt-5">
      <header>
        <h1 className="fs-2">Forgot Password</h1>
      </header>

      <main>
        <Form onSubmit={onSubmit}>
          <Form.Control
            type="email"
            id="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={onChange}
          />

          <Link to="/sign-in" className="d-flex justify-content-end">
            <Button
              variant="transparent"
              className="fw-semibold text-primary px-2"
            >
              Sign In
            </Button>
          </Link>

          <div className="mt-3 d-flex justify-content-between">
            <Button
              type="submit"
              variant="transparent"
              className="fs-5 fw-bold px-2 text-secondary"
            >
              Send Reset Link
            </Button>
            <Button
              type="submit"
              variant="secondary"
              style={{ padding: '.7rem' }}
            >
              <img src={arrowRightIcon} alt="sign in icon" width={'30px'} />
            </Button>
          </div>
        </Form>
      </main>
    </Container>
  );
}

export default ForgotPassword;
