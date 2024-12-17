import { useEffect, useRef, useState } from 'react';
import useResponsiveWidth from '../js/hooks/useResponsiveWidth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../firebase.config';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import ListingItem from '../js/components/ListingItem';
import ListingItemSM from '../js/components/ListingItemSM';

import { cleanUpTempFiles, removeFolderFromDrive } from '../js/utilityMethods';

import homeIcon from '../assets/svg/homeIcon.svg';
import { Button, Container, Form } from 'react-bootstrap';
import Placeholder from '../js/components/Placeholder';

// ----------------
function Profile() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loginOut, setLoginOut] = useState(false);

  const width = useResponsiveWidth();
  const [changeDetails, setChangeDetails] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where(
            'userRef',
            '==',
            `${auth.currentUser.uid}`,
            orderBy('timestamp', 'desc')
          )
        );

        const listingsSnap = await getDocs(q);

        const listingsArr = [];
        listingsSnap.forEach((doc) => {
          listingsArr.push({ id: doc.id, data: doc.data() });
        });

        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error('Could Not Fetch Listings');
      }
    };

    fetchListings();
  }, [auth.currentUser.uid]);

  const onLogout = async () => {
    setLoginOut(true);

    try {
      await auth.signOut();
      navigate('/');
      setTimeout(() => {
        setLoginOut(false);
      }, 1000);
    } catch (error) {
      toast.error('Log Out Failed: Something Went Wrong');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const inputRef = useRef();

  const onSubmit = async (e = null) => {
    if (e !== null) {
      e.preventDefault();
      setFormData({ ...formData, name: inputRef.current.value });
      setChangeDetails(false);
    }

    try {
      if (auth.currentUser.displayName !== name) {
        // update Profile in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      // update Profile in fireStore
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      toast.error("Couldn't Update Credentials. Something Went Wrong!");
    }
  };

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const onDelete = async (listingId) => {
    if (window.confirm('Are you Sure you want to Delete?')) {
      setDeleting(true);

      try {
        const docRef = doc(db, 'listings', listingId);

        await deleteDoc(docRef);

        await removeFolderFromDrive(listingId);

        const userId = docRef.firestore._firestoreClient.user.uid;
        await cleanUpTempFiles(
          [`temp/user-${userId}/listing-${listingId}`],
          'folder'
        );

        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId
        );

        setListings(updatedListings);
        toast.success('Successfully Deleted Listing');
      } catch (error) {
        toast.error('Could Not Delete Listing');
      }
    }
  };

  return (
    <Container fluid="md" className="pageContainer profile">
      <div className="profile-top mb-6">
        <header className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fs-1 mb-0">Profile</h1>
          <Button variant="primary" className="logOut" onClick={onLogout}>
            Logout
          </Button>
        </header>

        <section className="profileDetails d-flex flex-column">
          <div className="profileDetailsHeader d-flex justify-content-between mb-1">
            <strong className="fw-semibold ms-3">Personal Details</strong>
            <Button
              variant="transparent"
              className="text-primary fw-semibold p-0 me-2"
              onClick={() => {
                setChangeDetails(!changeDetails);
                changeDetails && onSubmit();
              }}
            >
              {changeDetails ? 'Done' : 'Change'}
            </Button>
          </div>

          <div className="profileCard mb-4">
            <Form
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <Form.Control
                type="text"
                name="name"
                id="name"
                className={`mb-3 ${
                  changeDetails ? 'profileNameActive' : 'profileName'
                }`}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
                ref={inputRef}
                autoComplete="false"
              />

              <p>{email}</p>
            </Form>
          </div>

          <Link
            to="/create-listing"
            className="profile-createListing p-3 rounded-4"
          >
            <img src={homeIcon} alt="home" />
            <p className="mb-0">Sell or Rent your home</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 0 24 24"
              width="30px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>{' '}
          </Link>
        </section>
      </div>

      <section className="profile-listings mx-auto">
        {!loading && listings?.length > 0 && (
          <>
            <h5>Your Listings</h5>

            <ul className="d-flex flex-column gap-4 align-items-center mx-auto w-100">
              {listings.map((listing) =>
                width < 530 ? (
                  loading ? (
                    <Placeholder loading={loading} />
                  ) : (
                    <ListingItemSM
                      key={listing.id}
                      id={listing.id}
                      listing={listing.data}
                      onEdit={() => {
                        onEdit(listing.id);
                      }}
                      onDelete={() => {
                        onDelete(listing.id);
                      }}
                      deleting={deleting}
                      loginOut={loginOut}
                    />
                  )
                ) : loading ? (
                  <Placeholder loading={loading} />
                ) : (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onEdit={() => {
                      onEdit(listing.id);
                    }}
                    onDelete={() => {
                      onDelete(listing.id);
                    }}
                    deleting={deleting}
                    loginOut={loginOut}
                  />
                )
              )}
            </ul>
          </>
        )}
      </section>
    </Container>
  );
}

export default Profile;
