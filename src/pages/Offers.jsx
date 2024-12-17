import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../js/components/Spinner';
import ListingItem from '../js/components/ListingItem';
import { Button, Container } from 'react-bootstrap';
import ListingItemSM from '../js/components/ListingItemSM';
import useResponsiveWidth from '../js/hooks/useResponsiveWidth';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);

  const width = useResponsiveWidth();
  const params = useParams();

  const listingsPerDisplay = 5;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        // Create Query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(listingsPerDisplay)
        );

        // Execute Query
        const querySnap = await getDocs(q);

        let lastVisible = null;
        querySnap.docs.length === listingsPerDisplay &&
          (lastVisible = querySnap.docs[querySnap.docs.length - 1]) &&
          setLastFetchListing(lastVisible);

        querySnap.docs.length < listingsPerDisplay && setLastFetchListing(null);

        // Get Data
        const listingsArr = [];
        querySnap.forEach((doc) => {
          listingsArr.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listingsArr);
        setLoading(false);
      } catch (error) {
        toast.error('Could Not Retrieve Listings');
      }
    };

    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      // Create Query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListing),
        limit(listingsPerDisplay)
      );

      // Execute Query
      const querySnap = await getDocs(q);

      querySnap.docs.length === listingsPerDisplay &&
        setLastFetchListing(querySnap.docs[querySnap.docs.length - 1]);

      querySnap.docs.length < listingsPerDisplay && setLastFetchListing(null);

      // Get Data
      const listingsArr = [];
      querySnap.forEach((doc) => {
        listingsArr.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings([...listings, ...listingsArr]);
      setLoading(false);
    } catch (error) {
      toast.error('Could Not Retrieve Listings');
    }
  };

  return (
    <Container fluid="md" className="offers pageContainer">
      <header>
        <h1 className="fs-1">Offers</h1>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="d-flex flex-column gap-4 align-items-center mx-auto w-100">
              {listings.map((listing) =>
                width < 530 ? (
                  <ListingItemSM
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ) : (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                )
              )}

              {lastFetchListing && (
                <Button
                  variant="dark"
                  className="loadMore"
                  onClick={onFetchMoreListings}
                >
                  Load More
                </Button>
              )}
            </ul>
          </main>
        </>
      ) : (
        <h2>'No Listings for {params.categoryName}'</h2>
      )}
    </Container>
  );
}

export default Offers;
