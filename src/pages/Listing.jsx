import { Button, Container } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper/modules';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase.config';

import axios from 'axios';
import { cleanUpTempFiles } from '../js/utilityMethods';

import altHouseImage from '../assets/house-images/alt-house-image.avif';
import Spinner from '../js/components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { toast } from 'react-toastify';

// ---------------
function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const driveServerUrl = process.env.REACT_APP_DRIVE_SERVER_URL;

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    let cleanUpArr = [];

    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'listings', params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const listingCopy = docSnap.data();

          const response = await axios.get(`${driveServerUrl}/direct-links`, {
            params: { fileIds: listingCopy.imagesIds },
          });

          const { directLinks, cleanUpPaths } = response?.data.data;

          listingCopy.imageUrls = directLinks;

          setListing(listingCopy);
          cleanUpArr = cleanUpPaths;

          setIsFetching(false);
          setLoading(false);
        }
      } catch (error) {
        toast.error('Could not fetch Listing');
      }
    };

    fetchListing();

    return async () => {
      cleanUpArr?.length > 0 && (await cleanUpTempFiles(cleanUpArr));
    };
  }, [params.listingId, driveServerUrl]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="listing-page">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        autoplay={{
          delay: 7500,
          disableOnInteraction: false,
        }}
        autoHeight={true}
        pagination={{ clickable: true }}
      >
        {listing.imageUrls.map((imageUrl) => (
          <SwiperSlide key={imageUrl}>
            <div className="slider-control position-relative h-100">
              <img
                src={isFetching ? altHouseImage : imageUrl}
                alt="coverImage"
                className="swiperSlideImg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Container fluid="mlg" className="pageContainer position-relative pt-3">
        <Button
          variant="white"
          className="shareIconDiv shadow"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        >
          <img src={shareIcon} alt="share icon" />
        </Button>
        {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

        <h2 className="mt-3 fs-3 w-85 mb-3">
          {listing.name} - $
          {listing.offer
            ? listing.discountPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </h2>

        <p className="fw-normal mb-3">{listing.location}</p>
        <Button variant="primary" className="roundedPill text-white me-3">
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </Button>

        {listing.offer && (
          <Button variant="dark" className="roundedPill ">
            $
            {(listing.regularPrice - listing.discountPrice)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            discount
          </Button>
        )}
        <ul className="list-group list-group-flush mt-2">
          <li className="list-group-item">
            {' '}
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li className="list-group-item">
            {' '}
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>

          <li className="list-group-item">
            {listing.parking && 'Parking Spot'}
          </li>
          <li className="list-group-item">
            {listing.furnished && 'Furnished'}
          </li>
        </ul>

        <h4 className="mt-4">Location</h4>

        <div id="map" className="leafletContainer">
          <MapContainer
            className="w-100 h-100"
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <div className="d-flex justify-content-center">
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            >
              <Button
                variant="primary"
                size="lg"
                className="text-white fw-semibold shadow"
              >
                Contact Landlord
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}

export default Listing;
