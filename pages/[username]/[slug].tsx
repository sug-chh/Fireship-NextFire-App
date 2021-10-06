import {
  collection,
  collectionGroup,
  where,
  getDocs,
  query,
  limit,
  doc,
  getDoc,
} from "@firebase/firestore";
import React from "react";
import HeartButton from "../../components/HeartButton";
import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername } from "../../lib/firebase";
import styles from "../../styles/Post.module.css";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  console.log(username, slug);
  const userDoc = await getUserWithUsername(username);
  let post;
  let path: string;
  if (userDoc) {
    const postRef = collection(firestore, userDoc.ref.path, "posts");
    const q = query(postRef, where("slug", "==", slug), limit(1));
    const postDoc = (await getDocs(q)).docs[0];
    post = postDoc.data();
    path = postDoc.ref.path;
  }
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = collectionGroup(firestore, "posts");
  const paths = (await getDocs(snapshot)).docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {
    // must be in this format
    // paths: [
    //   {params: {username, slug}}
    // ]
    paths,
    fallback: true,
  };
}

function PostPage({ post, path }: {post: any, path: string}) {
  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ♥️</strong>
        </p>
        <HeartButton postPath={path} />
      </aside>
    </main>
  );
}

export default PostPage;
