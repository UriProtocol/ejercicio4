import React from 'react'
import { FiUser } from "react-icons/fi";
import { useAuthStore } from '../store/authStore';
import { Menu, MenuItem } from '@mui/material';

export default function Topbar() {

    const { username } = useAuthStore()
    const logout = useAuthStore(state => state.logout);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        handleClose()
        logout();
    };

    return (
        <nav className="py-3 z-50 ml-auto w-[calc(100%-16rem)]  bg-[#0A0A0A] bg-opacity-80 shadow-md">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <a className="flex ms-2 md:me-24 items-center gap-3">
                            <span className="self-center text-lg whitespace-nowrap dark:text-white ml-2">Murales</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3 flex-col">
                            <div className="flex justify-between gap-3 text-white mr-2.5">
                                {username}
                                <button type="button" onClick={handleClick} className="flex border-[1px] border-zinc-100 border-opacity-40 rounded p-1 hover:bg-zinc-100 hover:bg-opacity-5 transition-all" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                    <span className="sr-only">Open user menu</span>
                                    <FiUser className="w-4 h-4 text-zinc-200" />
                                </button>
                            </div>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}

                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                sx={{
                                    "& .MuiPaper-root": {
                                        marginTop: "0.5rem",
                                        backgroundColor:  'rgb(0,0,0,0.5)',
                                        "& .MuiButtonBase-root": {
                                            fontSize: "0.8rem !important",
                                            color: "white",
                                        }
                                    }
                                }}
                            >
                                <MenuItem className=' text-sm' onClick={handleLogout}>Cerrar sesión</MenuItem>
                            </Menu>
                            {/*<div className={`z-50 ${isDropdownOpen ? 'flex absolute mt-10 mr-1' : 'hidden'} my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-zinc-700 dark:divide-zinc-600 w-24`} id="dropdown-user">
                                <ul className="py-1" role="none">
                                    <li>
                                        <button onClick={handleLogout} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-600 dark:hover:text-white">Log out</button>
                                    </li>
                                </ul>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
