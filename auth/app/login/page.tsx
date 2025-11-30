// app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // เรียกใช้ฟังก์ชัน signIn ของ NextAuth
    const result = await signIn('credentials', {
      redirect: false, // ไม่ต้องเด้งเปลี่ยนหน้าออโต้
      email,
      password,
    })

    if (result?.error) {
      alert(result.error)
    } else {
      router.push('/') // Login ผ่านแล้วเด้งไปหน้าแรก
      router.refresh()
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
        
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        <button><Link href="/register">Register</Link></button>

      </form>


        {/* ปุ่ม Google */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 p-2 rounded hover:bg-gray-50 text-gray-700 font-medium"
        >
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
          เข้าสู่ระบบด้วย Google
        </button>

    </div>
  )
}