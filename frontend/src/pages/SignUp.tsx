import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { usersApi } from "../services/authService";
import { EyeIcon } from "lucide-react";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.enum(["USER", "ADMIN"]),
    img: z.union([z.instanceof(File), z.undefined()]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
});

type FormData = z.infer<typeof signupSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        img: undefined,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [apiErrors, setApiErrors] = useState("");
    const navigate = useNavigate();

    const validateForm = (data: FormData, field?: keyof FormData): FormErrors => {
        try {
            signupSchema.parse(data);
            return field ? { [field]: [] } : {};
        } catch (error) {
            if (error instanceof z.ZodError) {
                return error.flatten().fieldErrors;
            }
            return {};
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newErrors = validateForm(formData);
            setErrors(newErrors);

            const username = formData.username;
            const email = formData.email;
            const password = formData.password;
            const role = formData.role;
            const img = formData.img;

            await usersApi.signup(username, email, password, role, img);
            navigate("/auth/signin");
        } catch (err) {
            if (err instanceof Error) {
                setApiErrors(err.message)
            } else setApiErrors("Unknown error occured");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        if (e.target instanceof HTMLInputElement && e.target.type === "file") {
            const file = e.target.files?.[0];
            const updatedFormData = { ...formData, img: file };
            setFormData(updatedFormData);
            const newErrors = validateForm(updatedFormData);
            setErrors((prev) => ({ ...prev, img: newErrors.img }));
            return;
        }
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        const newErrors = validateForm(updatedFormData);
        setErrors(newErrors);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-md">Sign Up</h1>
                <p className="text-sm text-gray-500">Enter your email and password to sign up!</p>
            </div>
            <div>
                <div className="relative py-5">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className=" text-gray-400 bg-white px-5 py-2">Or</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {apiErrors && (
                        <p className="text-red-600 text-center font-semibold">
                            {apiErrors}
                        </p>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                UserName
                                <span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input type="text" value={formData.username} onChange={handleChange} required name="username" id="username" placeholder="Enter your username" className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20" />
                                {errors.username && <span className="text-red-500">{errors.username}</span>}
                            </div>

                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Email
                                <span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input type="email" value={formData.email} onChange={handleChange} required name="email" placeholder="info@gmail.com" className="h-11 w-full rounded-lg border appearance-none 
                                        px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent
                                        text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"/>
                                {errors.email && <span>{errors.email}</span>}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Password
                                <span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <div>
                                    <input type="password" value={formData.password} onChange={handleChange} required name="password" placeholder="Enter your password" className="h-11 w-full rounded-lg border appearance-none 
                                        px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent
                                        text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"/>
                                    {errors.password && <span>{errors.password}</span>}
                                </div>
                                <span className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                    <EyeIcon size={24} color="gray" />
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                                Confirm Password
                                <span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <div>
                                    <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required name="confirmPassword" placeholder="Confirm your password" className="h-11 w-full rounded-lg border appearance-none 
                                        px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent
                                        text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20"/>
                                    {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                                </div>
                                <span className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                    <EyeIcon size={24} color="gray" />
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3    ">
                            <div className="flex items-center gap-3">
                                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Role:
                                </label>
                                <select id="role" name="role" value={formData.role} onChange={handleChange} className="h-8 rounded-lg border appearance-none px-2 py-0.5 text-xs shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20">
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="offset-1 flex items-center gap-3">
                                <label htmlFor="img" className="block w-full cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Avatar
                                </label>
                                <input type="file" id="img" onChange={handleChange} name="img" className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-100 file:text-brand-700 hover:file:bg-brand-200" />
                                {errors.img && <span>{errors.img}</span>}
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>
                <div className="mt-5">
                    <p className="text-sm font-normal text-start text-gray-700">
                        Already have an account?
                        <Link className="text-brand-500 hover:text-brand-600" data-discover="true" to="/auth/signin">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp;