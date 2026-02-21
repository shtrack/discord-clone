import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, query, DocumentData, Query } from "firebase/firestore";
import { db } from '../firebase';


interface Channels {
  id: string;
  channel: DocumentData;
}


const useCollection = (data: string) => {

  const [documents, setDocuments] = useState<Channels[]>([]);
  const collectionRef: Query<DocumentData> = query(collection(db, data))

  useEffect(() => {
    onSnapshot(collectionRef, (querySnapshot) => {
      const channnelsResults: Channels[] = [];
      querySnapshot.docs.forEach((doc) => 
        channnelsResults.push({
          id: doc.id,
          channel: doc.data(),
        })
      );
      setDocuments(channnelsResults);
    })
  }, [])

  return { documents }
}

export default useCollection