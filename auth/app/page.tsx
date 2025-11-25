// app/page.tsx
import { prisma } from '@/lib/prisma' // เรียกใช้ตัวกลางที่เราสร้าง
import Link from 'next/link'

export default async function Home() {
  // ดึงข้อมูลจาก Database
  const users = await prisma.user.findMany()

  return (

    <main>
        <Link href="/login">Login</Link>

    </main>

  )
}