import { FC } from "react";
import { useNavigate } from "react-router";

interface CardProps {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    url: string;
    className?: string;
}

export const CardComponents: FC<CardProps> = ({ text, icon: Icon, className,url }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(url)} className={`w-60 h-60 ${className ? className : 'text-white border-gray-400'} cursor-pointer font-semibold text-lg rounded-lg border-2  border-solid flex flex-col items-center justify-center`}>
            <Icon className="text-6xl"/>
            {text}
        </div>
    )
}
