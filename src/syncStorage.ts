import { db, auth } from './firebase';
import { doc, setDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const originalSetItem = localStorage.setItem;

// Track if we are currently syncing down to avoid infinite loops
let isSyncingDown = false;

export const syncStorageToFirebase = () => {
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, [key, value]);
    const user = auth.currentUser;
    if (user && !isSyncingDown) {
      try {
        setDoc(doc(db, 'users', user.uid, 'localStorageSync', key), { value }).catch(err => {
          console.error('Failed to sync to Firebase:', err);
        });
      } catch (e) {
        console.error(e);
      }
    }
  };
};

export const fetchStorageFromFirebase = () => {
  return new Promise<void>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'localStorageSync'));
          isSyncingDown = true;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.value && !localStorage.getItem(doc.id)) {
              originalSetItem.apply(localStorage, [doc.id, data.value]);
            }
          });
          isSyncingDown = false;
        } catch (error) {
          console.error('Error fetching from Firebase:', error);
          isSyncingDown = false;
        }
      }
      resolve();
    });
  });
};

