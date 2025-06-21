import { IDonations } from "@/services/donations/donations.interface"


interface DonationsFormProps {
    donation: IDonations | null
}

export const DonationsForm = ({ donation }: DonationsFormProps) => {
    console.log(donation);

    return (
        <div>DonationsForm</div>
    )
}
