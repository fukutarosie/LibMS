import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all borrowings
export async function GET() {
  try {
    const borrowings = await prisma.borrowing.findMany({
      include: {
        book: true,
        member: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(borrowings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch borrowings' },
      { status: 500 }
    );
  }
}

// POST - Create a new borrowing (checkout book)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookId, memberId, dueDate } = body;

    // Check if book is available
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) },
    });

    if (!book || book.availableCopies <= 0) {
      return NextResponse.json(
        { error: 'Book is not available' },
        { status: 400 }
      );
    }

    // Create borrowing and update book availability
    const [borrowing] = await prisma.$transaction([
      prisma.borrowing.create({
        data: {
          bookId: parseInt(bookId),
          memberId: parseInt(memberId),
          dueDate: new Date(dueDate),
          status: 'borrowed',
        },
        include: {
          book: true,
          member: true,
        },
      }),
      prisma.book.update({
        where: { id: parseInt(bookId) },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      }),
    ]);

    return NextResponse.json(borrowing, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create borrowing' },
      { status: 500 }
    );
  }
}
