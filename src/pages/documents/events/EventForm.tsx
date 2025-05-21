import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router'

export const EventForm = () => {
    const navigate = useNavigate()
    return (
        <div>EventForm

            <Button onClick={() => navigate(-1)}>Volver</Button>

        </div>
    )
}
 //Hola 