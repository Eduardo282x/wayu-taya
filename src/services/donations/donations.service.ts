import { getDataApi, getDataFileApi, postDataApi } from "../api";
import { DonationBody } from "./donations.interface";

const donationsUrl = "/donations";

export const getDonations = async () => {
    return await getDataApi(donationsUrl);
}

export const getLotes = async () => {
    return await getDataApi(`${donationsUrl}/lotes`);
}

export const getDonationsReport = async (id: number) => {
    return await getDataFileApi(`${donationsUrl}/download/${id}`);
}

export const postDonation = async (data: DonationBody) => {
    return await postDataApi(donationsUrl, data)
}