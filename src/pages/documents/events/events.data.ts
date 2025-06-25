export interface NewEvents {
    mes: string;
    fecha: string;
    dia: string;
    nombre: string;
    hora: string;
}

export const eventos: NewEvents[] = [
    {
        mes: 'Feb',
        fecha: '03',
        dia: 'Sab',
        nombre: 'Gala Benéfica',
        hora: '8:00am a 11:00am'
    },
    {
        mes: 'Feb',
        fecha: '14',
        dia: 'Lun',
        nombre: 'Donaciones',
        hora: '8:00am a 11:00am'
    },
    {
        mes: 'Feb',
        fecha: '21',
        dia: 'Jue',
        nombre: 'Comunidad',
        hora: '8:00am a 11:00am'
    },
    {
        mes: 'Feb',
        fecha: '23',
        dia: 'Sab',
        nombre: 'Actividades',
        hora: '8:00am a 11:00am'
    },
    {
        mes: 'Feb',
        fecha: '25',
        dia: 'Sab',
        nombre: 'Salud',
        hora: '8:00am a 11:00am'
    },
    {
        mes: 'Feb',
        fecha: '27',
        dia: 'Dom',
        nombre: 'Donaciones',
        hora: '8:00am a 11:00am'
    },
]

export const formatTimeToAMPM = (time: string): string => {
    if (!time) return ""

    const getTime: string = time.split("T")[1];

    const [hours, minutes] = getTime.split(":").map(Number)
    const period = hours >= 12 ? "pm" : "am"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

    return `${displayHours}:${minutes.toString().padStart(2, "0")}${period}`
}

export const formatTimeRange = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return ""

    const formattedStart = formatTimeToAMPM(startTime)
    const formattedEnd = formatTimeToAMPM(endTime)

    return `${formattedStart} a ${formattedEnd}`
}