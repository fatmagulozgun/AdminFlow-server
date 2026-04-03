import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api";

const AddEdit = () => {
  const baslangicData = {
    name: "",
    email: "",
    country: "",
  }

  const [data, setData] = useState(baslangicData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, country } = data;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const getSingleUser = async (id) => {
        try {
          const istek = await api.get(`/users/${id}`);
          if (istek.status === 200) {
            setData({ ...istek.data });
          }
        } catch (err) {
          toast.error(err?.response?.data || "Kullanıcı getirilemedi.");
          navigate("/");
        }
      };
      getSingleUser(id);
    }
  }, [id, navigate]);


  const createUser = async (payload) => {
    const istek = await api.post("/users", payload);
    if (istek.status === 200) {
      toast.success(istek.data);
    }
  };

  const updateUser = async (payload, userId) => {
    const istek = await api.put(`/users/${userId}`, payload);
    if (istek.status === 200) {
      toast.success(istek.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !country.trim()) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Geçerli bir e-posta girin.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      country: country.trim(),
    };

    try {
      setIsSubmitting(true);
      if (!id) {
        await createUser(payload);
      } else {
        await updateUser(payload, id);
      }
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || "İşlem başarısız.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setData({ ...data, [fieldName]: value });
  };



  return (
    <div className="flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 w-full max-w-lg shadow-2xl flex flex-col gap-4 hover-lift">
        <h1 className="text-2xl font-bold text-slate-700 text-center mb-2">
          {id ? "Kullanıcı Güncelle" : "Yeni Kullanıcı Ekle"}
        </h1>

        <label className="text-slate-700 font-semibold text-lg">Ad Soyad</label>
        <input type="text" name="name" placeholder="Ad soyad girin" value={data.name} onChange={handleChange} className="rounded-full px-4 py-2 outline-none border border-white/50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-200" required />

        <label className="text-slate-700 font-semibold text-lg">E-posta</label>
        <input type="email" name="email" placeholder="E-posta girin" value={data.email} onChange={handleChange} className="rounded-full px-4 py-2 outline-none border border-white/50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-200" required />

        <label className="text-slate-700 font-semibold text-lg">Ülke</label>
        <input type="text" name="country" placeholder="Ülke girin" value={data.country} onChange={handleChange} className="rounded-full px-4 py-2 outline-none border border-white/50 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-200" required />

        <input
          type="submit"
          disabled={isSubmitting}
          className="btn-soft mt-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2 text-lg"
          value={isSubmitting ? "Kaydediliyor..." : id ? "Güncelle" : "Kaydet"}
        />
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-soft mt-1 bg-blue-500 hover:bg-blue-600 text-white py-2 text-lg"
        >
          Ana Sayfaya Dön
        </button>
      </form>
    </div>
  );
};

export default AddEdit;


