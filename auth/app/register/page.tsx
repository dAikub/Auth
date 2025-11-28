'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [info, setInfo] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  // ฟังก์ชันรับค่าจาก Input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ฟังก์ชันเมื่อกดปุ่ม Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. เช็คเบื้องต้น
    if (!info.username || !info.email || !info.password || !info.confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (info.password !== info.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    setError('')
    setPending(true) // เปิดสถานะโหลด

    try {
      // 2. ส่งข้อมูลไปที่ API
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: info.username,
          email: info.email,
          password: info.password
        })
      })

      if (res.ok) {
        // 3. ถ้าสำเร็จ -> เด้งไปหน้า Login
        // setPending(false) // ไม่ต้อง set false ก็ได้เพราะเดี๋ยวเปลี่ยนหน้าแล้ว
        const form = e.target as HTMLFormElement
        form.reset()
        alert("สมัครสมาชิกสำเร็จ! 🎉")
        router.push('/login')
      } else {
        // 4. ถ้าไม่สำเร็จ (เช่น ชื่อซ้ำ) -> แสดง Error จาก Server
        const errorData = await res.json()
        setError(errorData.message || 'เกิดข้อผิดพลาด')
        setPending(false)
      }

    } catch (err) {
      setPending(false)
      setError('ระบบขัดข้อง กรุณาลองใหม่ภายหลัง')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">สมัครสมาชิกใหม่</h2>

        {/* ส่วนแสดง Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input 
              name="username" type="text" 
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="ตั้งชื่อผู้ใช้"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input 
              name="email" type="email" 
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input 
              name="password" type="password" 
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="รหัสผ่าน"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input 
              name="confirmPassword" type="password" 
              onChange={handleInput}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
            />
          </div>

          <button 
            type="submit" 
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? 'กำลังบันทึกข้อมูล...' : 'ลงทะเบียน'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  )
}