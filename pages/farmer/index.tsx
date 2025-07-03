import { useState } from 'react';

export default function FarmerPage() {
  const [product, setProduct] = useState({ name: '', price: '', quantity: '', email: '', image: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct({ ...product, image: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const email = sessionStorage.getItem('email');
    const res = await fetch('/api/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, email })
    });

    const result = await res.json();
    alert(result.message);
    setProduct({ name: '', price: '', quantity: '', email: '', image: '' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Product</h2>
      <input type="text" name="name" placeholder="Product name" value={product.name} onChange={handleChange} /><br /><br />
      <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} /><br /><br />
      <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} /><br /><br />
      <input type="file" accept="image/*" onChange={handleImage} /><br /><br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
