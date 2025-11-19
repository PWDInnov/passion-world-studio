
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

const useFirestore = (collectionName) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, collectionName);
        const initialSnapshot = await getDocs(colRef);
        const initialData = initialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocs(initialData);
        setLoading(false);

        // Set up the real-time listener
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
          const updatedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDocs(updatedData);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        setLoading(false);
      }
    };

    fetchData();

  }, [collectionName]);

  return { docs, loading, setDocs };
};

export default useFirestore;
