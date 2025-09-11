import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

/* ---------------------- sample products ---------------------- */
const PRODUCTS = [
  { id: 1, title: "Luxury Car Wrap", type: "car", brand: "BMW", price: 5000, beforeAfter: ["https://tse1.mm.bing.net/th/id/OIP.eAqRXrk3Mn1I7HqPg6CYxgHaE8?pid=Api&P=0&h=220","https://tse2.mm.bing.net/th/id/OIP.K0-sXQF2pGiUkdi8iTFzyAHaEK?pid=Api&P=0&h=220"], description: "Full body wrap for a BMW X5, matte black finish.", review: "Amazing transformation! Highly recommended." },
  { id: 2, title: "Custom Bike Paint", type: "bike", brand: "Yamaha", price: 2000, beforeAfter: ["https://tse3.mm.bing.net/th/id/OIP.dE0QEYQwjfOWtRw6VKMpFgHaHa?pid=Api&P=0&h=220","https://blog.gaadikey.com/wp-content/uploads/2015/04/Yamaha-Saluto-Image-2-1024x767.jpg"], description: "Custom flame paint job for Yamaha R15.", review: "The bike looks stunning! Perfect work." },
  { id: 3, title: "Audi S7 Wrap", type: "car", brand: "Audi", price: 6000, beforeAfter: ["https://tse1.mm.bing.net/th/id/OIP.pupPrmnCGTbx-m95MigTVQHaHa?pid=Api&P=0&h=220","https://arizonaautowraps.com/wp-content/uploads/2023/07/audi-before-color-change.jpg"], description: "Matte silver wrap for Audi S7.", review: "Perfect finish and high quality material." },
  { id: 4, title: "KTM Bike Custom Wrap", type: "bike", brand: "KTM", price: 2200, beforeAfter: ["https://static.wixstatic.com/media/ab0c4b_0ea1af43bd47448e9b94b8294dcb1c35~mv2_d_1800_1200_s_2.png","https://preview.redd.it/its-been-374-days-since-i-first-posted-my-bike-this-is-the-v0-tt53e7uhp46b1.jpg?width=1080&crop=smart&auto=webp&s=a54a97991703304271d6959a69bad3b8b96f1e26"], description: "Custom graphic wrap for KTM Duke.", review: "Perfect execution, highly satisfied." },
  { id: 5, title: "Honda Bike Custom Paint", type: "bike", brand: "Honda", price: 1800, beforeAfter: ["https://www.cbrxx.com/attachments/rc30_rhf_1024-jpg.29656/","https://tse3.mm.bing.net/th/id/OIP.UHj8iISynoWViX5oYsC4sQHaFR?pid=Api&P=0&h=220"], description: "Custom red and black paint job for Honda CBR.", clientReview: "Looks amazing, very happy with the work!" },
  { id: 6, title: "Lamborghini Aventador Wrap", type: "car", brand: "Lamborghini", price: 15000, beforeAfter: ["https://tse4.mm.bing.net/th/id/OIP.xWafDIjvqXs47E8mi8dBGQHaE8?pid=Api&P=0&h=220","https://tse2.mm.bing.net/th/id/OIP.BQxXtLW-0gaV2Z3C-151GgHaFM?pid=Api&P=0&h=220"], description: "Matte orange wrap for Lamborghini Aventador.", clientReview: "Absolutely stunning transformation." },
  { id: 7, title: "KTM Bike Custom Wrap", type: "bike", brand: "KTM", price: 2200, beforeAfter: ["https://static.wixstatic.com/media/ab0c4b_0ea1af43bd47448e9b94b8294dcb1c35~mv2_d_1800_1200_s_2.png","https://preview.redd.it/its-been-374-days-since-i-first-posted-my-bike-this-is-the-v0-tt53e7uhp46b1.jpg?width=1080&crop=smart&auto=webp&s=a54a97991703304271d6959a69bad3b8b96f1e26"], description: "Custom graphic wrap for KTM Duke.", clientReview: "Perfect execution, highly satisfied." },
  { id: 8, title: "Porsche 911 Full Wrap", type: "car", brand: "Porsche", price: 12000, beforeAfter: ["https://kistudios.com/wp-content/uploads/2023/05/MASQUERADE-Porsche-992-GT3-Cup-racing-livery-wrap-kit-Main.jpg","https://tse3.mm.bing.net/th/id/OIP.kPuwMstoZNDvtd1yzPm3jQHaEo?pid=Api&P=0&h=220"], description: "Full satin white wrap for Porsche 911.", clientReview: "Amazing work, looks brand new!" }
];

