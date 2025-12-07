// app/blog/[slug]/page.tsx
import { getPostBySlug } from "@/lib/posts";
import Container from "@/componenets/Container";
import ThemeToggle from "@/componenets/ThemeToggle";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.length === 0) notFound();

  const p = post[0];

  const formattedDate = new Date(p.createdAt).toLocaleDateString();
  const authorName = p.author?.username || "Anonymous";

  return (
    <Container className="max-w-3xl mx-auto py-12 px-6 relative z-10">
      <div className="flex justify-between items-center mb-12">
        <Link href="/" className="text-sm underline text-primary hover:opacity-80">
          ← Back to Home
        </Link>
        <ThemeToggle />
      </div>

      {/* Post header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-extrabold leading-tight mb-3">{p.title}</h1>
        {p.subtitle && <h2 className="text-xl text-neutral-600 dark:text-neutral-400 mb-4">{p.subtitle}</h2>}
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <span>By {authorName}</span>
          <span>{formattedDate}</span>
        </div>
      </motion.div>

      {/* Post content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-p:leading-relaxed prose-p:my-5 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-neutral-300 dark:prose-blockquote:border-neutral-700"
      >
        <div dangerouslySetInnerHTML={{ __html: p.content }} />
      </motion.article>

      {/* Optional pagination / next-prev */}
      <motion.div
        className="flex justify-between mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link href={`/blog`} className="underline text-primary hover:opacity-80">
          ← Back to all posts
        </Link>
        {/* Placeholder for next post */}
        {/* <Link href={`/blog/${nextSlug}`} className="underline text-primary hover:opacity-80">
          Next Post →
        </Link> */}
      </motion.div>
    </Container>
  );
}
