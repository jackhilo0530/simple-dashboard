import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { signupApi } from "../services/authService";
import { EyeIcon, Check } from "lucide-react";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
});

type FormData = z.infer<typeof signupSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [apiErrors, setApiErrors] = useState("");
    const navigate = useNavigate();

    const validateForm = (data: FormData, field?: keyof FormData): FormErrors => {
        try{
            signupSchema.parse(data);
            return field ? {[field]: []} : {};
        }catch (error) {
            if(error instanceof z.ZodError) {
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

            const name = formData.firstName + formData.lastName;
            const email = formData.email;
            const password = formData.password;

            await signupApi(name, email, password);

            navigate("/auth/signin");
        } catch(err) {
            if(err instanceof Error) {
                setApiErrors(err.message)
            }else setApiErrors("Unknown error occured");
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;
        const updatedFormData = { ...formData, [name]: value};
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
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-1">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Firtst Name
                                    <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <input type="text" value={formData.firstName} onChange={handleChange} required name="firstName" id="firstName" placeholder="Enter your first name" className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20" />
                                    {errors.firstName && <span>{errors.firstName}</span>}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Last Name
                                    <span className="text-error-500">*</span>
                                </label>
                                <div className="relative">
                                    <input type="text" value={formData.lastName} onChange={handleChange} required name="lastName" id="lastName" placeholder="Enter your last name" className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20" />
                                    {errors.lastName && <span>{errors.lastName}</span>}
                                </div>
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
                        <div className="flex items-center gap-3">
                            <label className="flex items-center space-x-3 group cursor-pointer">
                                <div className="relative w-5 h-5">
                                    <input type="checkbox" className="w-5 h-5 appearance-none cursor-pointer border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"></input>
                                    <Check size={14} color="white" className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2" />
                                </div>
                            </label>
                            <p className="inline-block font-normal text-gray-500">
                                By creating an account means you agree to the
                                <span className="text-gray-800">Terms and Conditions,</span>
                                and our
                                <span className="text-gray-800">Privacy Policy</span>
                            </p>
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