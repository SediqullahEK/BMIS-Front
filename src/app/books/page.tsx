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
};

type Genre = {
    id: number;
    name: string;
};
type Publisher = {
    id: number;
    name: string;
};

export default function Books() {
    // State for the list of books
    const [books, setBooks] = useState<Book[]>([]);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);

    // State for the initial page load
    const [isListLoading, setIsListLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    // State for form submissions (create/edit)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // State for modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
    

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // --- NEW: State for pagination ---
    const [currentPage, setCurrentPage] = useState(0); // API is 0-indexed
    const [totalPages, setTotalPages] = useState(0);
    const booksPerPage = 5; // Or any size you prefer

    //success alert time out effect
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage]);


    // --- DATA FETCHING & HANDLERS ---

    // Effect to fetch all books on initial component mount
    useEffect(() => {
        const fetchBooks = async () => {
            setIsListLoading(true);
            try {
                // Construct URL with page and size parameters
                const response = await fetch(`http://localhost:8082/api/books/list?page=${currentPage}&size=${booksPerPage}`);
                if (!response.ok) throw new Error('Failed to fetch books.');

                const data = await response.json();
                console.log(data); // Log the response for debugging
                setBooks(data.content); // The books are in the 'content' field
                setTotalPages(data.totalPages); // Get total pages from the response
            } catch (err: any) {
                setListError(err.message);
            } finally {
                setIsListLoading(false);
            }
        };

        fetchBooks();
    }, [currentPage]);

    //effect to fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/genres/list');
                if (!response.ok) throw new Error('Failed to fetch genres');
                const data = await response.json();

                setGenres(data);
                console.log('Fetched genres:', data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);
    //effect to fetch publishers
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/publishers/list');
                if (!response.ok) throw new Error('Failed to fetch publishers');
                const data = await response.json();

                setPublishers(data);
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        };
        fetchGenres();
    }, []);

    // Re-run this effect whenever 'currentPage' changes
    // --- NEW: Handlers for pagination controls ---
    const handleNextPage = () => {
        // Go to the next page if we're not on the last page
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        // Go to the previous page if we're not on the first page
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handlers to open modals and clear previous form errors
    const handleOpenCreateModal = () => {
        setFormError(null); // Clear any previous errors
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (book: Book) => {
        setEditingBook(book);
        setFormError(null); // Clear any previous errors
        setIsEditModalOpen(true);
    };
    const handleOpenDeleteModal = (id: string) => {
        setDeletingBookId(id);
        setIsDeleteModalOpen(true);
    };

    // Handle book creation submission
    const handleCreateSubmit = async (data: any) => {
        setIsSubmitting(true);
        setFormError(null);
        try {
            const response = await fetch('http://localhost:8082/api/books/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create the book. Please check your input.');
            }

            const newBook = await response.json();
            // Add the new book to the list immutably
            setBooks((prevBooks) => [...prevBooks, newBook]);
            setIsCreateModalOpen(false);
            setSuccessMessage("Book created successfully!");
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle book editing submission
    const handleEditSubmit = async (data: any) => {
        if (!editingBook) return;

        setIsSubmitting(true);
        setFormError(null);
        try {
            const response = await fetch(`http://localhost:8082/api/books/update/${editingBook.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update the book.');
            }

            const updatedBook = await response.json();
            // Update the specific book in the list immutably
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
            );
            setIsEditModalOpen(false);
            setSuccessMessage("Book updated successfully!");
        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle book deletion
    const handleDelete = async (bookId: number) => {

        try {
            const response = await fetch(`http://localhost:8082/api/books/delete/${bookId}`, {
                method: 'Get',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the book.');
            }

            // Remove the book from the list immutably
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } catch (err: any) {
            alert(err.message);
        }
    };

    // --- RENDER LOGIC ---

    // Initial loading state for the whole page
    if (isListLoading) {
        return <div className="text-center p-10 text-white">Loading books...</div>;
    }

    // Error state if the initial fetch fails
    if (listError) {
        return <div className="text-center p-10 text-red-500">Error: {listError}</div>;
    }

    // Main component render
    return (
        <div className="container mx-auto p-6">
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    {/* This is the visible alert box */}
                    <div className="bg-green-800 text-white py-3 px-5 rounded-lg shadow-lg animate-fade-in-down">
                        {successMessage}
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Book">
                <BookForm
                    onSubmit={handleCreateSubmit}
                    isLoading={isSubmitting}
                    error={formError} // Pass the form-specific error
                />
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Book">
                <BookForm
                    initialData={editingBook}
                    onSubmit={handleEditSubmit}
                    isLoading={isSubmitting}
                    error={formError} // Pass the form-specific error
                />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Book">
                <p className="text-lg text-slate-200">Are you sure you want to delete this book?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-[#033112be] transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (deletingBookId) {
                                handleDelete(deletingBookId);
                                setIsDeleteModalOpen(false);
                            }
                        }}
                        className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </Modal >

            <header className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-extrabold text-white">Book List</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="text-4xl font-bold text-white bg-teal-900 hover:bg-teal-700 cursor-pointer focus:ring-2 focus:ring-sky-500 rounded px-3 pb-2 transition"
                >
                    +
                </button>
            </header>

            <div className="overflow-x-auto bg-[#141f2f] shadow rounded-lg">
                <table className="min-w-full divide-y divide-sky-950">
                    <thead className="bg-[#141f2f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">#</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Title</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Author</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Genre</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Publisher</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                        {books.map((book, index) => (
                            <tr key={book.id} className="hover:bg-[#02531d38] transition">
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">{currentPage * booksPerPage + index + 1}</td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">{book.title}</td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">{book.author}</td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {genres.map((genre) => (
                                        book.genreId === genre.id ? genre.name : ''
                                    ))}
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">
                                    {publishers.map((publisher) => (
                                        book.publisherId === publisher.id ? publisher.name : ''
                                    ))}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleOpenEditModal(book)}
                                        className="text-teal-800 hover:text-slate-100 ml-6 mr-2 text-xl cursor-pointer"
                                        aria-label={`Edit ${book.title}`}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <span className="text-white">|</span>
                                    <button
                                        onClick={() => handleOpenDeleteModal(book.id)}
                                        className="text-rose-800 hover:text-slate-100 ml-2 cursor-pointer text-xl"
                                        aria-label={`Delete ${book.title}`}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalPages > 1 && (

                    <div className="flex items-center justify-center mt-6 text-slate-200 pb-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="px-4 py-2 mx-1 bg-zinc-900 border border-slate-500 rounded hover:bg-[#02531d38] disabled:bg-zinc-700 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                            Previous
                        </button>

                        <span className="px-4 py-2">
                            Page {currentPage + 1} of {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            className="px-4 py-2 mx-1 bg-zinc-900 border border-slate-500 rounded hover:bg-[#02531d38] disabled:bg-zinc-700 disabled:cursor-not-allowed transition cursor-pointer"
                        >
                            Next
                        </button>
                    </div>

                )}
            </div>
        </div >
    );
}