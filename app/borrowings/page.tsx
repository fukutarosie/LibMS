'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Borrowing {
  id: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  book: {
    id: number;
    title: string;
    author: string;
  };
  member: {
    id: number;
    name: string;
    email: string;
  };
}

interface Book {
  id: number;
  title: string;
  availableCopies: number;
}

interface Member {
  id: number;
  name: string;
}

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: '',
    dueDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [borrowingsRes, booksRes, membersRes] = await Promise.all([
        fetch('/api/borrowings'),
        fetch('/api/books'),
        fetch('/api/members'),
      ]);

      const borrowingsData = await borrowingsRes.json();
      const booksData = await booksRes.json();
      const membersData = await membersRes.json();

      setBorrowings(Array.isArray(borrowingsData) ? borrowingsData : []);
      setBooks(Array.isArray(booksData) ? booksData.filter((b: Book) => b.availableCopies > 0) : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBorrowings([]);
      setBooks([]);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/borrowings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          bookId: '',
          memberId: '',
          dueDate: '',
        });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating borrowing:', error);
    }
  };

  const returnBook = async (id: number) => {
    try {
      await fetch(`/api/borrowings/${id}`, {
        method: 'PUT',
      });
      fetchData();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-2 block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">🔄 Borrowings</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ Check Out Book'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Check Out Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Book</label>
                <select
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Member</label>
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Check Out
              </button>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Book</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Member</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Borrow Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Due Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Return Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {borrowings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No borrowings found. Check out a book!
                    </td>
                  </tr>
                ) : (
                  borrowings.map((borrowing) => (
                    <tr
                      key={borrowing.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        isOverdue(borrowing.dueDate, borrowing.status) ? 'bg-red-50 dark:bg-red-900/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-white">
                        <div>{borrowing.book.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {borrowing.book.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        <div>{borrowing.member.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {borrowing.member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(borrowing.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(borrowing.dueDate).toLocaleDateString()}
                        {isOverdue(borrowing.dueDate, borrowing.status) && (
                          <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">
                            OVERDUE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {borrowing.returnDate
                          ? new Date(borrowing.returnDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            borrowing.status === 'returned'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {borrowing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {borrowing.status === 'borrowed' && (
                          <button
                            onClick={() => returnBook(borrowing.id)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
