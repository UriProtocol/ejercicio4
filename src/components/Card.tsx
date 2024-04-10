import axios from 'axios';
import FileComponent from './FileComponent';
import { useEffect, useState } from 'react';
import { Menu, MenuItem, Snackbar, Tooltip } from '@mui/material';
import { SlOptions } from "react-icons/sl"
//import { Tooltip } from 'flowbite' 


export default function Card({ detail, deleteCard, canDelete = true }: { detail: any, deleteCard: () => void, canDelete: boolean }) {
    const [fileUrl, setFileUrl] = useState('')

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openSnackbar, setOpenSnackbar] = useState(false)

    function handleCloseSnackbar(){
        setOpenSnackbar(false)
    }


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        setOpenSnackbar(true)
        deleteCard(detail.id)
        handleClose()
    }


    const openFile = async (cardId: any) => {
        if (!detail.file) return
        try {
            const response = await axios.get(`http://localhost:5000/api/card/${cardId}/file`, {
                responseType: 'blob', // Important to get the file as a Blob
                // headers: { "token": token }
            });

            const contentType = response.headers['content-type'];

            const file = new Blob([response.data], { type: contentType });
            const fileURL = URL.createObjectURL(file);
            setFileUrl(fileURL)
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    //const copyLinkToClipboard = async (cardId: any) => {
    //  try {
    //    const url = `http://localhost:5173/card/${cardId}/share`;
    //    await navigator.clipboard.writeText(url);
    //    setIsCopied(true);
    //    setTimeout(() => {
    //      setIsCopied(false);
    //    }, 800);
    //  } catch (error) {
    //    console.error('Error copying link to clipboard:', error);
    //  }
    //};

    useEffect(() => {
        openFile(detail.id)
    }, [])

    const bgColor = detail.cardColor

    return (
        <div style={{ backgroundColor: bgColor ? bgColor : "rgb(63 63 70)", filter: "brightness(1.2)" }} className={`max-w-lg p-6 rounded mt-5 relative h-64 overflow-y-auto shadow card group transition hover:translate-y-1`}>
            {canDelete ? (
                <>
                    <Tooltip title='options' arrow placement="top">
                        <div className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white hover:bg-opacity-30 transition absolute right-3 top-3 cursor-pointer" onClick={handleClick}>
                            <SlOptions className=" text-white opacity-90" />
                        </div>
                    </Tooltip>
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
                                marginLeft: "-2.5rem",
                                backgroundColor: bgColor ? bgColor : "rgb(63 63 70)",
                                filter: "grayscale(0.3)",
                                "& .MuiButtonBase-root": {
                                    fontSize: "0.8rem !important",
                                    color: "white",
                                }
                            }
                        }}
                    >
                        <MenuItem className=' text-sm' onClick={handleDelete}>Eliminar</MenuItem>
                        {/*<MenuItem className=' text-sm' onClick={handleClose}>Cambiar color</MenuItem>*/}
                    </Menu>
                </>
            ) : null}
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{detail.title}</h5>
            <p className="mb-3 font-normal text-white">{detail.description}</p>
            <FileComponent doc={fileUrl} />
            {
                detail.canvasImg ? (
                    <div className='bg-white bg-opacity-80 w-full h-300 rounded mt-8'>
                        <img src={detail.canvasImg} className='shadow' />
                    </div>
                ) : null
            }
            {/*<Snackbar
                open={openSnackbar}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#b70f3b"
                    }
                }}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                message="Tarjeta eliminada!"
            />*/}
        </div>
    )
}
