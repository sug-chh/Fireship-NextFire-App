import React from "react";
import Head from "next/head";

function MetaTags({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string | undefined;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fireship_dev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}

MetaTags.defaultProps = {
  title: "Home Page",
  description: "Best resource to learn Firebase!",
  image: undefined,
};



export default MetaTags;

