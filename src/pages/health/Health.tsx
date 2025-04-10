import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router'

export const Health = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Button onClick={() => navigate(-1)}>Volver</Button>
            <p>Salud</p>
        </div>
    )
}
