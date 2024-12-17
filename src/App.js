import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Footer from './js/components/Footer';
import PrivateRoute from './js/components/PrivateRoute';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';

function App() {
  return (
    <>
      <Router>
        <ThemeProvider
          breakpoints={[
            'xs',
            'xxs',
            'sm',
            'mmd',
            'md',
            'mlg',
            'lg',
            'xl',
            'xxl',
          ]}
          minBreakpoint="xs"
        >
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/Category/:categoryName" element={<Category />} />

            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
            <Route
              path="/Category/:categoryName/:listingId"
              element={<Listing />}
            />
            <Route path="/contact/:landlordId" element={<Contact />} />
          </Routes>
          <Footer />
        </ThemeProvider>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
