import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ImageUploader from "../../components/ImageUploader";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import {
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  doc,
  serverTimestamp,
} from "@firebase/firestore";
import { auth, firestore } from "../../lib/firebase";
import styles from "../../styles/Admin.module.css";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

interface Post {
  content: string;
  slug: string;
  heartCount: number;
  published: boolean;
  title: string;
  createdAt: any;
  updatedAt: string;
}

function PostManager() {
  const router = useRouter();
  const [post, setPost] = useState<Partial<Post>>({});
  const { slug } = router.query;
  const [preview, setPreview] = useState(false);
  const postReference = useRef("");
  useEffect(() => {
    const getPost = async () => {
      const postRef = collection(
        firestore,
        "users",
        auth.currentUser.uid,
        "posts"
      );
      const q = query(postRef, where("slug", "==", slug));
      const postData = (await getDocs(q)).docs[0];
      postReference.current = postData.ref.path;
      setPost({ ...post, ...postData.data() });
    };
    if (!post.title) {
      getPost();
    }
  }, [post, slug]);

  console.log(post);
  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <h1>{postReference.current}</h1>
            <PostForm
              defaultValues={post}
              postRefPath={postReference.current}
              preview={preview}
            />
          </section>
          <h3>Tools</h3>
          <button onClick={() => setPreview(!preview)}>
            {preview ? "Edit" : "Preview"}
          </button>
        </>
      )}
    </main>
  );
}

function PostForm({ postRefPath, defaultValues, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, errors } = formState;
  const updatePost = async ({ content, published }) => {
    const postRef = doc(firestore, postRefPath);
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });
    reset({ content, published });
    toast.success("Post updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader/>
        <textarea
          {...register("content", {
            maxLength: { value: 2000, message: "content is too large" },
            minLength: { value: 10, message: "content is too short!" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset>
          <input
            type="checkbox"
            className={styles.checkbox}
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>
        <button
          disabled={!isDirty || !isValid}
          type="submit"
          className="btn-green"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
