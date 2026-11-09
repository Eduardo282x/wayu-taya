
/**
 * Las fechas de solo calendario (`YYYY-MM-DD`) no deben pasar por `new Date`:
 * JavaScript las interpreta como medianoche UTC y, en zonas como America/Caracas
 * (UTC-4), los getters locales devuelven el día anterior.
 */
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseDateOnly = (
    value: string | Date | number,
): { year: number; month: number; day: number } | null => {
    if (typeof value !== 'string') return null;

    const match = DATE_ONLY_PATTERN.exec(value.trim());
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return { year, month, day };
};

export const formatDate = (dateToFormat: string | Date | number): string => {
    const dateOnly = parseDateOnly(dateToFormat);
    if (dateOnly) {
        return `${String(dateOnly.day).padStart(2, '0')}/${String(dateOnly.month).padStart(2, '0')}/${dateOnly.year}`;
    }

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
    const dateOnly = parseDateOnly(dateToFormat);
    if (dateOnly) {
        return `${dateOnly.year}-${String(dateOnly.month).padStart(2, '0')}-${String(dateOnly.day).padStart(2, '0')}`;
    }

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
];

