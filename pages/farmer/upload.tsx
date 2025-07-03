import { useState } from 'react';

export default function UploadProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!name || !price || !quantity || !image) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('email', sessionStorage.getItem('email') || '');
    formData.append('image', image);

    const res = await fetch('/api/products/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    alert(result.message);

    // Clear form
    setName('');
    setPrice('');
    setQuantity('');
    setImage(null);
    (document.getElementById('image') as HTMLInputElement).value = '';
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto', background: '#e6f5e6', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Upload Product</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Name:</label><br />
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Price (₹):</label><br />
        <input value={price} onChange={e => setPrice(e.target.value)} type="number" style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Quantity:</label><br />
        <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Image:</label><br />
        <input id="image" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
      </div>
      <button onClick={handleUpload} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', width: '100%', fontWeight: 'bold' }}>
        Upload
      </button>
    </div>
  );
}
