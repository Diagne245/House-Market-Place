import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, () => {
      if (auth.currentUser) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  });

  return { loggedIn, checkingStatus };
};

export default useAuthStatus;
