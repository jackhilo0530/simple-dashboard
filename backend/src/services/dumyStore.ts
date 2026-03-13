const BASE_URL = process.env.BASE || "https://dummyjson.com";

export type DummyProduct = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

export async function fetchProducts(skip: number, limit: number, search: string, sortBy: string, order: string, filter: string) {

    if (filter == "") {
        const res = await fetch(`${BASE_URL}/products/search?q=${search}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&order=${order}&select=title,description,price,category,images`);
        if (!res.ok) throw new Error("failed to fetch products");
        return (await res.json());
    } else {
        let res_final;
        let res_final_page;
        const res = await fetch(`${BASE_URL}/products/category/${filter}?&select=title,description,price,category,images`);
        if (!res.ok) throw new Error("failed to fetch products");
        if (search !== "") {
            const res_search = await fetch(`${BASE_URL}/products/search?q=${search}&sortBy=${sortBy}&order=${order}&select=title,description,price,category,images`);
            if (!res.ok) throw new Error("failed to fetch products");
            res_final = (await res_search.json()).products.filter((product: DummyProduct) => product.category === filter);
            res_final_page = res_final.slice(skip, Math.min((skip + limit + 1), res_final.length));
            return { products: res_final_page, total: res_final.length };
        }
        res_final = await res.json();
        res_final_page = res_final.products.slice(skip, Math.min((skip + limit), res_final.total));
        
        return { products: res_final_page, total: res_final.total };
    }
}

export async function fetchProduct(id: number) {
    const res = await fetch(`${BASE_URL}/products/${id}?select=title,description,price,category,images`);
    if (!res.ok) throw new Error("failed to fetch product");
    return (await res.json());
}

export async function fetchCategory() {
    const res = await fetch(`${BASE_URL}/products/category-list`);
    if (!res.ok) throw new Error("failed to fetch categories");
    return (await res.json());
}