import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db, auth, createUserWithEmailAndPassword } from '../firebase';
import { Place, User } from '../types';

// Admin Authentication
export const loginAdmin = async (email: string, password: string) => {
    try {
    const adminsCollection = collection(db, 'admin');
    const q = query(
        adminsCollection,
        where('email', '==', email),
        where('password', '==', password)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error('Invalid credentials');
    }

    // Return the admin data
    const adminData = snapshot.docs[0].data();
    return {
        id: snapshot.docs[0].id,
        ...adminData
    };
    } catch (error) {
    throw error;
    }
};

// Places CRUD operations remain the same
export const getPlaces = async () => {
  const placesCollection = collection(db, 'places');
  const snapshot = await getDocs(placesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Place[];
};

export const searchPlaces = async (searchTerm: string) => {
  const placesCollection = collection(db, 'places');
  const q = query(
    placesCollection,
    where('title', '>=', searchTerm.toLowerCase()),
    where('title', '<=', searchTerm.toLowerCase() + '\uf8ff')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Place[];
};

export const addPlace = async (place: Omit<Place, 'id'>) => {
  const placesCollection = collection(db, 'places');
  const docRef = await addDoc(placesCollection, place);
  return {
    id: docRef.id,
    ...place
  };
};

export const updatePlace = async (place: Place) => {
  const placeRef = doc(db, 'places', place.id);
  await updateDoc(placeRef, place);
  return place;
};

export const deletePlace = async (id: string) => {
  const placeRef = doc(db, 'places', id);
  await deleteDoc(placeRef);
};



export const getUsers = async () => {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp to Date
    })) as User[];
};

// Modified addUser function
export const addUser = async (user: Omit<User, 'id' | 'createdAt'>, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
        const { user: authUser } = userCredential;

        const usersCollection = collection(db, 'users');
        const userDocRef = doc(usersCollection, authUser.uid);
        const docSnapshot = await getDoc(userDocRef);

       if(docSnapshot.exists()){
           // If user already exists in firestore return the existing document data
           return {
            id: docSnapshot.id,
             ...docSnapshot.data(),
            createdAt: docSnapshot.data().createdAt?.toDate() // Convert Firestore timestamp to Date
           } as User
       } else {
            // Use setDoc to specify the document ID as authUser.uid
            await setDoc(userDocRef, {
                ...user,
                createdAt: new Date(),
        });


             return {
                id: authUser.uid,
                ...user,
                createdAt: new Date(),
                uid: authUser.uid,
             } as User;

        }



    } catch (error: any) {
    console.error("Error adding user to authentication", error);
    throw error;
    }

};

export const updateUser = async (user: User) => {
  if (!user.id) throw new Error('User ID is required for updates');

  const userRef = doc(db, 'users', user.id);
  
  // Create an update object with only defined fields
  const updateData: Partial<User> = {};
  
  if (user.name !== undefined) updateData.name = user.name;
  if (user.email !== undefined) updateData.email = user.email;
  if (user.npm !== undefined) updateData.npm = user.npm;
  if (user.favorites !== undefined) updateData.favorites = user.favorites;

  // Only proceed with update if there are fields to update
  if (Object.keys(updateData).length > 0) {
    await updateDoc(userRef, updateData);
  }
  
  return user;
};

export const deleteUser = async (id: string) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
};