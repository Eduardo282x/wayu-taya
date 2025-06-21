export interface DocumentData {
    id: number
    nombre: string
    tipo: "png" | "docx" | "pdf"
    contenido: "personas" | "comida" | "medicina"
    propietario: string
    fecha: string
    tamano: string
    descripcion?: string
}

export interface ColumnDefinition {
    column: string
    label: string
    element: (item: DocumentData) => React.ReactNode
    className: (item: DocumentData) => string;
}


export const documentosData: DocumentData[] = [
    {
        id: 1,
        nombre: "1",
        tipo: "png",
        contenido: "personas",
        propietario: "Texto",
        fecha: "8 mar 2022",
        tamano: "17 KB",
        descripcion: "Fotografía de identificación personal para documentos oficiales",
    },
    {
        id: 2,
        nombre: "documento",
        tipo: "docx",
        contenido: "medicina",
        propietario: "Texto",
        fecha: "10 mar 2022",
        tamano: "45 KB",
        descripcion: "Informe médico detallado con diagnóstico y tratamiento recomendado",
    },
    {
        id: 3,
        nombre: "reporte",
        tipo: "pdf",
        contenido: "comida",
        propietario: "Texto",
        fecha: "12 mar 2022",
        tamano: "120 KB",
        descripcion: "Manual de recetas tradicionales con ingredientes y preparación paso a paso",
    },
    {
        id: 4,
        nombre: "imagen",
        tipo: "png",
        contenido: "personas",
        propietario: "Texto",
        fecha: "15 mar 2022",
        tamano: "32 KB",
        descripcion: "Foto grupal del equipo de trabajo en evento corporativo",
    },
    {
        id: 5,
        nombre: "receta",
        tipo: "docx",
        contenido: "comida",
        propietario: "Texto",
        fecha: "18 mar 2022",
        tamano: "28 KB",
        descripcion: "Receta familiar secreta de paella valenciana con trucos de cocina",
    },
    {
        id: 6,
        nombre: "manual",
        tipo: "pdf",
        contenido: "medicina",
        propietario: "Texto",
        fecha: "20 mar 2022",
        tamano: "250 KB",
        descripcion: "Guía completa de primeros auxilios y procedimientos de emergencia",
    },
    {
        id: 7,
        nombre: "foto",
        tipo: "png",
        contenido: "personas",
        propietario: "Texto",
        fecha: "22 mar 2022",
        tamano: "64 KB",
        descripcion: "Retrato profesional para perfil de LinkedIn y redes sociales",
    },
    {
        id: 8,
        nombre: "prescripcion",
        tipo: "docx",
        contenido: "medicina",
        propietario: "Texto",
        fecha: "25 mar 2022",
        tamano: "35 KB",
        descripcion: "Prescripción médica con medicamentos y dosis específicas para tratamiento",
    }
]