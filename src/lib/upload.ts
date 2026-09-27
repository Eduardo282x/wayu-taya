/**
 * Validacion de archivos SUBIDOS, replicando los limites del backend
 * (`src/documents/documents.controller.ts`: `ALLOWED_MIME`, `ALLOWED_EXT` y
 * `MAX_UPLOAD_BYTES`).
 *
 * El backend ya rechaza lo no permitido, pero solo despues de subir el archivo
 * entero por la red. Aqui se corta antes, que es la diferencia entre un error
 * instantaneo y un timeout.
 *
 * IMPORTANTE: no se manda ni se muestra ninguna RUTA del servidor. El
 * `filePath` lo compone la API; el cliente solo manda el binario.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * El backend valida el MIME, no solo la extension. Se replican AMBAS listas:
 * validar solo la extension dejaria pasar un `.exe` renombrado a `.pdf`, que
 * el `fileFilter` del servidor rechazaria igual.
 */
export const ALLOWED_MIME = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const ALLOWED_EXTENSIONS = new Set([
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".doc",
    ".docx",
    ".xlsx",
]);

/** `.PDF` y `.pdf` valen igual. */
export const getFileExtension = (fileName: string): string => {
    const dot = fileName.lastIndexOf(".");
    return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
};

export const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Devuelve el mensaje de error, o `null` si el archivo es valido. Se valida
 * primero el TAMANO (mas barato) y despues tipo y extension.
 */
export const validateUploadFile = (file: File): string | null => {
    if (file.size === 0) {
        return "El archivo está vacío.";
    }

    if (file.size > MAX_UPLOAD_BYTES) {
        return `El archivo supera el máximo de ${formatBytes(MAX_UPLOAD_BYTES)} (tiene ${formatBytes(file.size)}).`;
    }

    const extension = getFileExtension(file.name);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
        const allowed = [...ALLOWED_EXTENSIONS].join(", ");
        return `Extensión no permitida: "${extension || "sin extensión"}". Se aceptan: ${allowed}.`;
    }

    // `file.type` lo declara el navegador, no es una garantia. Aun asi es lo
    // mismo que comprueba Multer en el servidor, asi que avisar aqui produce
    // exactamente el mismo veredicto que daria la API.
    if (!ALLOWED_MIME.has(file.type)) {
        return `Tipo de archivo no permitido: "${file.type || "desconocido"}".`;
    }

    return null;
};
