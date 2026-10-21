
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const sizes = [
  { name: 'S', extra: 0 },
  { name: 'M', extra: 5000 },
  { name: 'L', extra: 10000 },
];

const toppings = [
  { name: 'Trân châu', price: 7000 },
  { name: 'Pudding', price: 8000 },
  { name: 'Kem cheese', price: 10000 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState('S');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) {
          throw new Error('Không tải được sản phẩm');
        }

        const products: Product[] = await response.json();
        const found = products.find((item) => item.id === id);

        if (!found) {
          setError('Không tìm thấy sản phẩm.');
        } else {
          setProduct(found);
        }
      } catch {
        setError('Không thể kết nối API.');
      } finally {
        setLoading(false);
      }
    }

    if (Number.isFinite(id)) {
      loadProduct();
    } else {
      setError('Mã sản phẩm không hợp lệ.');
      setLoading(false);
    }
  }, [id]);

  function toggleTopping(name: string) {
    setSelectedToppings((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  const selectedSize = sizes.find((item) => item.name === size);
  const toppingTotal = toppings
    .filter((item) => selectedToppings.includes(item.name))
    .reduce((total, item) => total + item.price, 0);

  const totalPrice =
    (product?.price ?? 0) +
    (selectedSize?.extra ?? 0) +
    toppingTotal;

  if (loading) {
    return <main style={{ padding: 30 }}>Đang tải sản phẩm...</main>;
  }

  if (error || !product) {
    return (
      <main style={{ padding: 30 }}>
        <p>{error || 'Không tìm thấy sản phẩm.'}</p>
        <button onClick={() => router.push('/')}>Quay lại Menu</button>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 24,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <button onClick={() => router.push('/')}>← Quay lại Menu</button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28,
          marginTop: 24,
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            maxHeight: 360,
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />

        <section>
          <h1>{product.name}</h1>

          <p>
            Giá gốc:{' '}
            {product.price.toLocaleString('vi-VN')} đ
          </p>

          <h3>Chọn size</h3>

          <div style={{ display: 'flex', gap: 10 }}>
            {sizes.map((item) => (
              <button
                key={item.name}
                onClick={() => setSize(item.name)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid #6f422b',
                  background: size === item.name ? '#6f422b' : 'white',
                  color: size === item.name ? 'white' : '#333',
                  cursor: 'pointer',
                }}
              >
                {item.name}
                {item.extra > 0
                  ? ` (+${item.extra.toLocaleString('vi-VN')}đ)`
                  : ''}
              </button>
            ))}
          </div>

          <h3>Chọn topping</h3>

          {toppings.map((item) => (
            <label
              key={item.name}
              style={{
                display: 'block',
                marginBottom: 12,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={selectedToppings.includes(item.name)}
                onChange={() => toggleTopping(item.name)}
              />{' '}
              {item.name} (+{item.price.toLocaleString('vi-VN')} đ)
            </label>
          ))}

          <hr />

          <h2 style={{ color: '#8b5e3c' }}>
            Tổng tiền: {totalPrice.toLocaleString('vi-VN')} đ
          </h2>

          <button
            onClick={() =>
              alert(
                `Sản phẩm: ${product.name}\n` +
                `Size: ${size}\n` +
                `Topping: ${selectedToppings.join(', ') || 'Không có'}\n` +
                `Tổng tiền: ${totalPrice.toLocaleString('vi-VN')} đ`,
              )
            }
            style={{
              padding: 12,
              width: '100%',
              background: '#6f422b',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Xác nhận lựa chọn
          </button>
        </section>
      </div>
    </main>
  );
}
