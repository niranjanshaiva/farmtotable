import { useEffect, useState } from 'react';

export default function FarmerDashboard() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [products, setProducts] = useState([]);

  // Get email from sessionStorage
  useEffect(() => {
    const userEmail = sessionStorage.getItem('email');
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  // Fetch products after email is set
  useEffect(() => {
    if (email) {
      fetchProducts();
    }
  }, [email]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products/list');
    const data = await res.json();
    const farmerProducts = data.filter((p: any) => p.email === email);
    setProducts(farmerProducts);
  };

  const handleUpload = async () => {
    if (!name || !price || !quantity || !email || !image) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('email', email);
    formData.append('image', image);

    try {
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Upload successful');
        setName('');
        setPrice('');
        setQuantity('');
        setImage(null);
        fetchProducts();
      } else {
        alert('❌ Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Upload failed. Try again.');
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        background: '#f5fff5',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '30px',
          color: '#2e7d32',
        }}
      >
        FARM TO TABLE
      </h1>

      <h2
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'black',
        }}
      >
        Upload Your Product
      </h2>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '25px',
          borderRadius: '10px',
          maxWidth: '500px',
          margin: '0 auto',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0])}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
          }}
        >
          Upload
        </button>
      </div>

      <h3
        style={{
          marginTop: '40px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'black',
        }}
      >
        My Uploaded Products
      </h3>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {products.map((p: any, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '10px',
              width: '200px',
              backgroundColor: '#ffffff',
              textAlign: 'center',
            }}
          >
            <img
              src={`/uploads/${p.image}`}
              alt={p.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <h4 style={{ fontWeight: 600, marginTop: '10px', color: 'black' }}>{p.name}</h4>
            <p style={{ color: 'black' }}>Price: ₹{p.price}</p>
            <p style={{ color: 'black' }}>Qty: {p.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
