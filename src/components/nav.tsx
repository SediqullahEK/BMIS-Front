import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-black shadow-lg py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-start h-16">
                    <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-white transition">
                        BookManager
                    </Link>
                    <Link href="/products" className="ml-6 inline-block px-3 text-slate-100 py-2 rounded hover:bg-zinc-700 transition">
                        Books
                    </Link>
                    <Link href="/products/1" className="ml-4 inline-block px-3 text-slate-100 py-2 rounded hover:bg-zinc-700 transition">
                        Genres
                    </Link>
                    
                </div>
            </div>
        </nav>
    );
}   