import { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getImagesIdsArray,
  removeImageFilesFromDrive,
} from '../js/utilityMethods';

import Spinner from '../js/components/Spinner';
import { toast } from 'react-toastify';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Form, Button, Card, Container } from 'react-bootstrap';

// -------------------------
function EditListing() {
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [changeImages, setChangeImages] = useState(false);

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    location: '',
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: [],
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    location,
    offer,
    regularPrice,
    discountPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  // Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('You can not edit that listing');
      navigate('/');
    }
  });

  // Prefill Form with edited listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'listings', params.listingId));
        if (docSnap.exists()) {
          setListing(docSnap.data());
          setFormData({
            ...docSnap.data(),
            latitude: docSnap.data().geolocation.lat,
            longitude: docSnap.data().geolocation.lng,
            images: [],
          });
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error('Could Not Fetch Listing Details');
        navigate('/');
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  // Add userRef Field
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // --------------
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (discountPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discount Price must be lower than Regular Price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images');
      return;
    }

    const geolocation = {};
    geolocation.lat = latitude;
    geolocation.lng = longitude;

    // Adding listing to fireStore -------

    const formDataCopy = {
      ...formData,
      geolocation,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !offer && delete formDataCopy.discountPrice;

    try {
      const docRef = doc(db, 'listings', params.listingId);

      if (!changeImages) {
        await updateDoc(docRef, formDataCopy);
      } else {
        // Remove Previously uploaded files from storage
        await removeImageFilesFromDrive(formData.imagesIds);

        // Upload images to storage and return their ids
        const imagesIds = await getImagesIdsArray(
          auth.currentUser.uid,
          docRef.id,
          images
        );

        // Add imagesIds field to listing document
        imagesIds.length > 0 &&
          (await updateDoc(doc(db, 'listings', docRef.id), {
            ...formDataCopy,
            imagesIds,
          }));
      }

      setLoading(false);
      toast.success('Listing Updated');
      navigate(`/category/${formDataCopy.type}/${params.listingId}`);
    } catch (error) {
      setLoading(false);
      toast.error('Could Not Update Listing');
      navigate('/profile');
    }
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({ ...prevState, images: e.target.files }));
    }

    // Text/Number/Booleans
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <Container
        fluid="md"
        className="create-listing-page pageContainer pt-4 pt-sm-5"
      >
        <Card className="createListing">
          <Card.Body>
            <Card.Header>
              <h1 className="fs-1 mb-1 text-center">Edit Listing</h1>
            </Card.Header>

            <Form
              onSubmit={onSubmit}
              encType={'multipart/form-data'}
              className="d-flex flex-column align-items-center mb-4"
            >
              <Form.Label className="formLabel">Sell / Rent</Form.Label>
              <div className="formButtons">
                <Button
                  variant="secondary"
                  id="type"
                  value="sale"
                  onClick={onMutate}
                  className={`focus-ring-secondary ${
                    type === 'sale' ? 'formButtonActive' : 'formButton'
                  }`}
                >
                  Sell
                </Button>
                <Button
                  variant="secondary"
                  id="type"
                  value="rent"
                  onClick={onMutate}
                  className={
                    type === 'rent' ? 'formButtonActive' : 'formButton'
                  }
                >
                  Rent
                </Button>
              </div>

              <Form.Label htmlFor="name" className="formLabel">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                id="name"
                name="name"
                className="formInputName w-100 w-sm-90 w-md-80"
                style={{ padding: '.8rem 1rem', borderRadius: '1.25rem' }}
                value={name}
                onChange={onMutate}
                spellCheck="false"
                maxLength={32}
                minLength={8}
                required
              />

              <div className="formRooms w-65">
                <Form.Label
                  htmlFor="bedrooms"
                  className="formLabel w-50 w-sm-45"
                >
                  Bedrooms
                  <Form.Control
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    className="formInputSmall w-100"
                    value={bedrooms}
                    onChange={onMutate}
                    min={1}
                    max={50}
                    required
                  />
                </Form.Label>

                <Form.Label
                  htmlFor="bathrooms"
                  className="formLabel w-50 w-sm-45"
                >
                  Bathrooms
                  <Form.Control
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    className="formInputSmall w-100"
                    value={bathrooms}
                    onChange={onMutate}
                    min={1}
                    max={50}
                    required
                  />
                </Form.Label>
              </div>

              <Form.Label className="formLabel">Parking Spot</Form.Label>
              <div className="formButtons">
                <Button
                  variant="secondary"
                  id="parking"
                  name="parking"
                  className={`focus-ring-secondary ${
                    parking ? 'formButtonActive' : 'formButton'
                  }`}
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  id="parking"
                  name="parking"
                  className={`focus-ring-secondary ${
                    parking ? 'formButton' : 'formButtonActive'
                  }`}
                  value={false}
                  onClick={onMutate}
                >
                  No
                </Button>
              </div>

              <Form.Label className="formLabel">Furnished</Form.Label>
              <div className="formButtons">
                <Button
                  variant="secondary"
                  id="furnished"
                  name="furnished"
                  className={`focus-ring-secondary ${
                    furnished ? 'formButtonActive' : 'formButton'
                  }`}
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  id="furnished"
                  name="furnished"
                  className={`focus-ring-secondary ${
                    furnished ? 'formButton' : 'formButtonActive'
                  }`}
                  value={false}
                  onClick={onMutate}
                >
                  No
                </Button>
              </div>

              <Form.Label htmlFor="location" className="formLabel w-90 w-sm-80">
                Location
                <Form.Control
                  as="textarea"
                  id="location"
                  name="location"
                  className="formInputAddress w-100"
                  style={{ padding: '.8rem 1.25rem' }}
                  value={location}
                  spellCheck="false"
                  onChange={onMutate}
                  required
                ></Form.Control>
              </Form.Label>

              <div className="geolocation w-75">
                <Form.Label htmlFor="latitude" className="formLabel">
                  Latitude
                  <Form.Control
                    type="number"
                    id="latitude"
                    name="latitude"
                    className="formInputSmall w-100 w-sm-90"
                    value={latitude}
                    onChange={onMutate}
                    required
                  />
                </Form.Label>
                <Form.Label htmlFor="longitude" className="formLabel">
                  Longitude
                  <Form.Control
                    type="number"
                    id="longitude"
                    name="longitude"
                    className="formInputSmall w-100 w-sm-90"
                    value={longitude}
                    onChange={onMutate}
                    required
                  />
                </Form.Label>
              </div>

              <Form.Label className="formLabel">Offer</Form.Label>
              <div className="formButtons">
                <Button
                  variant="secondary"
                  id="offer"
                  className={`focus-ring-secondary ${
                    offer ? 'formButtonActive' : 'formButton'
                  }`}
                  value={true}
                  onClick={onMutate}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  id="offer"
                  className={`focus-ring-secondary ${
                    !offer ? 'formButtonActive' : 'formButton'
                  }`}
                  value={false}
                  onClick={onMutate}
                >
                  No
                </Button>
              </div>

              <Form.Label htmlFor="regularPrice" className="formLabel">
                Regular Price
                <div className="formPriceDiv">
                  <Form.Control
                    type="number"
                    name="regularPrice"
                    id="regularPrice"
                    className="formInputSmall"
                    value={regularPrice}
                    onChange={onMutate}
                    min={100}
                    max={750000000}
                    required
                  />
                  {type === 'rent' && (
                    <p className="formPriceText  mb-0">$ / Month</p>
                  )}
                </div>
              </Form.Label>
              {offer && (
                <Form.Label htmlFor="discountPrice" className="formLabel">
                  Discount Price
                  <Form.Control
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    className="formInputSmall"
                    value={discountPrice}
                    onChange={onMutate}
                    min={100}
                    max={750000000}
                    required
                  />
                </Form.Label>
              )}

              <Form.Label className="formLabel">Images</Form.Label>

              <p className="fs-7 opacity-75 mb-1">
                The first image will be the cover (max 6).
              </p>

              {!changeImages ? (
                <Button
                  variant="secondary"
                  className="fw-medium"
                  style={{ padding: '.75rem 1.5rem' }}
                  onClick={() => {
                    setChangeImages(true);
                  }}
                >
                  Change Images
                </Button>
              ) : (
                <Form.Control
                  type="file"
                  name="images"
                  id="images"
                  className="formInputFile w-100 w-sm-90 p-1 rounded-7 fs-sm-6"
                  onChange={onMutate}
                  max={6}
                  accept=".jpg,.png,.jpeg"
                  multiple
                  required
                />
              )}

              <Button
                variant="secondary"
                size="lg"
                type="submit"
                className="mt-6 w-100 w-sm-90 fw-semibold"
                style={{ padding: '.75rem' }}
              >
                Update Listing
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default EditListing;
