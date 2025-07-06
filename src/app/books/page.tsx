"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from "@/components/ui/modal";
import BookForm from "@/components/books/bookForm";

type Book = {
    id: number;
    title: string;
    author: string;
    genre?: { name: string };
    publisher?: { name: string };
    // Add other fields as needed
};

export default function Books() {


    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);

    //list all books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/books/list');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBooks(data);
            } catch (err: any) {
                setError(err.message);
                console.error('API error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Handle book creation
    const handleCreateSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8082/api/books/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create book');
            }

            const newBook = await response.json();
            setBooks((prevBooks) => [...prevBooks, newBook]);
            
            setIsCreateModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // Handle book editing
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const handleEditSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8082/api/books/update/${editingBook?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update book');
            }

            const updatedBook = await response.json();
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
            );

            setIsEditModalOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    
    //loader
    if (loading) {
        return <div className="text-center p-10 text-white">Loading books...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    //main render
    return (

        <div className="container mx-auto p-6">

            {/* CREATE MODAL */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Book">
                <BookForm onSubmit={handleCreateSubmit} isLoading={false} />
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Book">
                <BookForm
                    initialData={editingBook}
                    onSubmit={handleEditSubmit}
                    isLoading={false}
                />
            </Modal>

            <header className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-extrabold text-white">Book List</h1>
                <button onClick={() => setIsCreateModalOpen(true)} 
                    className="text-4xl font-bold text-white bg-teal-900 hover:bg-teal-700 cursor-pointer focus:ring-2 focus:ring-sky-500 rounded px-3 pb-2 transition"
                >
                    +
                </button>
            </header>

            <div className="overflow-x-auto bg-sky-900 shadow rounded-lg">
                <table className="min-w-full divide-y divide-sky-950">
                    <thead className="bg-[#141f2f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                Genre
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                Publisher
                            </th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                        {books.map((book, index) => (
                            <tr key={book.id} className="hover:bg-[#02531d38] transition">
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {book.title}
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {book.author}
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {book.genre?.name || 'None'}
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {book.publisher?.name || 'None'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/books/edit/${book.id}`} className="text-teal-800 hover:text-slate-100 ml-6 mr-2 text-xl cursor-pointer">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Link>
                                    <span className="text-white">|</span>
                                    <Link href={`/books/delete/${book.id}`} onClick={() => confirm('Are you sure to delete this record permanently?')} className="text-rose-800 hover:text-slate-100 ml-2 cursor-pointer text-xl">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Link>
                                </td>
                            </tr>
                        ))}



                    </tbody>
                </table>
            </div>
        </div >
    );
}