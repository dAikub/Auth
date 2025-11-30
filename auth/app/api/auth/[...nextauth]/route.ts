import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google" // 1. เพิ่ม Google
import { PrismaAdapter } from "@next-auth/prisma-adapter" // 2. เพิ่ม Adapter
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  // 3. เชื่อมต่อ Adapter
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // --- ส่วนของ Google ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
      // (Optional) อนุญาตให้คนที่มี Email เดิมในระบบ ล็อกอินด้วย Google ได้เลยโดยไม่ Error
      allowDangerousEmailAccountLinking: true, 
    }),

    // --- ส่วนของ Credentials (Username/Password) เดิม ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
           throw new Error("User not found or password not set")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id, // ตอนนี้เป็น String แล้ว
          name: user.username || user.name,
          email: user.email,
          image: user.image,
        }
      }
    })
  ],
  
  // ⚠️ สำคัญมาก: เมื่อใช้ Adapter คู่กับ Credentials ต้องบังคับใช้ JWT
  session: {
    strategy: "jwt"
  },
  
  pages: {
    signIn: '/login',
  },
  
  callbacks: {
    // เพิ่ม id เข้าไปใน session เพื่อให้ frontend เรียกใช้ได้
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string; // ดึง ID จาก Token มาใส่ Session
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }