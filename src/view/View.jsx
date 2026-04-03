import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api";

const View = () => {
  const [user, setUser] = useState({});//kullanıcı bilgisi
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); //url'deki parametre
  const navigate = useNavigate();//yönlendirme

  useEffect(() => { //sayfa ilk açıldığında getUser çalışsın.Yani kullanıcı  bilgisi çekiliyor id değişirse tekrar çalışır
    const getUser = async () => {
      try {
        setLoading(true);
        const istek = await api.get(`/users/${id}`);
        if (istek.status === 200) {
          setUser(istek.data);
        }
      } catch (err) {
        setUser({});
        toast.error(err?.response?.data || "Kullanıcı bulunamadı.");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-4 items-center hover-lift">
        {loading && <p className="text-white font-semibold">Yükleniyor...</p>}
        <div className="text-left w-full text-lg font-medium space-y-2 mb-4">
          <div><span className="font-bold">ID:</span> {user.id}</div>
          <div><span className="font-bold">Ad Soyad:</span> {user.name}</div>
          <div><span className="font-bold">E-posta:</span> {user.email}</div>
          <div><span className="font-bold">Ülke:</span> {user.country}</div>
        </div>
        <button
          className="btn-soft w-full bg-green-500 hover:bg-green-600 text-white py-2 text-lg mb-2"
          onClick={() => navigate(`/update/${user.id}`)}
        >
          Düzenle
        </button>
        <button
          className="btn-soft w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-lg"
          onClick={() => navigate(-1)}//geri git
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default View;