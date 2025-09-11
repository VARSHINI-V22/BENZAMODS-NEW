import React, { useState } from "react";

const ProductPage = ({ product }) => {
  const defaultProduct = {
    id: 1,
    title: "Carbon Fiber Car Wrap",
    description: "High-quality carbon fiber wrap for your vehicle. Durable and weather-resistant.",
    price: 4999,
    compatibility: ["Car", "Bike", "SUV"],
    images: [
      "/images/product1.jpg",
      "/images/product2.jpg",
      "/images/product3.jpg",
    ],
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const prod = product || defaultProduct;

  const handleAddToCart = () => {
    setCart((prev) => [...prev, { ...prod, quantity: 1 }]);
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    setCart((prev) => [...prev, { ...prod, quantity: 1 }]);
    alert("Proceeding to payment...");
  };

  const handleAddToWishlist = () => {
    if (!wishlist.find((item) => item.id === prod.id)) {
      setWishlist((prev) => [...prev, prod]);
      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Gallery */}
      <div style={styles.gallerySection}>
        <img src={prod.images[currentImage]} alt={prod.title} style={styles.mainImage} />
        <div style={styles.thumbnailWrapper}>
          {prod.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              style={{
                ...styles.thumbnail,
                border: currentImage === idx ? "2px solid #ff6b6b" : "1px solid #ccc",
              }}
              onClick={() => setCurrentImage(idx)}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div style={styles.detailsSection}>
        <h1 style={styles.title}>{prod.title}</h1>
        <p style={styles.price}>₹{prod.price}</p>
        <p style={styles.description}>{prod.description}</p>

        <div style={styles.compatibility}>
          <strong>Vehicle Compatibility:</strong>
          <ul>
            {prod.compatibility.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={styles.buttons}>
          <button style={styles.cartButton} onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button style={styles.buyButton} onClick={handleBuyNow}>
            Buy Now
          </button>
          <button style={styles.wishlistButton} onClick={handleAddToWishlist}>
            Add to Wishlist
          </button>
        </div>

        <div style={styles.summary}>
          <p>Cart Items: <strong>{cart.length}</strong></p>
          <p>Wishlist Items: <strong>{wishlist.length}</strong></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    maxWidth: "1200px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  gallerySection: { flex: 1, minWidth: "300px" },
  mainImage: { width: "100%", height: "400px", objectFit: "cover", borderRadius: "12px" },
  thumbnailWrapper: { display: "flex", gap: "10px", marginTop: "10px" },
  thumbnail: { width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" },
  detailsSection: { flex: 1, minWidth: "300px" },
  title: { fontSize: "28px", fontWeight: "700", marginBottom: "10px" },
  price: { fontSize: "22px", fontWeight: "600", color: "#ff6b6b", marginBottom: "15px" },
  description: { fontSize: "16px", marginBottom: "15px" },
  compatibility: { marginBottom: "20px" },
  buttons: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" },
  cartButton: { padding: "12px 20px", backgroundColor: "#ff6b6b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  buyButton: { padding: "12px 20px", backgroundColor: "#1dd1a1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  wishlistButton: { padding: "12px 20px", backgroundColor: "#576574", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  summary: { marginTop: "20px", fontSize: "16px" },
};

export default ProductPage;
