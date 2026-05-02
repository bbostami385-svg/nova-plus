import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/marketplace/products`, {
          params: { category: filter !== 'all' ? filter : undefined },
        });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  if (loading) {
    return <div className="loading">Loading marketplace...</div>;
  }

  return (
    <div className="marketplace">
      <div className="container">
        <h2>Marketplace</h2>

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'music' ? 'active' : ''}`}
            onClick={() => setFilter('music')}
          >
            Music
          </button>
          <button
            className={`filter-btn ${filter === 'art' ? 'active' : ''}`}
            onClick={() => setFilter('art')}
          >
            Art
          </button>
          <button
            className={`filter-btn ${filter === 'other' ? 'active' : ''}`}
            onClick={() => setFilter('other')}
          >
            Other
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="price">${product.price}</p>
              <p className="seller">by {product.seller?.username}</p>
              <button className="button button-primary">View Details</button>
            </div>
          ))}
        </div>

        {products.length === 0 && <p>No products found</p>}
      </div>
    </div>
  );
}

export default Marketplace;
