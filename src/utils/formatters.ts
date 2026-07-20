
export const formatDate = (dateToFormat: string | Date | number): string => {
    const date = new Date(dateToFormat);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const isUtcLike = typeof dateToFormat === 'string' && /z$/i.test(dateToFormat);
    const day = String(isUtcLike ? date.getUTCDate() : date.getDate()).padStart(2, '0');
    const month = String(isUtcLike ? date.getUTCMonth() + 1 : date.getMonth() + 1).padStart(2, '0');
    const year = isUtcLike ? date.getUTCFullYear() : date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const formatDateForInput = (dateToFormat: string | Date | number): string => {
    const date = new Date(dateToFormat);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const isUtcLike = typeof dateToFormat === 'string' && /z$/i.test(dateToFormat);
    const year = isUtcLike ? date.getUTCFullYear() : date.getFullYear();
    const month = String(isUtcLike ? date.getUTCMonth() + 1 : date.getMonth() + 1).padStart(2, '0');
    const day = String(isUtcLike ? date.getUTCDate() : date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
];

export const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
]