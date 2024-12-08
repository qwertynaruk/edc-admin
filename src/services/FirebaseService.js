import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import firebaseConfig from 'configs/FirebaseConfig';

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

export default app;
