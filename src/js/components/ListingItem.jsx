import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as EditIcon } from '../../assets/svg/editIcon.svg';
import { ReactComponent as DeleteIcon } from '../../assets/svg/deleteIcon.svg';

import axios from 'axios';
import { cleanUpTempFiles, delay } from '../utilityMethods';

import bedIcon from '../../assets/svg/bedIcon.svg';
import bathtubIcon from '../../assets/svg/bathtubIcon.svg';
import { Card, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Placeholder from './Placeholder';

// -----------------
function ListingItem({ id, listing, onEdit, onDelete, deleting, loginOut }) {
  const [coverImageLink, setCoverImageLink] = useState(null);
  const [loading, setLoading] = useState(true);

  const driveServerUrl = process.env.REACT_APP_DRIVE_SERVER_URL;

  const navigate = useNavigate();
  const listingItemRef = useRef(null);

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

  //------------------------
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
        <Card.Body className="p-3">
          <Card.Header className="d-flex flex-end p-0 border-0 bg-transparent position-relative z-3">
            {onEdit && (
              <EditIcon
                className="edit-icon ms-auto me-2"
                onClick={() => {
                  onEdit(id);
                }}
              />
            )}
            {onDelete && (
              <DeleteIcon
                fill="rgb(231,76,60"
                className="delete-icon"
                onClick={() => {
                  onDelete(id);
                }}
              />
            )}
          </Card.Header>
          <Row className="g-sm-3 align-items-center">
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
                className="d-flex flex-column justify-content-between"
              >
                <p className="fs-sm-7 fs-md-6 opacity-75">{listing.location}</p>
                <h5 className="fs-mmd-5 fs-md-4 fw-semibold my-2">
                  {listing.name}
                </h5>
                <strong className="fs-7 fs-sm-6 fs-md-5 text-secondary fw-semibold">
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
                <div className="d-sm-flex gap-2 pt-1">
                  <div className="info-control">
                    <img src={bedIcon} alt="bed icon" />
                    <span className="fs-7 fs-md-6 ms-sm-1 opacity-75">
                      {listing.bedrooms > 1
                        ? `${listing.bedrooms} Bedrooms`
                        : '1 Bedroom'}
                    </span>
                  </div>
                  <div className="info-control">
                    <img src={bathtubIcon} alt="bathtub icon" />
                    <span className="fs-7 fs-md-6 ms-sm-1 opacity-75">
                      {listing.bathrooms > 1
                        ? `${listing.bathrooms} Bathrooms`
                        : '1 Bathroom'}
                    </span>
                  </div>
                </div>{' '}
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </li>
  );
}

export default ListingItem;
