import { jcn } from "../libs/client/utils"

interface ButtonProps {
    large?: boolean;
    text: string;
    onClick?: () => void
    [key: string]: any;
}

export default function Button({
    large = false,
    onClick,
    text,
    ...rest
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={jcn("w-full px-4 rounded-md shadow-sm font-medium  border border-transparent bg-orange-500 hover:bg-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500", large ? "py-3 text-base" : "py-2 text-sm")}
        >
            {text}
        </button>
    )
}