import React from 'react';
import { useParams } from 'react-router-dom';

const Product: React.FC = () => {
    const {id} = useParams();

    return <div>Product #{id}'s Detail Page</div>
}

export default Product;