import express from "express";
import { getUsers, getUserById, createUser, deleteUser, updateUser, getUserStats } from "../controllers/user.js"; //5tane fonksiyonu al içeri

const router = express.Router();

router.get("/", getUsers); // /users olduğunda → getUsers fonksiyonu çalışır.
router.get("/stats/overview", getUserStats);
router.get("/:id", getUserById); // /users/3 olduğunda → getUserById fonksiyonu çalışır.
router.post("/", createUser); // /users yeni kullanıcı ekle
router.delete("/:id", deleteUser); // /users/3 sil
router.put("/:id", updateUser); // /users/3 güncelle

export default router;
