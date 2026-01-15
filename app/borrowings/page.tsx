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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading borrowings...</p>
        </div>
      </div>
    );
  }

  const activeBorrowings = borrowings.filter(b => b.status === 'borrowed');
  const returnedBorrowings = borrowings.filter(b => b.status === 'returned');
  const overdueBorrowings = activeBorrowings.filter(b => isOverdue(b.dueDate, b.status));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Borrowings</h1>
                <p className="text-slate-500 dark:text-slate-400">Track book loans and returns</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className={showForm ? 'btn-secondary' : 'btn-primary'}
            >
              {showForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Check Out Book
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeBorrowings.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Loans</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overdueBorrowings.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
            </div>
          </div>
          
          <div className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{returnedBorrowings.length}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Returned</p>
            </div>
          </div>
        </div>

        {/* Check Out Form */}
        {showForm && (
          <div className="card p-6 mb-8 animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Check Out a Book</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Book
                  </label>
                  <select
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    className="select-field"
                    required
                  >
                    <option value="">Choose a book...</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} ({book.availableCopies} available)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Member
                  </label>
                  <select
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="select-field"
                    required
                  >
                    <option value="">Choose a member...</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="btn-success">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Check Out
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Borrowings List */}
        <div className="space-y-4 animate-fade-in">
          {borrowings.length === 0 ? (
            <div className="card px-6 py-16 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">No borrowings yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Check out your first book to get started!</p>
              </div>
            </div>
          ) : (
            borrowings.map((borrowing) => {
              const overdue = isOverdue(borrowing.dueDate, borrowing.status);
              const daysUntilDue = getDaysUntilDue(borrowing.dueDate);
              
              return (
                <div 
                  key={borrowing.id} 
                  className={`card p-6 transition-all duration-300 hover:shadow-lg ${
                    overdue ? 'border-l-4 border-l-red-500' : 
                    borrowing.status === 'returned' ? 'border-l-4 border-l-emerald-500' : 
                    'border-l-4 border-l-amber-500'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Book & Member Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        overdue 
                          ? 'bg-red-100 dark:bg-red-500/20' 
                          : borrowing.status === 'returned' 
                            ? 'bg-emerald-100 dark:bg-emerald-500/20'
                            : 'bg-amber-100 dark:bg-amber-500/20'
                      }`}>
                        <svg className={`w-7 h-7 ${
                          overdue 
                            ? 'text-red-600 dark:text-red-400' 
                            : borrowing.status === 'returned' 
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                          {borrowing.book.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          by {borrowing.book.author}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {borrowing.member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{borrowing.member.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{borrowing.member.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dates & Status */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Borrowed</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(borrowing.borrowDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Due</p>
                        <p className={`text-sm font-medium ${
                          overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {new Date(borrowing.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      
                      {borrowing.returnDate && (
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Returned</p>
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {new Date(borrowing.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div>
                        {borrowing.status === 'returned' ? (
                          <span className="badge badge-success">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Returned
                          </span>
                        ) : overdue ? (
                          <span className="badge badge-danger">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {Math.abs(daysUntilDue)} days overdue
                          </span>
                        ) : (
                          <span className="badge badge-warning">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {daysUntilDue} days left
                          </span>
                        )}
                      </div>

                      {/* Return Button */}
                      {borrowing.status === 'borrowed' && (
                        <button
                          onClick={() => returnBook(borrowing.id)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Footer */}
        {borrowings.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>Total: {borrowings.length} borrowing record{borrowings.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
