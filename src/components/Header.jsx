import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsersCog } from 'react-icons/fa';


const Header = () => {
    const [active, setActive] = useState("AnaSayfa"); //hangi sayfa aktif

    const location = useLocation(); //kullanıcı hangi sayfada takip eder

    useEffect(() => {
        if (location.pathname === "/") {
            setActive("AnaSayfa");
        } else if (location.pathname === "/add") {
            setActive("Ekle");
        }
    }, [location.pathname]);//yol değiştiğinde çalışır

    return (
        <header className="glass-card mx-5 my-6 px-8 py-4 flex items-center justify-between gap-4 rounded-2xl hover-lift">
            <div className="flex items-center gap-3">
                <FaUsersCog className="text-2xl text-blue-500 animate-pulse drop-shadow-lg" />
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-widest drop-shadow-xl bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
                    style={{
                        textShadow: '0 2px 16px #fbbf24, 0 2px 32px #3b82f6'
                    }}
                >
                    Kullanıcı Yönetim Sistemi
                </Link>
            </div>
            <nav className="flex gap-6">
                <Link
                    to="/"
                    className={`px-5 py-2 rounded-full font-bold transition-all duration-200
                        ${active === "AnaSayfa" ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-yellow-300 text-white shadow-md hover:bg-yellow-400 hover:scale-105"}
                    `}
                >
                    Ana Sayfa
                </Link>
                <Link
                    to="/add"
                    className={`px-5 py-2 rounded-full font-bold transition-all duration-200
                        ${active === "Ekle" ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-yellow-300 text-white shadow-md hover:bg-yellow-400 hover:scale-105"}
                    `}
                >
                    Yeni Kullanıcı Ekle
                </Link>
            </nav>
        </header>
    );
};

export default Header;