import React, { useEffect, useState } from "react";
import { firestore, auth } from "../lib/firebase";
import { increment } from "firebase/firestore";
import {
  doc,
  collection,
  getDoc,
  writeBatch,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { async } from "@firebase/util";

type HeartData = {
  exists: boolean;
  data: {};
  heartRef: DocumentReference<DocumentData>;
};

function HeartButton({ postPath }: { postPath: string }) {
  const [heartData, setHeartData] = useState<HeartData>();
  const postRef = doc(firestore, postPath);

  const getHeartDoc = async () => {
    const heartRef = doc(firestore, postPath, "hearts", auth.currentUser.uid);
    const heartDocData = await getDoc(heartRef);
    setHeartData({
      exists: heartDocData.exists(),
      data: heartDocData.data(),
      heartRef: heartDocData.ref,
    });
    return heartDocData.ref;
  };
  const removeHeart = async () => {
    const heartDocRef = await getHeartDoc();
    console.log("heart removed!");
    const batch = writeBatch(firestore);
    batch.update(postRef, {
      heartCount: increment(-1),
    });
    batch.delete(heartDocRef);
    await batch.commit()
  };
  const addHeart = async () => {
    const heartDocRef = await getHeartDoc();
    console.log("heart added!");
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);
    batch.update(postRef, {
      heartCount: increment(1),
    });
    batch.set(heartDocRef, { uid });
    await batch.commit();
  };
  return heartData?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>♥️ Heart</button>
  );
}

export default HeartButton;
