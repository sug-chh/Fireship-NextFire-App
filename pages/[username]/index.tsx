import React from "react";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { firestore, getUserWithUsername } from "../../lib/firebase";
import {
  collection,
  where,
  query as q,
  getDocs,
  limit,
} from "@firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page!
  // ssr 404
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  // JSON serializable data

  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(firestore, userDoc.ref.path, "posts");
    const postsQuery = q(postsRef, where("published", "==", true), limit(5));
    posts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());
    return {
      props: {
        user,
        posts,
      },
    };
  }
}

export default function UserProfilePage({ user, posts, admin }) {
  console.log(posts);
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={admin} />
    </main>
  );
}

// helper function
