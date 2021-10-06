import React from "react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <main style={{ textAlign: "center" }}>
      <h1>404 - The page does not seem to exist...</h1>
      <iframe
        src="https://giphy.com/embed/hS6j40PXTMQZhTrjWi"
        width="480"
        height="360"
        frameBorder="0"
        className="giphy-embed"
        allowFullScreen
      ></iframe>
      <Link href="/" passHref>
        <button className="btn-blue">Go Home</button>
      </Link>
    </main>
  );
}

export default NotFoundPage;
