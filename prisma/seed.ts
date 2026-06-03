import bcrypt from "bcryptjs"
import { Role } from "../app/generated/prisma"
import { prisma } from "../app/lib/prisma"

const users = [
  { name: "Admin", email: "admin@test.com", role: Role.ADMIN },
  { name: "Seller", email: "seller@test.com", role: Role.SELLER },
  { name: "Buyer", email: "buyer@test.com", role: Role.BUYER },
]

async function main() {
  const password = await bcrypt.hash("123456", 10)

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: {
        ...user,
        password,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
