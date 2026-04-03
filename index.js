import express from "express"; //Http isteklerini yönetir.
import bodyParser from "body-parser"; //gelen http isteklerinin body kısmını kolayca okumak için
import userRoutes from "./routes/userRoutes.js"; // / users ile başlayan istekler buraya yönlendirilecek
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        // Postman/curl veya same-origin server çağrıları origin göndermeyebilir.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get("/health", (_req, res) => {
    res.status(200).send({ status: "ok" });
});

app.use("/users", userRoutes); // /users ile başlayan tüm istekleri userRoutes dosyasına yönlendirir.
app.use("*", (req, res) => { // hiçbir route eşleşmezse
    res.status(404).send("Page not found");
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
