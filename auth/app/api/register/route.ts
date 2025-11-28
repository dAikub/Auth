// app/api/register/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    // 1. รับค่าที่ส่งมาจากหน้าบ้าน
    const body = await req.json()
    const { email, username, password } = body

    // 2. เช็คว่าข้อมูลครบไหม
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, 
        { status: 400 }
      )
    }

    // 3. เช็คว่ามี Email หรือ Username นี้ในระบบหรือยัง?
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email หรือ Username นี้ถูกใช้งานแล้ว" }, 
        { status: 409 } // 409 Conflict
      )
    }

    // 4. เข้ารหัสรหัสผ่าน (สำคัญมาก!)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. สร้าง User ใหม่ลง Database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    })

    // 6. ส่งผลลัพธ์กลับไป (ห้ามส่ง password กลับไปนะ!)
    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ!", user: { id: newUser.id, username: newUser.username } },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดบางอย่าง" }, 
      { status: 500 }
    )
  }
}