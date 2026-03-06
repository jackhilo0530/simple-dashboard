import { useState } from "react";
import "../index.css"

interface SelectProps {
    options: string[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    placeholder = "Select an option",
    onChange,
    className = "",
    defaultValue = "",

}) => {
    // Manage the selected value
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        onChange(value); // Trigger parent handler
    };

    return (
        <select
            className={`h-11 w-52 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10  ${selectedValue
                    ? "text-gray-800"
                    : "text-gray-400"
                } ${className}`}
            value={selectedValue}
            onChange={handleChange}
        >
            {/* Placeholder option */}
            <option
                value=""
                disabled
                className="text-gray-700"
            >
                {placeholder}
            </option>
            {/* Map over options */}
            {options.map((option, index) => (
                <option
                    key={index}
                    value={option}
                    className="text-gray-700"
                >
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Select;
