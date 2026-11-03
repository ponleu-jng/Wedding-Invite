import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocFromServer,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { RSVPRecord } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with robust auto-detect long polling settings
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

let dbInstance;
try {
  dbInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      experimentalForceLongPolling: false
    },
    databaseId
  );
} catch {
  dbInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = dbInstance;

// Validate Connection with graceful fallback
async function testConnection() {
  if (typeof window === 'undefined') return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('unavailable')) {
        console.info('Firestore is operating in resilient offline/caching mode.');
      }
    }
  }
}

// Slightly defer check to allow initial browser socket negotiation
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1200);
}

// Auth Helpers
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

export const subscribeToAuth = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Message Type & Functions
export interface WeddingMessage {
  id: string;
  userId: string;
  senderName: string;
  senderPhoto?: string;
  message: string;
  photoUrl?: string;
  createdAt?: string;
  timestamp?: Timestamp | null;
}

// Send live message / blessing to the couple
export const sendWeddingMessage = async (data: {
  senderName: string;
  senderPhoto?: string;
  message: string;
  photoUrl?: string;
  userId?: string;
}) => {
  try {
    const currentUserId = data.userId || auth.currentUser?.uid || 'guest-anon';
    const docRef = await addDoc(collection(db, 'messages'), {
      userId: currentUserId,
      senderName: data.senderName,
      senderPhoto: data.senderPhoto || auth.currentUser?.photoURL || '',
      message: data.message,
      photoUrl: data.photoUrl || '',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.warn('sendWeddingMessage fallback (offline queued):', err);
    return `local-${Date.now()}`;
  }
};

// Real-time listener for messages with resilient error handling
export const subscribeToMessages = (callback: (messages: WeddingMessage[]) => void) => {
  try {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const messages: WeddingMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId || '',
            senderName: data.senderName || 'Anonymous Guest',
            senderPhoto: data.senderPhoto || '',
            message: data.message || '',
            photoUrl: data.photoUrl || '',
            createdAt: data.createdAt || '',
            timestamp: data.timestamp
          };
        });
        callback(messages);
      },
      (err) => {
        console.warn('Real-time messages listener operating in offline mode:', err.message);
      }
    );
  } catch (err) {
    console.warn('Could not start messages listener:', err);
    return () => {};
  }
};

// Real-time RSVP persistence in Firestore
export const saveRSVPToFirestore = async (record: RSVPRecord) => {
  try {
    const currentUserId = auth.currentUser?.uid || 'guest-anon';
    await addDoc(collection(db, 'rsvps'), {
      ...record,
      userId: currentUserId,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.warn('saveRSVPToFirestore notice (offline queued):', err);
  }
};

export const subscribeToRSVPs = (callback: (records: RSVPRecord[]) => void) => {
  try {
    const q = query(collection(db, 'rsvps'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const records: RSVPRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name,
            phone: data.phone,
            guestCount: data.guestCount,
            attending: data.attending,
            diet: data.diet,
            blessing: data.blessing,
            photoUrl: data.photoUrl,
            submittedAt: data.submittedAt || ''
          };
        });
        callback(records);
      },
      (err) => {
        console.warn('Real-time RSVPs listener operating in offline mode:', err.message);
      }
    );
  } catch (err) {
    console.warn('Could not start RSVPs listener:', err);
    return () => {};
  }
};
