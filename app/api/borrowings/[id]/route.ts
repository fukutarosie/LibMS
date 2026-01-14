import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// PUT - Return a book
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: parseInt(id) },
    });

    if (!borrowing) {
      return NextResponse.json(
        { error: 'Borrowing not found' },
        { status: 404 }
      );
    }

    if (borrowing.status === 'returned') {
      return NextResponse.json(
        { error: 'Book already returned' },
        { status: 400 }
      );
    }

    // Update borrowing and increment book availability
    const [updatedBorrowing] = await prisma.$transaction([
      prisma.borrowing.update({
        where: { id: parseInt(id) },
        data: {
          status: 'returned',
          returnDate: new Date(),
        },
        include: {
          book: true,
          member: true,
        },
      }),
      prisma.book.update({
        where: { id: borrowing.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json(updatedBorrowing);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    );
  }
}

// DELETE borrowing
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.borrowing.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Borrowing deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete borrowing' },
      { status: 500 }
    );
  }
}
