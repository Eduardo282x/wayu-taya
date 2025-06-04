import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router'

export const Documents = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Button onClick={() => navigate(-1)}>Volver</Button>
            <p>Documents</p>
        </div>
    )
}
