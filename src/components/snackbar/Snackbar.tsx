import { Check, X } from "lucide-react";
import { FC } from "react"

export interface SnackbarProps {
    success: boolean;
    message: string;
    Icon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

export const Snackbar: FC<SnackbarProps> = ({ success, message, Icon, className }) => {
    return (
        <div className={`animationOpacity flex items-center justify-center gap-3 ${!className ? (success ? 'bg-green-600' : 'bg-red-600') : className} text-white font-semibold text-lg rounded-lg px-6 py-2`}>
            {Icon ?
                <Icon />
                :
                <span>{success ? <Check className="text-xl font-bold" /> : <X className="text-xl font-bold" />}</span>
            }
            <span>{message}</span>
        </div>
    )
}
