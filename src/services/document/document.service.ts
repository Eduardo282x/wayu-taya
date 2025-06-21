import { getDataApi, getDataFileApi } from "../api";

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