import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ result: 'NOT_FOUND' }, { status: 400 })
  }

  const tag = await prisma.nfcTag.findUnique({
    where: { uid },
    include: {
      customer: {
        include: { subscription: true }
      }
    }
  })

  if (!tag) {
    await prisma.scanLog.create({
      data: { nfcUid: uid, result: 'NOT_FOUND' }
    })
    return NextResponse.json({ result: 'NOT_FOUND' })
  }

  const status = tag.customer.subscription?.status ?? 'NOT_FOUND'

  await prisma.scanLog.create({
    data: { nfcUid: uid, result: status }
  })

  return NextResponse.json({
    result: status,
    customer: {
      name: tag.customer.name,
      email: tag.customer.email,
      expiresAt: tag.customer.subscription?.expiresAt,
    }
  })
}