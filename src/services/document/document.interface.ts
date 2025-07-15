/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DocumentUploadFileBody {
    name: string;
    date: Date;
    type: string;
    description: string;
    content: string;
}

export interface IDocument {
    id:            number;
    name:          string;
    date:          Date;
    type:          string;
    description:   string;
    content:   string;
    filePath:      string;
    fileName:      string;
    mimeType:      string;
    deleted:       boolean;
    collaborators: any[];
}
