const BASE_URL = process.env.BASE || "https://dummyjson.com";

export type DummyProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

export async function fetchProducts(skip: number, limit: number, search: string) {
    const res = await fetch(`${BASE_URL}/products/search?q=${search}&skip=${skip}&limit=${limit}&select=title,description,price,category,images`);
    if (!res.ok) throw new Error("failed to fetch products");
    return (await res.json());
}

export async function fetchProduct(id: number) {
    const res = await fetch(`${BASE_URL}/products/${id}?select=title,description,price,category,images`);
    if (!res.ok) throw new Error("failed to fetch product");
    return (await res.json());
}