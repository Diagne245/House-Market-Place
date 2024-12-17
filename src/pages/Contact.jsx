import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { Button, Container, Form } from 'react-bootstrap';

function Contact() {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could Not Get Landlord Data');
      }
    };

    getLandlord();
  }, [params.landlordId]);

  const onchange = (e) => setMessage(e.target.value);

  return (
    <Container fluid="mlg" className="contact pageContainer mt-4">
      <header className="mb-4">
        <h1 className="fs-1">Contact Landlord</h1>
      </header>

      {landlord !== null && (
        <main>
          <Form className="vstack gap-4">
            <Form.Label htmlFor="message">
              <p className="fs-5 fw-medium">
                Contact{' '}
                <strong className="text-secondary">{landlord?.name}</strong>
              </p>
            </Form.Label>

            <Form.Control
              as="textarea"
              name="message"
              id="message"
              className="textarea rounded-3 py-2 px-3"
              style={{ height: '7rem' }}
              placeholder="Enter Message"
              value={message}
              onChange={onchange}
            />

            <a
              href={`mailto:${landlord.email}?subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <Button
                type="button"
                variant="secondary"
                className="fw-bold rounded-3 px-3"
              >
                Send Message
              </Button>
            </a>
          </Form>
        </main>
      )}
    </Container>
  );
}

export default Contact;
