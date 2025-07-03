"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navLinks = [
    { href: "/books", label: "Books" },
    { href: "/genres", label: "Genres" },
    { href: "/publishers", label: "Publishers" }
];
export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-black shadow-lg py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-start h-16">
                    <Link href="/" className="text-2xl font-bold text-slate-100 hover:text-white transition">
                        Booking Managment System
                    </Link>

                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                        return (

                            <Link href={link.href} key={link.label} className={`ml-6 inline-block px-3 text-slate-100 py-2 rounded ${isActive ? "bg-zinc-700" : "hover:bg-zinc-700"} transition`}>
                                {link.label}
                            </Link>
                        );
                    })}



                </div>
            </div>
        </nav>
    );
}   