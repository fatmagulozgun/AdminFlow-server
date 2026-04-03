import { v4 as uuid } from "uuid"; //benzersiz bir id üretir

let users = [
    {
        id: uuid(),
        name: "Fatma",
        email: "ftmgl@gmail.com",
        country: "Turkey",
    },
    {
        id: uuid(),
        name: "Ali",
        email: "ali@gmail.com",
        country: "Turkey",
    }
];

const normalize = (value = "") => value.toString().trim();
const normalizeLower = (value = "") => normalize(value).toLowerCase();

const validateUserPayload = ({ name, email, country }) => {
    const trimmedName = normalize(name);
    const trimmedEmail = normalize(email);
    const trimmedCountry = normalize(country);

    if (!trimmedName || !trimmedEmail || !trimmedCountry) {
        return { ok: false, message: "Tüm alanlar zorunludur." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        return { ok: false, message: "Geçerli bir e-posta adresi girin." };
    }

    return {
        ok: true,
        value: {
            name: trimmedName,
            email: trimmedEmail,
            country: trimmedCountry
        }
    };
};

export const getUsers = (req, res) => { //getir tüm Kullanıcıları
    const { q = "", sortBy = "name", order = "asc" } = req.query;
    const searchableKeys = ["name", "email", "country"];
    const safeSortBy = searchableKeys.includes(sortBy) ? sortBy : "name";
    const direction = order === "desc" ? -1 : 1;
    const searchTerm = normalizeLower(q);

    const filtered = users.filter((user) =>
        !searchTerm || searchableKeys.some((key) => normalizeLower(user[key]).includes(searchTerm))
    );

    const sorted = [...filtered].sort((a, b) => {
        const first = normalizeLower(a[safeSortBy]);
        const second = normalizeLower(b[safeSortBy]);
        return first.localeCompare(second) * direction;
    });

    res.send(sorted);  // cevap olarak users dizisini ver
};

export const getUserStats = (_req, res) => {
    const byCountry = users.reduce((acc, user) => {
        const country = normalize(user.country) || "Bilinmiyor";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    res.send({
        totalUsers: users.length,
        countriesCount: Object.keys(byCountry).length,
        byCountry
    });
};

export const getUserById = (req, res) => {  // /users/3 olana git
    const id = req.params.id;  ///users/3 → id = 3
    const user = users.find((u) => u.id === id); // dizide arama yapar.id=3 varmı
    if (!user) { // kullanıcı yoksa
        return res.status(400).send("Kullanıcı yok");
    }
    return res.send(user);  // cevap olarak kullanıcı gönder
};

export const createUser = (req, res) => { // /users yeni veri ekle(postla)
    const validation = validateUserPayload(req.body);
    if (!validation.ok) {
        return res.status(400).send(validation.message);
    }

    const { name, email, country } = validation.value;
    const emailExists = users.some((u) => normalizeLower(u.email) === normalizeLower(email));
    if (emailExists) {
        return res.status(409).send("Bu e-posta zaten kayıtlı.");
    }

    const new_user = {
        id: uuid(), // yeni id oluştur
        name: name,
        email: email,
        country: country
    };
    users.push(new_user); // users dizisine ekle.
    return res.send("Yeni kullanıcı oluşturuldu.");
};

export const deleteUser = (req, res) => {// /users/3 olanı sil
    const id = req.params.id; // id: 3
    const user = users.find((u) => u.id === id); // dizide arama yapar
    users = users.filter((u) => u.id !== id); //sadece eşleşmeyenleri tutarak listeden siler.
    if (!user) {
        return res.status(400).send("Kullanıcı yok");
    }
    return res.send(users); // cevap olarak kullanıcı gönder
};

export const updateUser = (req, res) => { // /users/3 olanı güncelle
    const id = req.params.id; // id: 3
    const user = users.find((u) => u.id === id); // users dizisinde, id'si istenen kullanıcıyı bulur.string'den sayıya çevirir.
    if (!user) {
        return res.status(400).send("Kullanıcı yok");
    }

    const validation = validateUserPayload(req.body);
    if (!validation.ok) {
        return res.status(400).send(validation.message);
    }

    const { name, email, country } = validation.value;
    const emailExists = users.some((u) => u.id !== id && normalizeLower(u.email) === normalizeLower(email));
    if (emailExists) {
        return res.status(409).send("Bu e-posta zaten kayıtlı.");
    }

    user.name = name;
    user.email = email;
    user.country = country;
    return res.send("Kullanıcı güncellendi.");
};