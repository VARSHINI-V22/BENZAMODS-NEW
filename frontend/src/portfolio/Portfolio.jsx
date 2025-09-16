import React, { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Search, ShoppingCart, Heart, Star, User, LogOut, Package, MessageSquare, Plus } from "lucide-react";

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

/* ---------------------- static reviews ---------------------- */
const STATIC_REVIEWS = [
  { 
    id: 101, 
    productId: 1, 
    userId: "varshini22@gmail.com", 
    userName: "varshini", 
    rating: 5, 
    comment: "The BMW wrap exceeded my expectations! The matte black finish looks absolutely stunning and the attention to detail is impressive. Highly recommend Benzamods!", 
    beforeImage: "https://1stimpressions.com/images/beforeandafter/lg/bmw-after-front-lg.jpg", 
    afterImage: "https://cdn.bmwblog.com/wp-content/uploads/2023/06/BMW-M3-Touring-by-Manhart-2.jpg",
    date: "2023-05-15 10:30:00",
    status: "approved" 
  },
  { 
    id: 102, 
    productId: 2, 
    userId: "ashwini11@gmail.com", 
    userName: "ashwini" ,
    rating: 4, 
    comment: "My Yamaha R15 looks completely transformed with the custom flame paint job. The team was professional and delivered on time. Very satisfied with the result!", 
    beforeImage: "https://tse4.mm.bing.net/th/id/OIP.KGOktW949F0opXRkS-KVmQHaEK?pid=Api&P=0&h=220", 
    afterImage: "https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/02/a117.jpeg",
    date: "2023-06-20 14:45:00",
    status: "approved" 
  },
  { 
    id: 103, 
    productId: 3, 
    userId: "varshini22@gmail.com", 
    userName: "varshini", 
    rating: 5, 
    comment: "The matte silver wrap on my Audi S7 is flawless. The quality of material used is top-notch and the installation was perfect. Worth every penny!", 
    beforeImage: "https://hips.hearstapps.com/hmg-prod/images/2020-audi-s7-sportback-prestige-158-hdr-1586778460.jpg?crop=0.622xw:0.466xh;0.322xw,0.524xh&resize=1200:*", 
    afterImage: "https://bringatrailer.com/wp-content/uploads/2023/11/2018_audi_s7_2018_audi_s7_7726b815-35da-4530-bef7-7089c0b24f77-ZxssRy-79166-79169-scaled.jpg",
    date: "2023-07-10 09:15:00",
    status: "approved" 
  },
  { 
    id: 104, 
    productId: 6, 
    userId: "ashwini11@gmail.com", 
    userName: "ashwini", 
    rating: 5, 
    comment: "My Lamborghini Aventador in matte orange turns heads everywhere I go! The team at Benzamods are true artists. Exceptional service and quality!", 
    beforeImage: "https://cdni.autocarindia.com/ExtraImages/20221110112028_lambo.jpg", 
    afterImage: "https://cdn.hiconsumption.com/wp-content/uploads/2021/09/Sian.jpg",
    date: "2023-08-05 16:20:00",
    status: "approved" 
  }
];

/* ---------------------- localStorage helpers ---------------------- */
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';
const readLS = (key, fallback) => {
  if (!isBrowser) return fallback;
  try { 
    const val = localStorage.getItem(key); 
    return val ? JSON.parse(val) : fallback; 
  } 
  catch { 
    return fallback; 
  }
};
const writeLS = (key, value) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
};

