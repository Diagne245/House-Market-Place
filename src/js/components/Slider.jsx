import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import Spinner from './Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Autoplay,
  A11y,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { cleanUpTempFiles } from '../utilityMethods';
import altHouseImage from '../../assets/house-images/alt-house-image.avif';
import { toast } from 'react-toastify';
// --------------------------
function Slider() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------
  const [isFetching, setIsFetching] = useState(true);
  const driveServerUrl = process.env.REACT_APP_DRIVE_SERVER_URL;

  // -------------
  const navigate = useNavigate();

  useEffect(() => {
    let cleanUpArr = [];

    const fetchListings = async () => {
      const colRef = collection(db, 'listings');
      const q = query(colRef, orderBy('timestamp', 'desc'), limit(5));
      const docsSnap = await getDocs(q);

      let listingsArr = [];

      docsSnap.forEach((doc) => {
        listingsArr.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      const coverImageIds = listingsArr.map(({ data }) => data.imagesIds[0]);

      try {
        const response = await axios.get(`${driveServerUrl}/direct-links`, {
          params: { fileIds: coverImageIds },
        });

        const { directLinks, cleanUpPaths } = response?.data.data;

        listingsArr.map((listing, i) => {
          listing.data.coverImageLink = directLinks[i];
          return listing;
        });

        setListings(listingsArr);
        cleanUpArr = cleanUpPaths;
        
        setIsFetching(false);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();

    return async () => {
      cleanUpArr?.length > 0 && (await cleanUpTempFiles(cleanUpArr));
    };
  }, [driveServerUrl]);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <>
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
          {listings.map(({ id, data }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div className="slider-control position-relative h-100">
                <img
                  src={isFetching ? altHouseImage : data.coverImageLink}
                  alt="coverImage"
                  className="swiperSlideImg"
                  height={300}
                />

                <div className="swiper-text position-absolute top-50 translate-middle-y ms-2">
                  <p className="swiperSlideName  mb-1 p-2 fs-md-5">
                    {data.name}
                  </p>
                  <p className="swiperSlidePrice fs-md-6">
                    $
                    {data.discountPrice
                      ? data.discountPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : data.regularPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    {data.type === 'rent' && ' / month'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
