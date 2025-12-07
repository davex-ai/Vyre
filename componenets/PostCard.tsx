// components/PostCard.tsx
"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

function extractTextPreview(html?: string, length = 120) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .slice(0, length)
    .trim();
}

function extractFirstImageUrl(html?: string): string | null {
  if (!html) return null;
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  authorId?: {
    username?: string;
  };
}

function PostCard({ post }: { post: Post }) {
  const imageUrl = extractFirstImageUrl(post.content);
  const previewText = extractTextPreview(post.content, 100);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-1 line-clamp-2">{post.title}</h3>
          {previewText && (
            <p className="text-sm opacity-80 mb-2 line-clamp-2">{previewText}</p>
          )}
          <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400">
            <span>By {post.authorId?.username || 'Anonymous'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default PostCard;