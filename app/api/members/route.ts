import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST - Create a new member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
