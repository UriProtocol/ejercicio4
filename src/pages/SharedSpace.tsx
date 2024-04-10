//@ts-nocheck

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import SimpleModal from '../components/SimpleModal';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Menu, MenuItem, Snackbar, Tooltip } from '@mui/material';
import { IoIosAdd } from 'react-icons/io';
import Card from '../components/Card';
//@ts-ignore
import SignatureCanvas from 'react-signature-canvas'
//@ts-ignore
import { TwitterPicker, SliderPicker, CompactPicker } from 'react-color'
import { IoMdMore } from "react-icons/io";

function SharedSpace() {
    const { id } = useParams();
    const token = useAuthStore(state => state.token);
    const setBgColor = useAuthStore(state => state.setBgColor);
    const [spaceDetails, setSpaceDetails] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isCopied, setIsCopied] = useState({});
    const sigPad = useRef(null)
    const [space, setSpace] = useState({})
    const { cardColor, setCardColor } = useAuthStore()
    const [penColor, setPenColor] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)

    function handleCloseSnackbar() {
        setOpenSnackbar(false)
    }



    function onChange(color, event) {
        setCardColor(color.hex)
    }
    function handlePenChange(color, event) {
        console.log(color)
        setPenColor(color.hex)
    }

    const fetchSpace = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/spaces/${id}`, {
                headers: { "token": token }
            });
            const space = response.data.data[0]
            setSpace(space)
            setBgColor(space.bgColor)
            console.log(space)
        } catch (error) {
            console.error('Error fetching space details:', error);
        }
    };

    useEffect(() => {
        fetchSpaceDetails();
    }, [id, token]);
    const fetchSpaceDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/spaces/${id}/cards`, {
                headers: { "token": token }
            });
            setSpaceDetails(response.data.data);
            console.log(response)
        } catch (error) {
            console.error('Error fetching space details:', error);
            setSpaceDetails([]);
        }
    };

    useEffect(() => {
        fetchSpaceDetails();
        fetchSpace()
    }, [id, token]);

    if (!spaceDetails) return <div>Loading...</div>

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("title", title);
        formData.append("description", description);
        if (file) {
            formData.append('file', file);
        }
        if (!sigPad.current.isEmpty()) {
            const dataUrl = sigPad.current.toDataURL('image/png');
            formData.append('canvasImg', dataUrl);
        } else {
            formData.append('canvasImg', "");
        }
        formData.append('cardColor', cardColor);


        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'token': token,
            },
        };
        try {
            await axios.post(`http://localhost:5000/api/spaces/${id}/cards`, formData, config);
            setModalOpen(false);
            setOpenSnackbar(true)
            fetchSpaceDetails();
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setCardColor("")
        }
    };

    function handleClear() {
        //@ts-ignore
        sigPad.current?.clear()
    }


    const deleteCard = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/card/${id}`);
            console.log(response)
            fetchSpaceDetails()

        } catch (error) {
            console.error('Error opening file:', error);
        }
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteSpace = async() => {
        if(!space.id) return
        try {
            const response = await axios.delete(`http://localhost:5000/api/spaces/${space.id}`);
            console.log(response)
            handleClose()
            fetchSpaces()
        } catch (error) {
            console.error(error);
        }
    }

     const copyLinkToClipboard = async () => {
      try {
        const url = `http://localhost:5173/spaces/${space.id}/share`;
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        alert('Link copiado al portapapeles!')
      } catch (error) {
        console.error('Error copying link to clipboard:', error);
      }
    };


    console.log(space)

    return (
        <>
            <div className='flex flex-row items-center gap-5 mb-4'>
                <p className=' font-medium text-xl text-white'>
                    {space?.name}
                </p>
                {/*<IoMdMore className=' text-white scale-150 text-opacity-40 transition hover:text-opacity-80 cursor-pointer' onClick={handleClick}/>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor: space?.bgColor ? space?.bgColor : "rgb(63 63 70)",
                            filter: "grayscale(0.3)",
                            "& .MuiButtonBase-root": {
                                fontSize: "0.8rem !important",
                                color: "white",
                            }
                        }
                    }}
                >
                    <MenuItem className=' text-sm' onClick={copyLinkToClipboard}>Compartir</MenuItem>
                </Menu>*/}
            </div>
            <div className='flex flex-row items-center gap-5'>
                <button onClick={() => setModalOpen(true)} className="text-white py-2 px-4 bg-white bg-opacity-25 hover:bg-opacity-35 transition rounded-md flex gap-3 items-center text-sm">
                    <IoIosAdd className="" />
                    <p>
                        Agregar tarjeta
                    </p>
                </button>
                <p className=' opacity-80 ml-auto mr-8 text-l text-center text-white'>
                    Created by: {space?.createdBy || 'anonymous'}
                </p>
            </div>

            {/* CARDS */}
            <div className="grid gap-6 grid-cols-3 mr-8 mb-8 pb-4">
                {spaceDetails.map((detail: any) => (
                    <Card detail={detail} deleteCard={deleteCard} canDelete={false}/>
                ))}
            </div>


            <SimpleModal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setCardColor("") }} isCard>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-bold mb-6 text-white">Agregar nuevos detalles</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">Titulo</label>
                        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border w-full bg-white bg-opacity-15 rounded border-none py-2 px-4 text-white focus:outline-none text-sm" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">Descripcion</label>
                        <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="border w-full bg-white bg-opacity-15 rounded border-none py-2 px-4 text-white focus:outline-none text-sm resize-none" required />
                    </div>
                    <div className='mb-4'>
                        <p className=' text-white font-medium'>Imagen</p>
                        <label htmlFor="file" className="mb-2 text-sm font-medium text-white flex items-end gap-4">
                            <div className="text-white py-2 ps-4 pe-5 bg-white bg-opacity-15 hover:bg-opacity-25 transition rounded-md mt-2 flex gap-3 items-center w-fit cursor-pointer">
                                <IoIosAdd className=" scale-125" />
                                <p>
                                    Agrega imagen
                                </p>
                            </div>
                            <p className=' mb-1 text-md'>
                                {file?.name}
                            </p>
                        </label>
                        <input id="file" type="file" accept="image/*, video/*, application/pdf" onChange={(e: any) => setFile(e?.target?.files[0])} className='text-white hidden' />
                    </div>
                    <div>
                        <p className=' text-white font-medium'>Pizarrón</p>
                        <div className='bg-white bg-opacity-80 mt-2 rounded relative mb-4'>
                            <button type='button' onClick={handleClear} className=' w-fit px-4 py-2 rounded-bl text-white absolute right-0' style={{ backgroundColor: cardColor || 'rgb(39 39 42)', filter: "brightness(0.9)" }}>Reiniciar</button>
                            <SignatureCanvas
                                penColor={penColor || 'black'}
                                canvasProps={{
                                    className: 'sigCanvas mx-auto rouded',
                                    height: '200px',
                                    width: '450px',
                                }}
                                //@ts-ignore
                                ref={sigPad}
                            />
                        </div>
                        <div className=' bg-[#00000040] bg-opacity-40 p-4 justify-center flex' style={{ boxShadow: "-4rem 0 0 #00000040, 4rem 0 0 #00000040" }}>
                            <div className=' mx-auto flex flex-col gap-3 text-white text-center'>
                                Color de la pluma
                                <CompactPicker onChange={handlePenChange} />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex justify-between'>
                        <div>
                            <p className=' text-white font-medium'>Color de la tarjeta</p>
                            <div className='mt-2 rounded relative'>
                                <TwitterPicker onChange={onChange} />
                            </div>
                        </div>
                        {/*<div>
                            <p className=' text-white font-medium'>Text color</p>
                            <div className='mt-2 rounded relative'>
                                <TwitterPicker />
                            </div>
                        </div>*/}
                    </div>

                    <button type="submit" className="text-white mt-4 bg-white bg-opacity-15  hover:bg-opacity-25 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm w-full p-2 text-center transition">Subir</button>
                </form>
            </SimpleModal>
            <Snackbar
                open={openSnackbar}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#00d084"
                    }
                }}
                autoHideDuration={20000}
                onClose={handleCloseSnackbar}
                message="Tarjeta creada!"
            />
        </>
    )
}

export default SharedSpace