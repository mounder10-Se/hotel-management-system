import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/ajouterChambre": "http://localhost:3000/admin",
            "/chambres": "http://localhost:3000/admin",
            "/dletechamre": "http://localhost:3000/admin",
            "/infoChambre": "http://localhost:3000/admin",
            "/modifierChambre": "http://localhost:3000/admin",
            "/Login": "http://localhost:3000/auth",
            "/verify-code": "http://localhost:3000/auth",

            "/reset-password": "http://localhost:3000/auth",
            "/send-code": "http://localhost:3000/auth",
            "/probleme": "http://localhost:3000/admin",
            "/informationPerssonel": "http://localhost:3000/admin",
            "/clients": "http://localhost:3000/respsionite",
            "/utilisateurs": "http://localhost:3000/admin/gestionutilisateurs",
            "/create": "http://localhost:3000/admin/gestionutilisateurs",
            "/deconnect": "http://localhost:3000/admin/gestionutilisateurs",
            "/delete": "http://localhost:3000/admin",
            "/update": "http://localhost:3000/admin/gestionutilisateurs",
            "/infPersson": "http://localhost:3000/admin/gestionutilisateurs",
            "/allNot": "http://localhost:3000/admin/gestionutilisateurs",
        },
    },
});