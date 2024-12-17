import { useLocation, useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/svg/googleIcon.svg';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db } from '../../firebase.config';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

function OAuth() {
  const location = useLocation();
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, create it
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/profile');
    } catch (error) {
      toast.error('Could Not Authorize With Google');
    }
  };

  return (
    <div className="socialLogin d-flex flex-column gap-3 align-items-center mb-4">
      <strong className="opacity-75">
        Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with{' '}
      </strong>

      <Button variant="white" onClick={onGoogleClick} className="socialIconDiv">
        <img src={googleIcon} alt="google" className="socialIconImg" />
      </Button>
    </div>
  );
}

export default OAuth;
