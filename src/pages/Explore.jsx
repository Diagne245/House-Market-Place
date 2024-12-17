import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../js/components/Slider';

function Explore() {
  return (
    <Container fluid="mlg" className="pageContainer explore">
      <header>
        <h1 className="fs-1">Explore</h1>
      </header>
      <main>
        <div className="fw-bold ps-2 mb-2">Recommended</div>

        <Slider />

        <p className="fw-bold mt-5 mt-mmd-6 mb-2 ps-2">Categories</p>
        <div className="exploreCategoryWrapper d-flex justify-content-between">
          <Link to="/category/rent" className="exploreCategoryLink">
            <img
              src={rentCategoryImage}
              alt="rent"
              className="img-fluid w-100 h-100"
            />
            <p className="fw-medium text-start">Places for rent</p>
          </Link>
          <Link to="/category/sale" className="exploreCategoryLink">
            <img
              src={sellCategoryImage}
              alt="sell"
              className="img-fluid w-100 h-100"
            />
            <p className="fw-medium text-start">Places for sale</p>
          </Link>
        </div>
      </main>
    </Container>
  );
}

export default Explore;
