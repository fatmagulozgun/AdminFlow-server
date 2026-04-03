import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api";

const Home = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, countriesCount: 0, byCountry: {} });
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const getUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const istek = await api.get("/users", {
                params: { q: query, sortBy, order },
            });
            if (istek.status === 200) {
                setData(istek.data);
            }
        } catch (err) {
            toast.error(err?.response?.data || "Kullanıcılar yüklenemedi.");
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, [query, sortBy, order]);

    const getStats = useCallback(async () => {
        try {
            const istek = await api.get("/users/stats/overview");
            if (istek.status === 200) {
                setStats(istek.data);
            }
        } catch {
            setStats({ totalUsers: 0, countriesCount: 0, byCountry: {} });
        }
    }, []);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        getStats();
    }, [data.length, getStats]);

    const onDeleteUser = async (id) => {
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            try {
                setIsDeleting(true);
                const istek = await api.delete(`/users/${id}`);
                if (istek.status === 200) {
                    toast.success("Kullanıcı silindi.");
                    getUsers();
                    getStats();
                }
            } catch (err) {
                toast.error(err?.response?.data || "Silme işlemi başarısız.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const topCountry = Object.entries(stats.byCountry || {}).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="p-8 space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <article className="glass-card hover-lift rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                </article>
                <article className="glass-card hover-lift rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Ülke Sayısı</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.countriesCount}</p>
                </article>
                <article className="glass-card hover-lift rounded-2xl p-4">
                    <p className="text-sm text-gray-500">En Yoğun Ülke</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {topCountry ? `${topCountry[0]} (${topCountry[1]})` : "-"}
                    </p>
                </article>
            </section>

            <section className="glass-card rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="İsim, e-posta veya ülke ara..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none ring-blue-200 focus:ring md:max-w-sm"
                    />
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-xl border border-gray-200 px-3 py-2 outline-none"
                        >
                            <option value="name">İsme göre</option>
                            <option value="email">E-postaya göre</option>
                            <option value="country">Ülkeye göre</option>
                        </select>
                        <button
                            onClick={() => setOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                            className="btn-soft bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            {order === "asc" ? "A-Z" : "Z-A"}
                        </button>
                    </div>
                </div>
            </section>

            <table className="main-table min-w-full overflow-hidden rounded-2xl bg-white shadow-lg">
                <thead>
                    <tr className="TABLO-BASLIK bg-gradient-to-r from-yellow-200 via-yellow-100 to-blue-100">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">No</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ad Soyad</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">E-posta</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ülke</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                Kullanıcılar yükleniyor...
                            </td>
                        </tr>
                    )}
                    {!isLoading && data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                Kayıt bulunamadı.
                            </td>
                        </tr>
                    )}
                    {!isLoading && data.map((user, i) => (
                        <tr key={user.id} className="TABLO-ALT border-b hover:bg-blue-50 transition">
                            <td className="px-6 py-4 text-center">{i + 1}</td>
                            <td className="px-6 py-4 text-center">{user.name}</td>
                            <td className="px-6 py-4 text-center">{user.email}</td>
                            <td className="px-6 py-4 text-center">{user.country}</td>
                            <td className="px-6 py-4 ">
                                <div className="flex justify-center space-x-2">
                                    <Link to={`/view/${user.id}`} className="btn-soft bg-blue-500 hover:bg-blue-600 text-white px-4 py-1">Görüntüle</Link>
                                    <Link to={`/update/${user.id}`}>
                                        <button className="btn-soft bg-green-500 hover:bg-green-600 text-white px-4 py-1">Düzenle</button>
                                    </Link>
                                    <button
                                        disabled={isDeleting}
                                        className="btn-soft bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-1"
                                        onClick={() => onDeleteUser(user.id)}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;