/* ---------------------- localStorage helpers ---------------------- */
const readLS = (key, fallback) => {
  try { const val = localStorage.getItem(key); return val ? JSON.parse(val) : fallback; } 
  catch { return fallback; }
};
const writeLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

/* ---------------------- main component ---------------------- */
export default function PortfolioAllInOne() {
  const [users, setUsers] = useState(() => readLS("users", []));
  const [currentUser, setCurrentUser] = useState(() => readLS("currentUser", null));
  const [cart, setCart] = useState(() => readLS("cart", []));
  const [wishlist, setWishlist] = useState(() => readLS("wishlist", []));
  const [orders, setOrders] = useState(() => readLS("orders", []));
  const [reviews, setReviews] = useState(() => readLS("reviews", []));
  const [searchTerm, setSearchTerm] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [productModal, setProductModal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [orderForm, setOrderForm] = useState({ name: "", email: "", address: "", payment: "COD" });
  const [reviewForm, setReviewForm] = useState({ 
    productId: "", 
    rating: 5, 
    comment: "", 
    beforeImage: null, 
    afterImage: null,
    beforeImagePreview: "",
    afterImagePreview: ""
  });

  useEffect(() => writeLS("users", users), [users]);
  useEffect(() => writeLS("currentUser", currentUser), [currentUser]);
  useEffect(() => writeLS("cart", cart), [cart]);
  useEffect(() => writeLS("wishlist", wishlist), [wishlist]);
  useEffect(() => writeLS("orders", orders), [orders]);
  useEffect(() => writeLS("reviews", reviews), [reviews]);

  // Filter products based on search term
  const filteredProducts = PRODUCTS.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user orders
  const userOrders = currentUser 
    ? orders.filter(order => order.buyerEmail === currentUser.email) 
    : [];

  // Get reviews for a specific product
  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === productId);
  };

  /* ---------------------- auth ---------------------- */
  const signup = () => {
    const { name, email, password } = authForm;
    if (!name || !email || !password) return alert("Fill all signup fields");
    if (users.find((u) => u.email === email)) return alert("User exists");
    const newUser = { name, email, password, role: "user" };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setAuthForm({ name: "", email: "", password: "" });
    setShowSignupModal(false);
  };

  const login = () => {
    const { email, password } = authForm;
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return alert("Invalid credentials");
    setCurrentUser(found);
    setShowLoginModal(false);
    setAuthForm({ name: "", email: "", password: "" });
  };

  const logout = () => { setCurrentUser(null); alert("Logged out"); };

  /* ---------------------- reviews ---------------------- */
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'before') {
        setReviewForm({
          ...reviewForm, 
          beforeImage: file,
          beforeImagePreview: reader.result
        });
      } else {
        setReviewForm({
          ...reviewForm, 
          afterImage: file,
          afterImagePreview: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const submitReview = () => {
    if (!reviewForm.productId || !reviewForm.comment) {
      return alert("Please select a product and write a review");
    }
    
    if (!currentUser) {
      alert("Please login to submit a review");
      setAuthMode("login");
      setShowLoginModal(true);
      return;
    }
    
    // In a real app, you would upload the images to a server
    // For this demo, we'll store them as data URLs (not recommended for production)
    const newReview = {
      id: Date.now(),
      productId: reviewForm.productId,
      userId: currentUser.email,
      userName: currentUser.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      beforeImage: reviewForm.beforeImagePreview,
      afterImage: reviewForm.afterImagePreview,
      date: new Date().toLocaleString(),
      status: "approved" // Auto-approve for client reviews
    };
    
    setReviews([...reviews, newReview]);
    setReviewForm({ 
      productId: "", 
      rating: 5, 
      comment: "", 
      beforeImage: null, 
      afterImage: null,
      beforeImagePreview: "",
      afterImagePreview: ""
    });
    setShowAddReviewModal(false);
    alert("Review submitted successfully!");
  };

  /* ---------------------- cart/wishlist/order ---------------------- */
  const requireAuthOrOpenLogin = () => {
    if (!currentUser) { setAuthMode("login"); setShowLoginModal(true); return false; }
    return true;
  };

  const addToCart = (product) => {
    if (!requireAuthOrOpenLogin()) return;
    if (cart.find(c => c.id === product.id)) return alert("Already in cart");
    setCart([...cart, product]);
  };
  const removeFromCart = (productId) => setConfirmDialog({ message: "Remove from cart?", onConfirm: () => { setCart(cart.filter(p => p.id !== productId)); setConfirmDialog(null); }});
  const addToWishlist = (product) => { if (!requireAuthOrOpenLogin()) return; if (wishlist.find(w => w.id === product.id)) return alert("Already in wishlist"); setWishlist([...wishlist, product]); };
  const removeFromWishlist = (productId) => setConfirmDialog({ message: "Remove from wishlist?", onConfirm: () => { setWishlist(wishlist.filter(p => p.id !== productId)); setConfirmDialog(null); }});

  const openBuy = (product) => {
    if (!requireAuthOrOpenLogin()) return;
    setOrderProduct(product);
    setOrderForm(prev => ({ ...prev, name: currentUser?.name || prev.name, email: currentUser?.email || prev.email, payment: "COD" }));
    setShowOrderModal(true);
  };

  const placeOrder = () => {
    if (!orderProduct) return;
    const { name, email, address, payment } = orderForm;
    if (!name || !email || !address) return alert("Fill name, email & address");
    const newOrder = { 
      id: Date.now(), 
      productId: orderProduct.id, 
      title: orderProduct.title, 
      price: orderProduct.price, 
      buyerName: name, 
      buyerEmail: email, 
      address, 
      payment, 
      date: new Date().toLocaleString(),
      image: orderProduct.beforeAfter?.[0] || "https://via.placeholder.com/220",
      status: "Confirmed"
    };
    setOrders([...orders, newOrder]);
    setCart(cart.filter(p => p.id !== orderProduct.id));
    setShowOrderModal(false);
    setOrderProduct(null);
    setOrderForm({ name: "", email: "", address: "", payment: "COD" });
    alert("Order placed successfully");
  };

  const cancelOrder = (orderId) => {
    setConfirmDialog({ 
      message: "Cancel this order?", 
      onConfirm: () => { 
        setOrders(orders.map(order => 
          order.id === orderId ? {...order, status: "Cancelled"} : order
        )); 
        setConfirmDialog(null); 
      }
    });
  };

  const getSimilar = (prod) => PRODUCTS.filter(p => p.id !== prod.id && (p.type === prod.type || p.brand === prod.brand));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* header */}
      <header className="bg-gradient-to-r from-gray-900 to-black text-white p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Benzamods</h1>
            <div className="text-sm text-gray-300">Cars, Bikes & Accessories</div>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-auto flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {!currentUser && (
              <div className="hidden md:flex gap-2 items-center bg-white/10 px-3 py-2 rounded">
                <button onClick={() => { setAuthMode("login"); setShowLoginModal(true); }} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 transition">Login</button>
                <button onClick={() => { setAuthMode("signup"); setShowSignupModal(true); }} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition">Signup</button>
              </div>
            )}

            <>
              <button onClick={() => setShowWishlistModal(true)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition flex items-center gap-1">
                <span>Wishlist</span>
                <span className="bg-red-600 px-2 py-0.5 rounded-full text-xs">{wishlist.length}</span>
              </button>
              <button onClick={() => setShowCartModal(true)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition flex items-center gap-1">
                <span>Cart</span>
                <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs">{cart.length}</span>
              </button>
              <button onClick={() => setShowReviewsModal(true)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition flex items-center gap-1">
                <span>Reviews</span>
              </button>
              {currentUser && (
                <>
                  <button onClick={() => setShowOrdersModal(true)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition flex items-center gap-1">
                    <span>Orders</span>
                    <span className="bg-purple-600 px-2 py-0.5 rounded-full text-xs">{userOrders.length}</span>
                  </button>
                  <button onClick={() => setShowAddReviewModal(true)} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded transition flex items-center gap-1">
                    <span>Add Review</span>
                  </button>
                </>
              )}
            </>

            {!currentUser && (
              <button onClick={() => { setAuthMode("login"); setShowLoginModal(true); }} className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition">
                Login / Signup
              </button>
            )}

            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="text-sm">Hi, <b>{currentUser.name}</b></div>
                <button onClick={logout} className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 flex-1">
        {/* Products grid */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Portfolio</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <article key={p.id} className="bg-white rounded-2xl shadow overflow-hidden transition-transform hover:scale-105">
                  <div className="h-48 cursor-pointer" onClick={() => setProductModal(p)}>
                    <img src={p.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                    <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                      <div className="font-bold text-blue-700">{`₹${p.price.toLocaleString()}`}</div>
                      <div className="flex gap-2">
                        <button onClick={() => addToWishlist(p)} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 transition">Wishlist</button>
                        <button onClick={() => addToCart(p)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Add to Cart</button>
                        <button onClick={() => openBuy(p)} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Benzamods</h3>
            <p className="text-gray-300 mb-4">
              We specialize in premium vehicle modifications, wraps, and customizations for cars and bikes. 
              Transform your vehicle with our expert services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4"></h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition"></a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <Phone size={18} /> 
                <span>+91 8904708819</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} /> 
                <span>info@Benzamods12.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" /> 
                <span>1st cross, 2nd stage jayanagar opp to myura bakery, Bengaluru, karnataka, india</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={18} /> 
                <span>Monday - Saturday: 9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={18} /> 
                <span>Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Benzamods. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      {productModal && <ProductModal product={productModal} onClose={() => setProductModal(null)} addToCart={addToCart} addToWishlist={addToWishlist} openBuy={openBuy} getSimilar={getSimilar} setProductModal={setProductModal} reviews={getProductReviews(productModal.id)} setShowAddReviewModal={setShowAddReviewModal} setReviewForm={setReviewForm} />}
      {showCartModal && <CartModal cart={cart} onClose={() => setShowCartModal(false)} removeFromCart={removeFromCart} openBuy={openBuy} />}
      {showWishlistModal && <WishlistModal wishlist={wishlist} onClose={() => setShowWishlistModal(false)} addToCart={addToCart} removeFromWishlist={removeFromWishlist} />}
      {showOrderModal && orderProduct && <OrderModal orderProduct={orderProduct} orderForm={orderForm} setOrderForm={setOrderForm} placeOrder={placeOrder} onClose={() => { setShowOrderModal(false); setOrderProduct(null); }} />}
      {showLoginModal && <AuthModal mode="login" authForm={authForm} setAuthForm={setAuthForm} login={login} switchMode={() => { setAuthMode("signup"); setShowLoginModal(false); setShowSignupModal(true); }} onClose={() => setShowLoginModal(false)} />}
      {showSignupModal && <AuthModal mode="signup" authForm={authForm} setAuthForm={setAuthForm} signup={signup} switchMode={() => { setAuthMode("login"); setShowSignupModal(false); setShowLoginModal(true); }} onClose={() => setShowSignupModal(false)} />}
      {showOrdersModal && <OrdersModal orders={userOrders} onClose={() => setShowOrdersModal(false)} cancelOrder={cancelOrder} />}
      {showReviewsModal && <ReviewsModal reviews={reviews} products={PRODUCTS} onClose={() => setShowReviewsModal(false)} />}
      {showAddReviewModal && <AddReviewModal reviewForm={reviewForm} setReviewForm={setReviewForm} handleImageUpload={handleImageUpload} submitReview={submitReview} onClose={() => setShowAddReviewModal(false)} products={PRODUCTS} />}
      {confirmDialog && <ConfirmDialog message={confirmDialog.message} onConfirm={confirmDialog.onConfirm} onCancel={() => setConfirmDialog(null)} />}
    </div>
  );
}

/* ---------------------- reusable modals & components ---------------------- */
const ProductModal = ({ product, onClose, addToCart, addToWishlist, openBuy, getSimilar, setProductModal, reviews, setShowAddReviewModal, setReviewForm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-4xl p-4 max-h-[90vh] overflow-y-auto">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {product.beforeAfter?.map((img, i) => (
            <img key={i} src={img} alt={`${product.title} ${i === 0 ? 'Before' : 'After'}`} className="w-full rounded-lg object-cover shadow-md" />
          ))}
        </div>
        <div>
          <p className="mb-4 text-gray-700">{product.description}</p>
          <div className="font-bold text-xl mb-4 text-blue-700">₹{product.price.toLocaleString()}</div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => addToCart(product)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add to Cart</button>
            <button onClick={() => addToWishlist(product)} className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition">Wishlist</button>
            <button onClick={() => openBuy(product)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Buy Now</button>
            <button onClick={() => { 
              setShowAddReviewModal(true); 
              setReviewForm(prev => ({ ...prev, productId: product.id })); 
            }} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Add Review</button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="italic text-gray-700">"{product.review || product.clientReview || 'No review available'}"</p>
          </div>
        </div>
      </div>

      {/* Client Reviews Section */}
      <div className="mt-8">
        <h3 className="font-bold text-xl mb-4">Client Reviews</h3>
        {reviews && reviews.filter(r => r.status === "approved").length > 0 ? (
          <div className="space-y-4">
            {reviews.filter(r => r.status === "approved").map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{review.userName}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3">{review.comment}</p>
                {review.beforeImage && review.afterImage && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Before</p>
                      <img src={review.beforeImage} alt="Before" className="w-full h-40 object-cover rounded" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">After</p>
                      <img src={review.afterImage} alt="After" className="w-full h-40 object-cover rounded" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {getSimilar(product).length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-3 text-xl">Similar Products</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {getSimilar(product).map(p => (
              <div key={p.id} className="flex flex-col items-center min-w-[140px] cursor-pointer" onClick={() => setProductModal(p)}>
                <img 
                  src={p.beforeAfter?.[0] || "https://via.placeholder.com/220"} 
                  alt={p.title} 
                  className="w-32 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition" 
                />
                <span className="text-sm mt-2 text-center font-medium">{p.title}</span>
                <span className="text-xs text-blue-600 font-bold">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const CartModal = ({ cart, onClose, removeFromCart, openBuy }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(c => (
            <div key={c.id} className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-3 gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={c.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={c.title} className="w-20 h-16 object-cover rounded" />
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-gray-600">₹{c.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { openBuy(c); onClose(); }} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition">Checkout</button>
                <button onClick={() => removeFromCart(c.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <div className="font-bold text-lg">
              Total: ₹{cart.reduce((total, item) => total + item.price, 0).toLocaleString()}
            </div>
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const WishlistModal = ({ wishlist, onClose, addToCart, removeFromWishlist }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your wishlist is empty</p>
          <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map(w => (
            <div key={w.id} className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-3 gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={w.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={w.title} className="w-20 h-16 object-cover rounded" />
                <div>
                  <div className="font-medium">{w.title}</div>
                  <div className="text-sm text-gray-600">₹{w.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToCart(w)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">Add to Cart</button>
                <button onClick={() => removeFromWishlist(w.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const OrdersModal = ({ orders, onClose, cancelOrder }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-3xl p-4 max-h-[90vh] overflow-y-auto">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven't placed any orders yet</p>
          <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <img src={order.image} alt={order.title} className="w-16 h-12 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{order.title}</div>
                  <div className="text-sm text-gray-600">₹{order.price.toLocaleString()}</div>
                  <div className={`text-sm font-semibold ${order.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {order.status}
                  </div>
                </div>
                {order.status === 'Confirmed' && (
                  <button onClick={() => cancelOrder(order.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 transition">Cancel</button>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <div>Ordered on: {order.date}</div>
                <div>Payment: {order.payment}</div>
                <div>Address: {order.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ReviewsModal = ({ reviews, products, onClose }) => {
  const approvedReviews = reviews.filter(review => review.status === "approved");
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-4xl p-4 max-h-[90vh] overflow-y-auto">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Client Reviews</h2>
      
      {approvedReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvedReviews.map(review => {
            const product = products.find(p => p.id == review.productId);
            return (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{product?.title || "Unknown Product"}</h3>
                    <div className="flex items-center mt-1">
                      <span className="font-medium mr-2">{review.userName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                
                <p className="mb-4">{review.comment}</p>
                
                {review.beforeImage && review.afterImage && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Before</p>
                      <img src={review.beforeImage} alt="Before" className="w-full h-48 object-cover rounded" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">After</p>
                      <img src={review.afterImage} alt="After" className="w-full h-48 object-cover rounded" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
  );
};

const AddReviewModal = ({ reviewForm, setReviewForm, handleImageUpload, submitReview, onClose, products }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md p-6">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Add Your Review</h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Product</label>
          <select 
            value={reviewForm.productId} 
            onChange={e => setReviewForm({...reviewForm, productId: e.target.value})}
            className="border p-2 rounded w-full"
          >
            <option value="">Choose a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                type="button"
                onClick={() => setReviewForm({...reviewForm, rating: star})}
                className="text-2xl focus:outline-none"
              >
                {star <= reviewForm.rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Your Review</label>
          <textarea 
            value={reviewForm.comment} 
            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
            className="border p-2 rounded w-full"
            rows="4"
            placeholder="Share your experience with this product..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Before Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => handleImageUpload(e, 'before')}
              className="border p-2 rounded w-full"
            />
            {reviewForm.beforeImagePreview && (
              <img src={reviewForm.beforeImagePreview} alt="Before preview" className="mt-2 w-full h-32 object-cover rounded" />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">After Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => handleImageUpload(e, 'after')}
              className="border p-2 rounded w-full"
            />
            {reviewForm.afterImagePreview && (
              <img src={reviewForm.afterImagePreview} alt="After preview" className="mt-2 w-full h-32 object-cover rounded" />
            )}
          </div>
        </div>
        
        <button 
          onClick={submitReview}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
);

const OrderModal = ({ orderProduct, orderForm, setOrderForm, placeOrder, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-2xl w-full max-w-md p-4">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">Order: {orderProduct.title}</h2>
      <div className="flex flex-col gap-3">
        <input type="text" placeholder="Name" value={orderForm.name} onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded w-full"/>
        <input type="email" placeholder="Email" value={orderForm.email} onChange={e => setOrderForm(f => ({ ...f, email: e.target.value }))} className="border p-2 rounded w-full"/>
        <textarea placeholder="Address" value={orderForm.address} onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))} className="border p-2 rounded w-full" rows="3"/>
        <div className="border p-2 rounded w-full bg-gray-100">
          Payment Method: COD (Cash on Delivery)
        </div>
        <div className="font-bold text-lg mt-2">Total: ₹{orderProduct.price.toLocaleString()}</div>
        <button onClick={placeOrder} className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition">Place Order</button>
      </div>
    </div>
  </div>
);

const AuthModal = ({ mode, authForm, setAuthForm, login, signup, switchMode, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md p-6">
      <button className="float-right text-red-500 text-xl font-bold" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4">{mode === "login" ? "Login" : "Signup"}</h2>
      <div className="flex flex-col gap-3">
        {mode === "signup" && <input placeholder="Name" value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} className="border p-2 rounded"/>}
        <input placeholder="Email" type="email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} className="border p-2 rounded"/>
        <input placeholder="Password" type="password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} className="border p-2 rounded"/>
        <button onClick={mode === "login" ? login : signup} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{mode === "login" ? "Login" : "Signup"}</button>
        <p className="text-sm text-gray-600 text-center">Or <span className="text-blue-600 cursor-pointer hover:underline" onClick={switchMode}>{mode === "login" ? "Signup" : "Login"}</span></p>
      </div>
    </div>
  </div>
);

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-4 w-full max-w-sm text-center">
      <p className="mb-4">{message}</p>
      <div className="flex justify-center gap-4">
        <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Yes</button>
        <button onClick={onCancel} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">No</button>
      </div>
    </div>
  </div>
);