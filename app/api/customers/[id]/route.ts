import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json()
  const { id: customerId } = await params

  if (body.nfcUid) {
    const existing = await prisma.nfcTag.findUnique({
      where: { customerId }
    })
    if (existing) {
      await prisma.nfcTag.update({
        where: { customerId },
        data: { uid: body.nfcUid },
      })
    } else {
      await prisma.nfcTag.create({
        data: { uid: body.nfcUid, customerId },
      })
    }
  }

  if (body.status || body.expiresAt) {
    const existing = await prisma.subscription.findUnique({
      where: { customerId }
    })
    if (existing) {
      await prisma.subscription.update({
        where: { customerId },
        data: {
          status: body.status,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : existing.expiresAt,
        },
      })
    } else {
      await prisma.subscription.create({
        data: {
          customerId,
          status: body.status ?? 'ACTIVE',
          expiresAt: new Date(body.expiresAt),
        },
      })
    }
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { subscription: true, nfcTag: true },
  })

  return NextResponse.json(customer)
}