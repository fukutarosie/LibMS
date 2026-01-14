import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET single book
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: { borrowings: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT - Update book
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, author, isbn, publicationYear, totalCopies, availableCopies } = body;

    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        title,
        author,
        isbn,
        publicationYear: parseInt(publicationYear),
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(availableCopies),
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE book
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
