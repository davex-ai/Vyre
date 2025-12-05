"use client"
import { signIn } from 'next-auth/react'
import React, { useState } from 'react'

function page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/"
        })
    }
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-20">
        <h1 className='text-2xl font-bold mb-6'>Login</h1>
         <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <button className="bg-gray-600 text-white py-2 rounded"> Login </button>
      </form>
    </div>
  )
}

export default page
