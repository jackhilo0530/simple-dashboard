import { useState } from "react";

export const useLocalStorage = (
    keyName: string,
    defaultValue: string
): [string, (value: string) => void] => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            console.log(value);

            if (value) {
                return value;
            } else {
                window.localStorage.setItem(
                    keyName,
                    defaultValue
                );
                return defaultValue;
            }
        } catch {
            return defaultValue;
        }
    });

    const setValue = (newValue: string) => {
        try {
            window.localStorage.setItem(keyName, newValue);
        } catch (err) {
            console.log(err);
        }
        setStoredValue(newValue);
    };

    console.log(storedValue);

    return [storedValue, setValue];
};