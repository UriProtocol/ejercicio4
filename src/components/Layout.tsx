import { Outlet } from 'react-router-dom';
import SideMenu from './SideMenu';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const {bgColor} = useAuthStore()

    return (
        <div className='h-screen overflow-y-auto' style={{backgroundColor: bgColor ? bgColor : 'rgb(39 39 42)'}}>
            <SideMenu>
                <Outlet />
            </SideMenu>
        </div>
    );
};

export default Layout;
