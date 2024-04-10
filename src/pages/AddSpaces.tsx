import { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
//@ts-ignore
import { TwitterPicker } from 'react-color'
//@ts-ignore
import { DateTime } from 'luxon'
import { Snackbar } from '@mui/material';


function AddSpaces() {
    const [name, setName] = useState("");
    const [color, setColor] = useState("")
    const userId = useAuthStore(state => state.userId);
    const token = useAuthStore(state => state.token);
    const fetchSpaces = useAuthStore(state => state.fetchSpaces);
    const { username, setBgColor } = useAuthStore()
    const [openSnackbar, setOpenSnackbar] = useState(false)

    function handleCloseSnackbar(){
        setOpenSnackbar(false)
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const requestBody = {
                userId: userId,
                name: name,
                color,
                username,
                createdAt: DateTime.now().toISO()
            }
            const config = {
                headers: { "token": token }
            }
            await axios.post('http://localhost:5000/api/spaces', requestBody, config);
            setOpenSnackbar(true)
            fetchSpaces();
        } catch (error) {
            //@ts-ignore
            if (error.response) {
                console.log(error);
                //@ts-ignore
            } else if (error.request) {
                console.log(error);
            }
            console.error("Login error:", error);
        }
    }

    function onChange(color, event) {
        console.log(color, event)
        setColor(color.hex)
        setBgColor(color.hex)
    }

    console.log(DateTime.now())

    return (
        <div className="flex justify-center items-center h-[60vh]">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col w-full">
                <p className="text-center text-2xl font-medium mb-5 text-white">Agregar nuevo espacio</p>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Nombre</label>
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border w-full bg-white bg-opacity-15 rounded border-none py-2 px-4 text-white focus:outline-none text-sm" placeholder="Mi mural" required />
                </div>
                <div className="mb-5">
                    <p className="block mb-4 text-sm font-medium text-white">Color de fondo</p>
                    <TwitterPicker onChange={onChange} />
                </div>
                <button type="submit" className="text-white bg-white bg-opacity-15 hover:bg-opacity-30 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm w-full p-2 text-center transition">Agregar</button>
            </form>
            <Snackbar
                open={openSnackbar}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#00d084"
                    }
                }}
                autoHideDuration={20000}
                onClose={handleCloseSnackbar}
                message="Mural creado!"
            />
        </div>
    )
}

export default AddSpaces