"use client"
import GenreForm from "@/components/genres/genreForm";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Modal from "@/components/ui/modal";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type Genre = {
    id: number;
    name: string;
};
export default function Genres() {


    const genresPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [isListLoading, setIsListLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    // State for form submissions (create/edit)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // State for modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
    const [deletingGenreId, setDeletingGenreId] = useState<string | null>(null);


    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

    const apiGenreListUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/genres/list?page=${currentPage}&size=${genresPerPage}`;

    useEffect(() => {
        const fetchGenres = async () => {
            setIsListLoading(true);
            try {
                const response = await fetch(apiGenreListUrl);
                if (!response.ok) throw new Error('Failed to fetch publishers');
                const data = await response.json();

                setGenres(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
            finally {
                setIsListLoading(false)
            }
        };
        fetchGenres();
    }, [currentPage]);

    // Handle Genre creation submission
    const handleCreateSubmit = async (data: any) => {
        setIsSubmitting(true);
        setFormError(null);
        setIsListLoading(true);
        try {

            const response = await fetch('http://localhost:8082/api/genres/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create the genre. Please check your input.');
            }
            const newGenre = await response.json();
            setGenres((prevGenres) => [...prevGenres, newGenre]);
            setIsCreateModalOpen(false);
            setSuccessMessage("Genre created successfully!");

        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
            setIsListLoading(false);
        }
    };

    // Handle Genre editing submission
    const handleEditSubmit = async (data: any) => {
        if (!editingGenre) return;
        setIsListLoading(true);
        setIsSubmitting(true);
        setFormError(null);
        try {
            const response = await fetch(`http://localhost:8082/api/genres/update/${editingGenre.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update the genre.');
            }

            const updatedGenre = await response.json();
            setGenres((prevGenres) =>
                prevGenres.map((genre) => (genre.id === updatedGenre.id ? updatedGenre : genre))
            );
            setIsEditModalOpen(false);
            setSuccessMessage("Genre updated successfully!");

        } catch (err: any) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
            setIsListLoading(false);
        }
    };

    // Handle Genre deletion
    const handleDelete = async (genreId: number) => {

        try {
            setIsListLoading(true);
            const response = await fetch(`http://localhost:8082/api/genres/delete/${genreId}`, {
                method: 'Get',
            });

            if (!response.ok) {
                setWarningMessage("Unable to delete the Genre!");
                return;
            }

            // Remove the genre from the list immutably
            setWarningMessage("Genre deleted successfully!");
            setGenres((prevGenres) => prevGenres.filter((genre) => genre.id !== genreId));

        } catch (err: any) {
            setWarningMessage("Unable to delete the Genre!");
        } finally {
            setIsListLoading(false);
        }
    };

    // Pagination Handling
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleOpenCreateModal = () => {
        setFormError(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (genre: Genre) => {
        setEditingGenre(genre);
        setFormError(null);
        setIsEditModalOpen(true);
    };
    const handleOpenDeleteModal = (id: string) => {
        setDeletingGenreId(id);
        setIsDeleteModalOpen(true);
    };

    //success alert time out effect
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (warningMessage) {
            const timer = setTimeout(() => {
                setWarningMessage(null);
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [warningMessage]);

    if (isListLoading) {
        return <LoadingOverlay loadingText="Fetching Genres..." />;
    }

    // Error state if the initial fetch fails
    if (listError) {
        return <div className="text-center p-10 text-red-500">Error: {listError}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
                    <div className="bg-green-800 text-white py-3 px-5 rounded-lg shadow-lg animate-fade-in-down">
                        {successMessage}
                    </div>
                </div>
            )}
            {warningMessage && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    <div className="bg-red-900 text-white py-3 px-5 rounded-lg shadow-lg animate-fade-in-down">
                        {warningMessage}
                    </div>
                </div>
            )}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Genre">
                <GenreForm
                    onSubmit={handleCreateSubmit}
                    isLoading={isSubmitting}
                    error={formError} // Pass the form-specific error
                />
            </Modal>

            {/* EDIT MODAL */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Genre">
                <GenreForm
                    initialData={editingGenre}
                    onSubmit={handleEditSubmit}
                    isLoading={isSubmitting}
                    error={formError} // Pass the form-specific error
                />
            </Modal>
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-extrabold text-white">Genre List</h1>
                <button
                    onClick={handleOpenCreateModal}
                    className="text-4xl font-bold text-white bg-teal-900 hover:bg-teal-700 cursor-pointer focus:ring-2 focus:ring-sky-500 rounded px-3 pb-2 transition"
                >
                    +
                </button>
            </header>
            {/* Delete MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Genre">
                <p className="text-lg text-slate-200">Are you sure you want to delete this genre?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-[#033112be] transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (deletingGenreId) {
                                handleDelete(Number(deletingGenreId));
                                setIsDeleteModalOpen(false);
                            }
                        }}
                        className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </Modal >

            <div className="overflow-x-auto bg-[#141f2f] shadow rounded-lg">
                <table className="min-w-full divide-y divide-sky-950">
                    <thead className="bg-[#141f2f]">
                        <tr>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">#</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Name</th>
                            <th className="px-6 py-3 text-left text-lg font-bold uppercase tracking-wider text-zinc-200">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-zinc-900 divide-y divide-zinc-700">
                        {genres.map((genre, index) => (
                            <tr key={genre.id} className="hover:bg-[#02531d38] transition">
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">{currentPage * genresPerPage + index + 1}</td>
                                <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap text-zinc-200">{genre.name}</td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleOpenEditModal(genre)}
                                        className="text-teal-800 hover:text-slate-100 ml-6 mr-2 text-xl cursor-pointer"
                                        aria-label={`Edit ${genre.name}`}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <span className="text-white">|</span>
                                    <button
                                        onClick={() => handleOpenDeleteModal(genre.id.toString())}
                                        className="text-rose-800 hover:text-slate-100 ml-2 cursor-pointer text-xl"
                                        aria-label={`Delete ${genre.name}`}
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
        </div>
    );
}