import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Service, PortfolioItem, BlogPost, Testimonial } from '../types';

type CollectionMap = {
  services: Service[];
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  testimonials: Testimonial[];
};

type CollectionName = keyof CollectionMap;

const useFirestore = <T extends CollectionName>(collectionName: T) => {
  const [docs, setDocs] = useState<CollectionMap[T]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snap) => {
      const documents = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as CollectionMap[T];
      setDocs(documents);
      setLoading(false);
    });

    return () => unsub();
  }, [collectionName]);

  return { docs, loading };
};

export default useFirestore;
