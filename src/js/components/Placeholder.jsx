import { useEffect, useRef } from 'react';
import { Card, Spinner } from 'react-bootstrap';

function Placeholder({ loading }) {
  const listingItemRef = useRef(null);

  useEffect(() => {
    loading
      ? listingItemRef.current.classList.replace('fade-out', 'fade-in')
      : listingItemRef.current.classList.replace('fade-in', 'fade-out');
  });

  return (
    <li
      className="w-100 w-sm-90 listingItem fade-out"
      ref={listingItemRef}
      style={{ transition: 'opacity 1s ease-in' }}
    >
      <Card
        bg="transparent"
        className="customShadow"
        style={{ height: '225px' }}
      >
        <Card.Body className="d-flex justify-content-center align-items-center">
          <div className="spinner-control">
            <Spinner variant="warning" animation="grow" size="sm" />
            <Spinner variant="primary" animation="grow" />
            <Spinner variant="danger" animation="grow" size="sm" />
          </div>
        </Card.Body>
      </Card>
    </li>
  );
}

export default Placeholder;
