import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const useFirestore = (collectionName: string) => {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snap) => {
      const documents: any[] = [];
      snap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setDocs(documents);
    });

    return () => unsub();
  }, [collectionName]);

  return { docs };
};

export default useFirestore;
