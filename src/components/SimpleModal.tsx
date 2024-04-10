import { IoIosClose } from "react-icons/io";
import { useAuthStore } from "../store/authStore";

const SimpleModal = ({ isOpen, onClose, isCard, children }: { isOpen: any, onClose: any, isCard: boolean, children: any}) => {
    if (!isOpen) return null;

    const {cardColor} = useAuthStore()

    const {bgColor} = useAuthStore()

    const backgroundColor = isCard ? cardColor ? cardColor : 'rgb(39 39 42)' : bgColor ? bgColor : 'rgb(39 39 42)'

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className=" bg-black opacity-50 fixed h-screen w-screen" onClick={onClose}/>
            <div className="bg-zinc-800 pe-1 py-2 rounded-lg w-5/12 z-10 shadow" style={{backgroundColor}}>
                <div className=" w-full max-h-[80vh] overflow-y-auto p-5">
                    <button onClick={onClose} className="float-right font-bold text-white">
                        <IoIosClose className=" text-xl scale-150"/>
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SimpleModal;
