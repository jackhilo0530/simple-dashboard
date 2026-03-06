const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const signupApi = async (username: string, email: string, password: string, role: string, img?: File) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (img) {
        formData.append("img", img);
    }

    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(body.message || "failed to fetch signup");
    }

    return body;
};

export const signinApi = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(body.message || "failed to fetch signin");
    }


    return body;

}