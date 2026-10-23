import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, onSnapshot, DocumentData } from 'firebase/firestore';

interface FirestoreDoc extends DocumentData {
  id: string;
}

const useFirestore = (collectionName: string, enabled: boolean = true) => {
  const [docs, setDocs] = useState<FirestoreDoc[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setDocs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const fetchData = async () => {
      try {
        const colRef = collection(db, collectionName);
        const initialSnapshot = await getDocs(colRef);
        if (isMounted) {
          const initialData = initialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDocs(initialData);
          setLoading(false);
        }

        // Set up the real-time listener with error callback
        unsubscribe = onSnapshot(
          colRef,
          (snapshot) => {
            if (isMounted) {
              const updatedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setDocs(updatedData);
            }
          },
          (err) => {
            if (isMounted) {
              console.warn(`Firestore snapshot listener for ${collectionName}:`, err?.message || err);
            }
          }
        );
      } catch (error: unknown) {
        if (isMounted) {
          const err = error as { code?: string; message?: string };
          if (err?.code === 'permission-denied') {
            console.warn(`Firestore read permission denied for ${collectionName}. Authentication may be required.`);
          } else {
            console.warn(`Error fetching ${collectionName}:`, err?.message || error);
          }
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, enabled]);

  return { docs, loading, setDocs };
};

export default useFirestore;
