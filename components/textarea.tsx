import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
    label?: string;
    name?: string;
    register: UseFormRegisterReturn
    [key: string]: any;
}

export default function TextArea({ label, name, register, ...rest }: TextAreaProps) {
    return (
        <div>
            {label ? (
                <label htmlFor={name} className="mb-1 block text-sm text-gray-700 font-medium">{label}</label>
            ) : null}
            <textarea id={name} rows={4} {...register} className="mt-1 w-full rounded-md shadow-sm focus:ring-orange-500 border-gray-300 focus:border-orange-500"
                {...rest}
            />
        </div>
    )
}