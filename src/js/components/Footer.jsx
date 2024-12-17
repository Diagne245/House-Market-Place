import { useLocation, useNavigate } from 'react-router-dom';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { ReactComponent as ExploreIcon } from '../../assets/svg/exploreIcon.svg';
import { ReactComponent as OfferIcon } from '../../assets/svg/localOfferIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../../assets/svg/personOutlineIcon.svg';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <Navbar fixed="bottom" className="bg-white">
      <Container fluid="mlg">
        <Nav className="w-100 d-flex justify-content-evenly align-items-center">
          <Nav.Link onClick={() => navigate('/')} className="navbarListItem">
            <ExploreIcon
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width="36"
              height="36"
            />
            <p
              className={
                pathMatchRoute('/')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Explore
            </p>
          </Nav.Link>
          <Nav.Link
            className="navbarListItem"
            onClick={() => navigate('/offers')}
          >
            <OfferIcon
              fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
              width="36"
              height="36"
            />
            <p
              className={
                pathMatchRoute('/offers')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Offers
            </p>
          </Nav.Link>
          <Nav.Link
            className="navbarListItem"
            onClick={() => navigate('/profile')}
          >
            <PersonOutlineIcon
              fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
              width="36"
              height="36"
            />
            <p
              className={
                pathMatchRoute('/profile')
                  ? 'navbarListItemNameActive'
                  : 'navbarListItemName'
              }
            >
              Profile
            </p>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer;
