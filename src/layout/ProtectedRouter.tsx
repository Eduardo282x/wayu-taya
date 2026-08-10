import { validateToken } from '@/hooks/authtenticate';
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router';

export const ProtectedRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getTokenDecode = validateToken();
        if (!getTokenDecode || getTokenDecode.expired) {
            navigate('/login')
        }
    }, [location])

    return <Outlet />
}
