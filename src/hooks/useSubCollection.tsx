import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, query, DocumentData, Query, orderBy, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { useAppSelector } from '../app/hooks';


interface Messages {
  id: string;
  timestamp: Timestamp;
  message: string;
  user: {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
  reactions?: { 
    [key: string]: { uid: string; name: string }[] 
  };
}


const useSubCollection = (
  collectionName: string, 
  subCollectionName: string
) => {
  const channelId = useAppSelector((state) => state.channel.channelId);
  const [SubDocuments, setSubDocuments] = useState<Messages[]>([]);

  useEffect(() => {
    let collectionRef = collection(
      db, 
      collectionName, 
      String(channelId), 
      subCollectionName
    );

    const collectionRefOrderBy = query(
      collectionRef, 
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(collectionRefOrderBy, (snapshot) => {
      let results: Messages[] = [];
      snapshot.docs.forEach((doc) => {

        results.push({
          id: doc.id,
          timestamp: doc.data().timestamp,
          message: doc.data().message,
          user: doc.data().user,
          reactions: doc.data().reactions,
        });
      });
      setSubDocuments(results);
    });

    return () => unsub();
  }, [channelId]);

  return { SubDocuments }
}

export default useSubCollection