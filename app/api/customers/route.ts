import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: {
      subscription: true,
      nfcTag: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  const body = await request.json()
  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      note: body.note,
    },
  })
  return NextResponse.json(customer)
}