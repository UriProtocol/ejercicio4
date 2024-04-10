import axios from "axios";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

function Login() {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {setToken, setUsername} = useAuthStore()

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/user/auth', { nombre, password });
            if (response.data.token) {
                setToken(response.data.token, response.data.result[0].id);
                setUsername(nombre)
                setError("");
            }
        } catch (error) {
            //@ts-ignore
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError("Credenciales incorrectas"); // Set error message
                //@ts-ignore
            } else if (error.request) {
                // The request was made but no response was received
                setError("The server did not respond. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("An error occurred. Please try again.");
            }
            console.error("Login error:", error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col w-full p-8 bg-zinc-700 text-white shadow rounded">
                <p className="text-center text-3xl font-bold mb-5">Iniciar sesión</p>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Usuario</label>
                    <input id="name" value={nombre} onChange={(e) => setNombre(e.target.value)} className=" bg-white bg-opacity-15 rounded text-white px-4 py-2 w-full focus:outline-none" placeholder="usuario24" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className="bg-white rounded bg-opacity-15 text-white px-4 py-2 w-full focus:outline-none" required />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="rounded w-full px-4 py-2 bg-white bg-opacity-25 font-medium mt-4 hover:bg-opacity-35 transition">Iniciar</button>
            </form>
        </div>
    )
}

export default Login