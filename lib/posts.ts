// lib/posts.ts
import { connectDB } from "./db";
import Post from "@/models/postmodel";

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  authorId?: string;
}

// Helper to convert Mongoose _id to string
function serializePost(post: any) {
  if (!post) return null;
  return {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
    authorId: post.authorId
      ? {
          _id: post.authorId._id?.toString(),
          username: post.authorId.username || 'Anonymous',
        }
      : null,
  };
}

export async function getAllPosts(limit?: number) {
  await connectDB();
  let query = Post.find().populate("authorId", "username").sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);
  const posts = await query.lean({ virtuals: true }); // lean helps, but we still sanitize
  return posts.map(serializePost).filter(Boolean);
}

export async function getPostBySlug(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug }).populate("authorId", "username").lean({ virtuals: true });
  return serializePost(post);
}

export async function getAuthor(authorId: string) {
  await connectDB();
  return await Post.find({ _id: authorId }).lean();
}

export async function createPost(data: PostInput) {
  await connectDB();
  const post = await Post.create(data);
  return post.toObject(); // optional, but consistent
}

export async function deletePost(id: string) {
  await connectDB();
  return await Post.findOneAndDelete({ _id: id });
}