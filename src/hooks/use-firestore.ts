import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const useFirestore = (collectionName: string) => {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let documents: any[] = [];
      snapshot.forEach(doc => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setDocs(documents);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { docs };
}

export default useFirestore;