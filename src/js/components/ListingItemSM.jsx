import { useEffect, useRef, useState } from 'react';
import { ReactComponent as EditIcon } from '../../assets/svg/editIcon.svg';
import { ReactComponent as DeleteIcon } from '../../assets/svg/deleteIcon.svg';

import axios from 'axios';
import { cleanUpTempFiles, delay } from '../utilityMethods';

import bedIcon from '../../assets/svg/bedIcon.svg';
import bathtubIcon from '../../assets/svg/bathtubIcon.svg';
import { Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Placeholder from './Placeholder';

// -----------------
function ListingItemSM({ id, listing, onEdit, onDelete, deleting, loginOut }) {
  const [coverImageLink, setCoverImageLink] = useState(null);
  const [loading, setLoading] = useState(true);

  const listingItemRef = useRef(null);

  const driveServerUrl = process.env.REACT_APP_DRIVE_SERVER_URL;

  const navigate = useNavigate();

  useEffect(() => {
    let cleanUpArr = [];

    if (!loginOut) {
      const getCoverImage = async () => {
        try {
          const response = await axios.get(
            `${driveServerUrl}/direct-links/${listing.imagesIds[0]}`
          );

          const { directLink, cleanUpPath } = response?.data.data;

          setCoverImageLink(directLink);
          cleanUpArr = [cleanUpPath];

          await delay(500);
          setLoading(false);
          await delay(100);
          listingItemRef.current.classList.replace('fade-out', 'fade-in');
        } catch (error) {
          toast.error('Could Not Load Listing');
        }
      };

      getCoverImage();
    }

    return async () => {
      !loginOut &&
        !deleting &&
        cleanUpArr?.length > 0 &&
        (await cleanUpTempFiles(cleanUpArr));
    };
  }, [listing.imagesIds, driveServerUrl, deleting, loginOut]);

  // ------------
  if (loading) return <Placeholder loading={loading} />;

  return (
    <li className="listingItem fade-out" ref={listingItemRef}>
      <Card
        bg="white"
        className="customShadow"
        onClick={(e) => {
          !e.target.closest('.edit-icon') &&
            !e.target.closest('.delete-icon') &&
            navigate(`/category/${listing.type}/${id}`);
        }}
      >
        <Card.Body className="p-2">
          <Card.Header className="d-flex flex-end p-0 border-0 bg-transparent">
            {onEdit && (
              <EditIcon
                className="edit-icon ms-auto"
                onClick={() => {
                  onEdit(id);
                }}
              />
            )}
            {onDelete && (
              <DeleteIcon
                fill="rgb(231,76,60"
                onClick={() => {
                  onDelete(id);
                }}
                className="delete-icon ms-1"
              />
            )}
          </Card.Header>
          <Row className="g-3 mb-3">
            <Col xs={5}>
              <Card.Img
                src={coverImageLink}
                alt="coverImage"
                className="h-100"
              />
            </Col>
            <Col xs={7}>
              <Card.Text
                as={'div'}
                className="d-flex flex-column justify-content-between h-100"
              >
                <p className="fs-8 opacity-75 fw-semibold mb-0">
                  {listing.location}
                </p>
                <div className="info-control">
                  <img src={bedIcon} alt="bed icon" />
                  <span className="fs-8 ms-2 fw-medium">
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} Bedrooms`
                      : '1 Bedroom'}
                  </span>
                </div>
                <div className="info-control">
                  <img src={bathtubIcon} alt="bathtub icon" />
                  <span className="fs-8 ms-2 fw-medium">
                    {listing.bathrooms > 1
                      ? `${listing.bathrooms} Bathrooms`
                      : '1 Bathroom'}
                  </span>
                </div>{' '}
              </Card.Text>
            </Col>
          </Row>
          <Card.Text as={'div'}>
            <h4 className="fs-5 mb-1">{listing.name}</h4>
            <strong className="text-secondary">
              $
              {listing.offer
                ? listing.discountPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {listing.type === 'rent' && ' / Month'}
            </strong>
          </Card.Text>
        </Card.Body>
      </Card>
    </li>
  );
}

export default ListingItemSM;
