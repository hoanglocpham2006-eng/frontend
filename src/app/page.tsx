
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm');
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch {
        setError('Không thể kết nối API. Hãy kiểm tra backend.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#6f422b' }}>BrewLite ☕</h1>

      <p>Thưởng thức đồ uống yêu thích của bạn.</p>

      <h2>Menu đồ uống</h2>

      {loading && <p>Đang tải menu...</p>}

      {!loading && error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p>Hiện chưa có sản phẩm nào.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              style={{
                color: 'inherit',
                textDecoration: 'none',
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '16px',
                display: 'block',
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />

              <h3>{product.name}</h3>

              <p
                style={{
                  color: '#8b5e3c',
                  fontWeight: 'bold',
                }}
              >
                {Number(product.price).toLocaleString('vi-VN')} đ
              </p>

              <p style={{ color: '#6f422b' }}>
                Xem chi tiết →
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
