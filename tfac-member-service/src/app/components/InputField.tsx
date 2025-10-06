import { FieldError } from 'react-hook-form'

interface Option {
    value: string
    label: string
}

interface InputFieldProps {
    name: string
    label?: string
    type?: 'text' | 'number' | 'select' | 'date'
    placeholder?: string
    value?: string | number
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
    error?: FieldError
    icon?: React.ReactNode
    disabled?: boolean
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
    required?: boolean
    options?: Option[]
    children?: React.ReactNode
}

export default function InputField({
    name,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon,
    disabled = false,
    autoComplete,
    inputMode,
    required = false,
    options,
    children,
}: InputFieldProps) {
    const baseClass = `w-full rounded-lg border shadow-sm transition
    focus:outline-none focus:ring-2 focus:ring-blue-500
    ${icon ? 'pl-11' : 'pl-4'}
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `

    return (
        <div className="flex flex-col space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-semibold text-gray-800 select-none"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}

                {type === 'select' ? (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        required={required}
                        className={`${baseClass} px-4 py-3`}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options
                            ? options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))
                            : children}
                    </select>
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        required={required}
                        className={`${baseClass} px-4 py-3`}
                    />
                )}
            </div>

            {error && (
                <p className="text-xs text-red-600 font-medium select-none">
                    {error.message}
                </p>
            )}
        </div>
    )
}
