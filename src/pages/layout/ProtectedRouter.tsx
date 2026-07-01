import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router';

export const ProtectedRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
    }, [location])

    return <Outlet />
}
