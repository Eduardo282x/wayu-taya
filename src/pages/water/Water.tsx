import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router'

export const Water = () => {
    const navigate = useNavigate()
    return (
        <div>
            <Button onClick={() => navigate(-1)}>Volver</Button>
            <p>Agua</p>
        </div>
    )
}
