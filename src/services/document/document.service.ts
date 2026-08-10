import { deleteDataApi, getDataApi, getDataFileApi, postDataFileApi } from "../api.service";
import { IDocument } from "./document.interface";

const documentUrl = "/documents";

export const getDocument = async (): Promise<IDocument[]> => {
    const response = await getDataApi<IDocument[]>(documentUrl);
    if (response.data == null) {
        return []
    }
    return response.data;
}

export const getDocumentAdult = () => {
    return getDataFileApi(`${documentUrl}/pdf/adulto`);
}

export const getDocumentLegalRepresentative = () => {
    return getDataFileApi(`${documentUrl}/pdf/representante-legal`);
}

export const downloadFile = (id: number) => {
    return getDataFileApi(`${documentUrl}/download/${id}`);
}

export const uploadFileDocument = (data: FormData) => {
    return postDataFileApi(`${documentUrl}/upload`, data);
}

export const deleteDocument = async (id: number): Promise<IDocument | null> => {
    const response = await deleteDataApi<IDocument>(`${documentUrl}/${id}`);
    return response.data;
}
