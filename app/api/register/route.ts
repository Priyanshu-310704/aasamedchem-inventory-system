import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from '@prisma/client'

export async function POST(req: NextRequest) {
  const { name, email, password, role }: {
    name: string
    email: string
    password: string
    role: Role
  } = await req.json()

  // 1. Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    )
  }

  // 2. Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10)
  // 10 = salt rounds (higher = slower but more secure)

  // 3. Create user in database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,  // NEVER store plain text
      role,                       // ADMIN / SELLER / BUYER
    }
  })

  return NextResponse.json({
    message: "Account created successfully",
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  })
}
