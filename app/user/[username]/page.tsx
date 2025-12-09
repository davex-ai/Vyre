// app/user/[username]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByUsername } from "@/lib/user";
import { getPostsByAuthor } from "@/lib/posts";
import Container from "@/componenets/Container";
import FollowButton from "@/componenets/FollowButton";
import PostCard from "@/componenets/PostCard";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const posts = await getPostsByAuthor(user._id.toString());
  const isMe = session?.user?.id === user._id.toString();

  return (
    <Container className="max-w-4xl mx-auto py-8 md:py-12 px-4">
      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-12">
        {/* Avatar Placeholder — easy to swap for real image */}
        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
          <span className="text-2xl font-bold text-primary">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {user.username}
            </h1>
            {isMe && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                You
              </span>
            )}
          </div>

          {user.bio && (
            <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <span>
              <strong className="text-neutral-900 dark:text-white">
                {user.followers?.length ?? 0}
              </strong>{" "}
              followers
            </span>
            <span>
              <strong className="text-neutral-900 dark:text-white">
                {user.following?.length ?? 0}
              </strong>{" "}
              following
            </span>
            <span>
              <strong className="text-neutral-900 dark:text-white">
                {posts.length}
              </strong>{" "}
              posts
            </span>
          </div>

          {!isMe && session && (
            <div className="mt-2">
              <FollowButton targetUserId={user._id.toString()} />
            </div>
          )}
        </div>
      </div>

      {/* POSTS SECTION */}
      <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-8">
        <h2 className="text-xl font-bold mb-6 text-neutral-900 dark:text-white">
          Posts by {user.username}
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              No posts yet. Be the first to write one!
            </p>
            {isMe && (
              <Link
                href="/blog/new"
                className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Create a Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}