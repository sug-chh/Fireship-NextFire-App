import kebabcase from "lodash.kebabcase";
import React, { useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserContext } from "../../lib/context";
import toast from "react-hot-toast";
import PostFeed from "../../components/PostFeed";
import styles from "../../styles/Admin.module.css";
import Loader from "../../components/Loader";

import AuthCheck from "../../components/AuthCheck";
import {
  collection,
  serverTimestamp,
  doc,
  orderBy,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { firestore, auth } from "../../lib/firebase";
import { useRouter } from "next/dist/client/router";
export default function AdminPostPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(posts);
    if (!posts) {
      getPosts();
    }
  }, [posts]);

  const getPosts = async () => {
    const ref = collection(firestore, "users", auth.currentUser.uid, "posts");
    const postsData = (await getDocs(ref)).docs.map((doc) => doc.data());
    setPosts(postsData);
  };

  return (
    <>
      <h1>Manage Your Posts</h1>
      <Loader show={loading} />
      <PostFeed posts={posts} admin />
      <CreateNewPost setLoading={setLoading} />
    </>
  );
}

function CreateNewPost({ setLoading }) {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabcase(title));
  const isValid = title.length > 3 && title.length < 100;
  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Post created!");
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, "users", uid, "posts", slug);
    // Tip: give all fields a default value here!
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "#hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    setLoading(true);
    await setDoc(ref, data);
    toast.success("Post Created!");
    setLoading(false);
    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
