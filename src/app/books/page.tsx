"use client"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Books() {

    // function addBook() {
    //     window.location.href = "/books/add";
    // }
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8082/api/books/list')
            .then((res) => res.json())
            .then((data) => setBooks(data))
            .catch((err) => console.error('API error:', err));
    }, []);
    console.log(books);
    return (

        <div className="container mx-auto p-6">

            <header className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-extrabold text-white">Book List</h1>
                <button
                    className="text-4xl font-bold text-white bg-[#18803b] hover:bg-sky-800 focus:ring-2 focus:ring-sky-500 rounded px-3 pb-2 transition"
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
                            <tr key={book.id} className="hover:bg-zinc-700 transition">
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
                                        <i className="fa fa-edit"></i>
                                    </Link>
                                    |
                                    <Link href={`/books/delete/${book.id}`} onClick={() => confirm('Are you sure to delete this record permanently?')} className="text-rose-800 hover:text-slate-100 ml-2 cursor-pointer text-xl">
                                        <i className="fa fa-trash"></i>
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