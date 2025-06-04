import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router'

export const Music = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Button onClick={() => navigate(-1)}>Volver</Button>
            <p>Musica</p>
        </div>
    )
}