/* ---------------------- main component ---------------------- */
export default function PortfolioAllInOne() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(STATIC_REVIEWS); // Initialize with static reviews
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
  
  // Initialize state from localStorage only on the client side
  useEffect(() => {
    if (isBrowser) {
      setUsers(readLS("users", []));
      setCurrentUser(readLS("currentUser", null));
      setCart(readLS("cart", []));
      setWishlist(readLS("wishlist", []));
      setOrders(readLS("orders", []));
      
      // Initialize reviews with static reviews if none exist in localStorage
      const storedReviews = readLS("reviews", []);
      if (storedReviews.length > 0) {
        setReviews(storedReviews);
      } else {
        // Save static reviews to localStorage if none exist
        setReviews(STATIC_REVIEWS);
        writeLS("reviews", STATIC_REVIEWS);
      }
    }
  }, []);
  
  // Update localStorage when state changes
  useEffect(() => {
    if (isBrowser && users.length > 0) {
      writeLS("users", users);
    }
  }, [users]);
  
  useEffect(() => {
    if (isBrowser && currentUser) {
      writeLS("currentUser", currentUser);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (isBrowser && cart.length > 0) {
      writeLS("cart", cart);
    }
  }, [cart]);
  
  useEffect(() => {
    if (isBrowser && wishlist.length > 0) {
      writeLS("wishlist", wishlist);
    }
  }, [wishlist]);
  
  useEffect(() => {
    if (isBrowser && orders.length > 0) {
      writeLS("orders", orders);
    }
  }, [orders]);
  
  useEffect(() => {
    if (isBrowser && reviews.length > 0) {
      writeLS("reviews", reviews);
    }
  }, [reviews]);
  
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
    const newUsers = [...users, newUser];
    setUsers(newUsers);
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
  
  const logout = () => { 
    setCurrentUser(null); 
    if (isBrowser) {
      localStorage.removeItem("currentUser");
    }
    alert("Logged out"); 
  };
  
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
    
    const newReviews = [...reviews, newReview];
    setReviews(newReviews);
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
    if (!currentUser) { 
      setAuthMode("login"); 
      setShowLoginModal(true); 
      return false; 
    }
    return true;
  };
  
  const addToCart = (product) => {
    if (!requireAuthOrOpenLogin()) return;
    if (cart.find(c => c.id === product.id)) return alert("Already in cart");
    const newCart = [...cart, product];
    setCart(newCart);
  };
  
  const removeFromCart = (productId) => {
    setConfirmDialog({ 
      message: "Remove from cart?", 
      onConfirm: () => { 
        const newCart = cart.filter(p => p.id !== productId);
        setCart(newCart); 
        setConfirmDialog(null); 
      }
    });
  };
  
  const addToWishlist = (product) => { 
    if (!requireAuthOrOpenLogin()) return; 
    if (wishlist.find(w => w.id === product.id)) return alert("Already in wishlist"); 
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist); 
  };
  
  const removeFromWishlist = (productId) => {
    setConfirmDialog({ 
      message: "Remove from wishlist?", 
      onConfirm: () => { 
        const newWishlist = wishlist.filter(p => p.id !== productId);
        setWishlist(newWishlist); 
        setConfirmDialog(null); 
      }
    });
  };
  
  const openBuy = (product) => {
    if (!requireAuthOrOpenLogin()) return;
    setOrderProduct(product);
    setOrderForm(prev => ({ 
      ...prev, 
      name: currentUser?.name || prev.name, 
      email: currentUser?.email || prev.email, 
      payment: "COD" 
    }));
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
    const newOrders = [...orders, newOrder];
    setOrders(newOrders);
    const newCart = cart.filter(p => p.id !== orderProduct.id);
    setCart(newCart);
    setShowOrderModal(false);
    setOrderProduct(null);
    setOrderForm({ name: "", email: "", address: "", payment: "COD" });
    alert("Order placed successfully");
  };
  
  const cancelOrder = (orderId) => {
    setConfirmDialog({ 
      message: "Cancel this order?", 
      onConfirm: () => { 
        const updatedOrders = orders.map(order => 
          order.id === orderId ? {...order, status: "Cancelled"} : order
        ); 
        setOrders(updatedOrders); 
        setConfirmDialog(null); 
      }
    });
  };
  
  const getSimilar = (prod) => PRODUCTS.filter(p => p.id !== prod.id && (p.type === prod.type || p.brand === prod.brand));
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      {/* Google Fonts import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
        `}
      </style>
      
      {/* header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Benzamods</h1>
            <div className="text-sm text-gray-400 ml-3 hidden md:block">Premium Vehicle Customization</div>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-96 flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {!currentUser && (
              <div className="hidden md:flex gap-2 items-center bg-gray-700 px-3 py-2 rounded-lg">
                <button onClick={() => { setAuthMode("login"); setShowLoginModal(true); }} className="px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm font-medium">Login</button>
                <button onClick={() => { setAuthMode("signup"); setShowSignupModal(true); }} className="px-3 py-1.5 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm font-medium">Signup</button>
              </div>
            )}
            <>
              <button onClick={() => setShowWishlistModal(true)} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm">
                <Heart size={18} />
                <span className="hidden md:inline">Wishlist</span>
                <span className="bg-pink-600 px-1.5 py-0.5 rounded-full text-xs font-bold">{wishlist.length}</span>
              </button>
              <button onClick={() => setShowCartModal(true)} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm">
                <ShoppingCart size={18} />
                <span className="hidden md:inline">Cart</span>
                <span className="bg-blue-600 px-1.5 py-0.5 rounded-full text-xs font-bold">{cart.length}</span>
              </button>
              <button onClick={() => setShowReviewsModal(true)} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm">
                <Star size={18} />
                <span className="hidden md:inline">Reviews</span>
              </button>
              {currentUser && (
                <>
                  <button onClick={() => setShowOrdersModal(true)} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm">
                    <Package size={18} />
                    <span className="hidden md:inline">Orders</span>
                    <span className="bg-purple-600 px-1.5 py-0.5 rounded-full text-xs font-bold">{userOrders.length}</span>
                  </button>
                  <button onClick={() => setShowAddReviewModal(true)} className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition flex items-center gap-1 text-sm">
                    <MessageSquare size={18} />
                    <span className="hidden md:inline">Add Review</span>
                  </button>
                </>
              )}
            </>
            {!currentUser && (
              <button onClick={() => { setAuthMode("login"); setShowLoginModal(true); }} className="bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-1">
                <User size={16} />
                <span>Login / Signup</span>
              </button>
            )}
            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="text-sm hidden md:block">Hi, <b>{currentUser.name}</b></div>
                <button onClick={logout} className="bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-1">
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 flex-1 w-full">
        {/* Products grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-blue-500 pl-3">Our Portfolio</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl">
              <p className="text-gray-400">No products found matching your search.</p>
              <button 
                onClick={() => setSearchTerm("")} 
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white font-medium"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <article key={p.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] group border border-gray-700">
                  <div className="h-48 cursor-pointer relative overflow-hidden" onClick={() => setProductModal(p)}>
                    <img src={p.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {p.type.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-blue-400 text-lg">{`₹${p.price.toLocaleString()}`}</div>
                      <div className="flex gap-2">
                        <button onClick={() => addToWishlist(p)} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition" title="Add to wishlist">
                          <Heart size={16} />
                        </button>
                        <button onClick={() => addToCart(p)} className="p-2 rounded-lg bg-gray-700 hover:bg-blue-600 transition" title="Add to cart">
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => openBuy(p)} className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-white font-medium">
                      Buy Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* Footer Section */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 px-4 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About Benzamods</h3>
            <p className="text-gray-400 mb-4">
              We specialize in premium vehicle modifications, wraps, and customizations for cars and bikes. 
              Transform your vehicle with our expert services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                {/* Social icons would go here */}
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white"></h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition"></a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition"></a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
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
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-500">
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
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4 text-white">{product.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {product.beforeAfter?.map((img, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-lg">
              <div className="text-xs uppercase font-semibold bg-gray-700 text-gray-300 px-3 py-1">
                {i === 0 ? 'Before' : 'After'}
              </div>
              <img src={img} alt={`${product.title} ${i === 0 ? 'Before' : 'After'}`} className="w-full h-64 object-cover" />
            </div>
          ))}
        </div>
        <div>
          <p className="mb-4 text-gray-300">{product.description}</p>
          <div className="font-bold text-2xl mb-4 text-blue-400">₹{product.price.toLocaleString()}</div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => addToCart(product)} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={() => addToWishlist(product)} className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition font-medium">
              <Heart size={16} /> Wishlist
            </button>
            <button onClick={() => openBuy(product)} className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium">
              Buy Now
            </button>
            <button onClick={() => { 
              setShowAddReviewModal(true); 
              setReviewForm(prev => ({ ...prev, productId: product.id })); 
            }} className="flex items-center gap-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition font-medium">
              <Star size={16} /> Add Review
            </button>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="italic text-gray-200">"{product.review || product.clientReview || 'No review available'}"</p>
          </div>
        </div>
      </div>
      
      {/* Client Reviews Section */}
      <div className="mt-8">
        <h3 className="font-bold text-xl mb-4 text-white border-b border-gray-700 pb-2">Client Reviews</h3>
        {reviews && reviews.filter(r => r.status === "approved").length > 0 ? (
          <div className="space-y-4">
            {reviews.filter(r => r.status === "approved").map(review => (
              <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">{review.userName}</div>
                  <div className="text-sm text-gray-400">{review.date}</div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-3 text-gray-300">{review.comment}</p>
                {review.beforeImage && review.afterImage && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">Before</p>
                      <img src={review.beforeImage} alt="Before" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-400">After</p>
                      <img src={review.afterImage} alt="After" className="w-full h-40 object-cover rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 bg-gray-700 rounded-lg">No reviews yet. Be the first to review!</p>
        )}
      </div>
      
      {getSimilar(product).length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold mb-4 text-xl text-white border-b border-gray-700 pb-2">Similar Products</h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {getSimilar(product).map(p => (
              <div key={p.id} className="flex flex-col items-center min-w-[180px] cursor-pointer group" onClick={() => setProductModal(p)}>
                <div className="relative overflow-hidden rounded-lg w-full h-40">
                  <img 
                    src={p.beforeAfter?.[0] || "https://via.placeholder.com/220"} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-80 transition-opacity"></div>
                </div>
                <span className="text-sm mt-2 text-center font-medium text-white">{p.title}</span>
                <span className="text-xs text-blue-400 font-bold">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const CartModal = ({ cart, onClose, removeFromCart, openBuy }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <ShoppingCart size={24} /> Your Cart
      </h2>
      {cart.length === 0 ? (
        <div className="text-center py-8 bg-gray-700 rounded-xl">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(c => (
            <div key={c.id} className="flex flex-col md:flex-row items-center justify-between border border-gray-700 rounded-lg p-4 gap-4 bg-gray-700">
              <div className="flex items-center gap-4">
                <img src={c.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={c.title} className="w-20 h-16 object-cover rounded-lg" />
                <div>
                  <div className="font-medium text-white">{c.title}</div>
                  <div className="text-sm text-gray-400">₹{c.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { openBuy(c); onClose(); }} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition font-medium">Checkout</button>
                <button onClick={() => removeFromCart(c.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition font-medium">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center border-t border-gray-700 pt-4">
            <div className="font-bold text-lg text-white">
              Total: ₹{cart.reduce((total, item) => total + item.price, 0).toLocaleString()}
            </div>
            <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition font-medium">Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const WishlistModal = ({ wishlist, onClose, addToCart, removeFromWishlist }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <Heart size={24} /> Your Wishlist
      </h2>
      {wishlist.length === 0 ? (
        <div className="text-center py-8 bg-gray-700 rounded-xl">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">Your wishlist is empty</p>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map(w => (
            <div key={w.id} className="flex flex-col md:flex-row items-center justify-between border border-gray-700 rounded-lg p-4 gap-4 bg-gray-700">
              <div className="flex items-center gap-4">
                <img src={w.beforeAfter?.[0] || "https://via.placeholder.com/220"} alt={w.title} className="w-20 h-16 object-cover rounded-lg" />
                <div>
                  <div className="font-medium text-white">{w.title}</div>
                  <div className="text-sm text-gray-400">₹{w.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToCart(w)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium">Add to Cart</button>
                <button onClick={() => removeFromWishlist(w.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition font-medium">Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-6">
            <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition font-medium">Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const OrdersModal = ({ orders, onClose, cancelOrder }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        <Package size={24} /> Your Orders
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-gray-700 rounded-xl">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">You haven't placed any orders yet</p>
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">Continue Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700">
              <div className="flex items-center gap-4 mb-3">
                <img src={order.image} alt={order.title} className="w-16 h-12 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-medium text-white">{order.title}</div>
                  <div className="text-sm text-gray-400">₹{order.price.toLocaleString()}</div>
                  <div className={`text-sm font-semibold ${order.status === 'Confirmed' ? 'text-green-400' : 'text-red-400'}`}>
                    Status: {order.status}
                  </div>
                </div>
                {order.status === 'Confirmed' && (
                  <button onClick={() => cancelOrder(order.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition font-medium">Cancel</button>
                )}
              </div>
              <div className="text-sm text-gray-400 space-y-1">
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto border border-gray-700">
        <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          <Star size={24} /> Client Reviews
        </h2>
        
        {approvedReviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-700 rounded-xl">
            <Star size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400">No reviews available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {approvedReviews.map(review => {
              const product = products.find(p => p.id == review.productId);
              return (
                <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{product?.title || "Unknown Product"}</h3>
                      <div className="flex items-center mt-1">
                        <span className="font-medium mr-2 text-gray-300">{review.userName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                  
                  <p className="mb-4 text-gray-300">{review.comment}</p>
                  
                  {review.beforeImage && review.afterImage && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1 text-gray-400">Before</p>
                        <img src={review.beforeImage} alt="Before" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1 text-gray-400">After</p>
                        <img src={review.afterImage} alt="After" className="w-full h-48 object-cover rounded-lg" />
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
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <Plus size={24} /> Add Your Review
      </h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Select Product</label>
          <select 
            value={reviewForm.productId} 
            onChange={e => setReviewForm({...reviewForm, productId: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Choose a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.title}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                type="button"
                onClick={() => setReviewForm({...reviewForm, rating: star})}
                className="text-2xl focus:outline-none text-gray-400 hover:text-yellow-400 transition"
              >
                {star <= reviewForm.rating ? 
                  <span className="text-yellow-400">★</span> : 
                  <span>☆</span>
                }
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Your Review</label>
          <textarea 
            value={reviewForm.comment} 
            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
            className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
            placeholder="Share your experience with this product..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Before Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => handleImageUpload(e, 'before')}
              className="border border-gray-600 bg-gray-700 text-white p-1.5 rounded-lg w-full text-xs"
            />
            {reviewForm.beforeImagePreview && (
              <img src={reviewForm.beforeImagePreview} alt="Before preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">After Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => handleImageUpload(e, 'after')}
              className="border border-gray-600 bg-gray-700 text-white p-1.5 rounded-lg w-full text-xs"
            />
            {reviewForm.afterImagePreview && (
              <img src={reviewForm.afterImagePreview} alt="After preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
        </div>
        
        <button 
          onClick={submitReview}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium mt-4"
        >
          Submit Review
        </button>
      </div>
    </div>
  </div>
);

const OrderModal = ({ orderProduct, orderForm, setOrderForm, placeOrder, onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4 text-white">Order: {orderProduct.title}</h2>
      <div className="flex flex-col gap-3">
        <input type="text" placeholder="Name" value={orderForm.name} onChange={e => setOrderForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        <input type="email" placeholder="Email" value={orderForm.email} onChange={e => setOrderForm(f => ({ ...f, email: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        <textarea placeholder="Address" value={orderForm.address} onChange={e => setOrderForm(f => ({ ...f, address: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="3"/>
        <div className="border border-gray-600 bg-gray-700 p-2.5 rounded-lg w-full text-gray-300">
          Payment Method: COD (Cash on Delivery)
        </div>
        <div className="font-bold text-lg mt-2 text-white">Total: ₹{orderProduct.price.toLocaleString()}</div>
        <button onClick={placeOrder} className="bg-green-600 text-white px-4 py-2.5 rounded-lg mt-2 hover:bg-green-700 transition font-medium">Place Order</button>
      </div>
    </div>
  </div>
);

const AuthModal = ({ mode, authForm, setAuthForm, login, signup, switchMode, onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 border border-gray-700">
      <button className="float-right text-gray-400 hover:text-white text-xl font-bold transition" onClick={onClose}>✕</button>
      <h2 className="text-2xl font-bold mb-4 text-white">{mode === "login" ? "Login" : "Signup"}</h2>
      <div className="flex flex-col gap-3">
        {mode === "signup" && <input placeholder="Name" value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"/>}
        <input placeholder="Email" type="email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        <input placeholder="Password" type="password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} className="border border-gray-600 bg-gray-700 text-white p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        <button onClick={mode === "login" ? login : signup} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">{mode === "login" ? "Login" : "Signup"}</button>
        <p className="text-sm text-gray-400 text-center">Or <span className="text-blue-400 cursor-pointer hover:underline" onClick={switchMode}>{mode === "login" ? "Signup" : "Login"}</span></p>
      </div>
    </div>
  </div>
);

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-center border border-gray-700">
      <p className="mb-4 text-white">{message}</p>
      <div className="flex justify-center gap-4">
        <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">Yes</button>
        <button onClick={onCancel} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium">No</button>
      </div>
    </div>
  </div>
);