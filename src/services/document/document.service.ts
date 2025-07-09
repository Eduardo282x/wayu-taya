import { deleteDataApi, getDataApi, getDataFileApi, postDataFileApi } from "../api";
// import { DocumentUploadFileBody } from "./document.interface";

const documentUrl = "/documents";

export const getDocument = async () => {
    return await getDataApi(documentUrl);
}

export const getDocumentAdult = async () => {
    return await getDataFileApi(`${documentUrl}/pdf/adulto`);
}

export const getDocumentLegalRepresentative = async () => {
    return await getDataFileApi(`${documentUrl}/pdf/representante-legal`);
}
export const downloadFile = async (id: number) => {
    return await getDataFileApi(`${documentUrl}/download/${id}`);
}
export const uploadFileDocument = async (data: FormData) => {
    return await postDataFileApi(`${documentUrl}/upload`, data);
}
export const deleteDocument = async (id: number) => {
    return await deleteDataApi(`${documentUrl}/${id}`);
}