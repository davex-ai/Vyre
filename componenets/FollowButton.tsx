"use client"

import { useState } from "react"

export default function FollowButton({
  targetUserId,
}: {
  targetUserId: string
}) {
  const [loading, setLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)

  const toggleFollow = async () => {
    setLoading(true)
    const res = await fetch(`/api/users/${targetUserId}/follow`, {
      method: "POST",
    })
    const data = await res.json()
    setIsFollowing(data.following)
    setLoading(false)
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        isFollowing
          ? "bg-gray-200 dark:bg-gray-800"
          : "bg-black text-white"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  )
}
