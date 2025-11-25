// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 กำลังเริ่มเพิ่มข้อมูล (Seeding)...')

  // 1. สร้างรหัสผ่านที่เข้ารหัสแล้ว (รหัสคือ 123456)
  const passwordHash = await hash('123456', 10)

  // 2. สร้าง Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: passwordHash // อัปเดตรหัสผ่านใหม่เสมอ
    },
    create: {
      username: 'admin',      // <--- เพิ่มบรรทัดนี้ (ตาม Schema ใหม่)
      email: 'admin@example.com',
      name: 'Super Admin',
      password: passwordHash, // รหัสผ่านที่ Hash แล้ว
      // role: 'ADMIN' (ถ้ามี Enum)
    },
  })

  console.log(`✅ สร้าง User สำเร็จ: ${admin.username} (Pass: 123456)`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })