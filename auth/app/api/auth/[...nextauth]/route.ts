// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. เช็คว่ากรอกข้อมูลมาครบไหม
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        // 2. ค้นหา User จาก Database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // 3. ถ้าไม่มี User หรือ User ไม่มีรหัสผ่าน
        if (!user || !user.password) {
          throw new Error('No user found')
        }

        // 4. (สำคัญ!) เช็คว่ารหัสผ่านที่กรอก ตรงกับ Hash ใน Database ไหม
        // หมายเหตุ: ตอนนี้ DB เราเก็บ password แบบ plain text อยู่ เดี๋ยวต้องไปแก้ Seed
        // แต่เขียนโค้ดเผื่อไว้เลย
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password) 
        
        // *ชั่วคราว* : ถ้ายังไม่ได้ Hash ให้ใช้แบบนี้ไปก่อน (ห้ามใช้ใน Production)
        // const isPasswordValid = credentials.password === user.password

        if (!isPasswordValid) {
          throw new Error('Incorrect password')
        }

        // 5. ถ้าผ่านหมด ส่งข้อมูล User กลับไป (Login สำเร็จ!)
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // บอกว่าจะใช้หน้า Login ของเราเองที่ path นี้
  }
})

export { handler as GET, handler as POST }