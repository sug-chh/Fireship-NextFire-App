import React from "react";
import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts ? (
    posts.map((post) => <PostItem key={post.slug} post={post} admin={admin} />)
  ) : (
    <div>No posts as of Now!</div>
  );
}

const PostItem = ({ post, admin = false }) => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <a>{post.title}</a>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>💗 {post.heartCount}</span>
      </footer>
    </div>
  );
};
