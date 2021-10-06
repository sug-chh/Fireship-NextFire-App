import { useState } from "react";
import {
  collectionGroup,
  query,
  where,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";

const LIMIT = 10;
export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    limit(LIMIT)
  );
  const posts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());
  return {
    props: {
      posts,
    },
  };
}

export default function Home(props) {
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const qRef = collectionGroup(firestore, "posts");
    const q = query(
      qRef,
      where("published", "==", true),
      startAfter(last),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map((doc) => doc.data());
    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  console.log(props.posts);
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  console.log(loading, postsEnd);
  return (
    <main>
      <PostFeed posts={posts} admin />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
