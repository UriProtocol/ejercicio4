import { Menu, MenuItem, Snackbar, Tooltip } from '@mui/material'
import { IoIosAdd } from "react-icons/io";
import { SlOptions } from "react-icons/sl"
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Sidebar() {
    const fetchSpaces = useAuthStore(state => state.fetchSpaces);
    const spaces = useAuthStore(state => state.spaces);
    const setBgColor = useAuthStore(state => state.setBgColor)
    const bgColor = useAuthStore(state => state.bgColor)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currId, setCurrId] = useState("")
    const open = Boolean(anchorEl);
    const [openSnackbar, setOpenSnackbar] = useState(false)

    function handleCloseSnackbar(){
        setOpenSnackbar(false)
    }


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string | nunber) => {
        setAnchorEl(event.currentTarget);
        setCurrId(id)
    };
    const handleClose = () => {
        setAnchorEl(null);
        setCurrId("")
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetchSpaces();
    }, [fetchSpaces]);

    const handleSpaceClick = (spaceId: any) => {
        navigate(`/spaces/${spaceId}/cards`);
    };

    const deleteSpace = async() => {
        if(!currId) return
        try {
            const response = await axios.delete(`http://localhost:5000/api/spaces/${currId}`);
            console.log(response)
            setOpenSnackbar(true)
            handleClose()
            fetchSpaces()
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <aside id="logo-sidebar" className="fixed top-0 left-0 pb-3 z-40 w-64 h-screen transition-transform -translate-x-ful sm:translate-x-0 bg-[#0A0A0A] bg-opacity-90 overflow-hidden shadow-md" aria-label="Sidebar">
            <div className=' w-full py-1 transition hover:bg-[#ffffff20] mt-3.5 mb-6 hover:extended-shadow cursor-pointer' onClick={() =>{
                    navigate("/add-spaces")
                    setBgColor("")
            }}>
                <button className=" w-40 mx-auto text-white flex justify-between items-center px-4 py-2 rounded transition">
                    <IoIosAdd className=" scale-125" />
                    <p>
                        Nuevo mural
                    </p>
                </button>
            </div>
            <div className="px-2 pb-4 overflow-y-auto h-auto max-h-[80vh] relative">
                <ul className="space-y-2 font-medium">
                    {spaces.map((space: any) => (
                        <li key={space.id} className=" group py-2 px-4 rounded text-white cursor-pointer mx-4 overflow-hidden relative flex justify-between">
                            <div className="opacity-0 transition group-hover:opacity-80 inset-0 absolute z-0" style={{ backgroundColor: space?.bgColor ? space.bgColor : 'rgb(39 39 42)' }} onClick={() => handleSpaceClick(space.id)} />
                            <Tooltip title={space.name} followCursor placement="top" arrow>
                                <p className=" z-2 relative max-w-28 overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => handleSpaceClick(space.id)} >{space.name}</p>
                            </Tooltip>
                            <Tooltip title='options' arrow placement="top">
                                {/*@ts-ignore*/}
                                <div className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white hover:bg-opacity-30 transition" onClick={(e) =>handleClick(e, space.id)}>
                                    <SlOptions className=" text-white opacity-90" />
                                </div>
                            </Tooltip>

                        </li>
                    ))}
                </ul>
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: 'rgb(39 39 42)',
                        marginLeft: "-1rem",
                        "& .MuiButtonBase-root": {
                            fontSize: "0.7rem !important",
                            color: "white",
                            fontFamily: 'sans-serif',
                            fontWeight: "300"
                        }
                    }
                }}

            >
                <MenuItem className=' text-sm' onClick={deleteSpace}>Eliminar</MenuItem>
                <MenuItem className=' text-sm' onClick={() => { }}>Cambiar nombre</MenuItem>
                <MenuItem className=' text-sm' onClick={() => { }}>Cambiar color</MenuItem>
            </Menu>
            <Snackbar
                open={openSnackbar}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#b70f3b"
                    }
                }}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message="Mural eliminado!"
            />
        </aside>
    )
}
