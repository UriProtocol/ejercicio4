
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


function SideMenu({ children }: { children: any }) {
    // const [spaces, setSpaces] = useState([]);
    // const token = useAuthStore(state => state.token);
    // async function getSpaces() {
    //     try {
    //         const data = await axios.get("http://localhost:5000/api/spaces", { headers: { "token": token } });
    //         setSpaces(data.data.data);
    //     } catch (error) {
    //         console.error(error)
    //         alert({
    //             header: 'There was an error',
    //             message: 'Please try again later'
    //         })
    //         setSpaces([]);
    //     }
    // } 

    return (
        <>
            <Topbar />
            <Sidebar />
            
            <main className="pt-6 pl-72 min-h-screen">
                {children}
            </main>
        </>
    )
}

export default SideMenu