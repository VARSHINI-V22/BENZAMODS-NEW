import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";


// Check if user is logged in
const isAuthenticated = () => !!localStorage.getItem("token");

// Lazy load components
const Signup = lazy(() => import("./components/pages/Signup"));
const Login = lazy(() => import("./components/pages/Login"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const Explore = lazy(() => import("./pages/Explore"));
const SubCategory = lazy(() => import("./pages/SubCategory"));
const CategoryDetail = lazy(() => import("./pages/CategoryDetail")); 
const HeroBanner = lazy(() => import("./components/HeroBanner"));
const QuickNavigation = lazy(() => import("./components/QuickNavigation"));
const FeaturedServices = lazy(() => import("./components/FeaturedServices"));
const ClientCarousel = lazy(() => import("./components/ClientCarousel"));
const Footer = lazy(() => import("./components/Footer"));
const Access = lazy(() => import("./components/Shared/Access"));
const MyMap = lazy(() => import("./MyMap"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ContactAdmin = lazy(() => import("./components/ContactAdmin"));
const ProductGallery = lazy(() => import("./components/ProductGallery"));
const Portfolio = lazy(() => import("./portfolio/Portfolio"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));
const SEO = lazy(() => import("./components/SEO"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// HomePage component with simplified HeroBanner
const HomePage = () => (
  <>
    <SEO 
      title="Premium Vehicle Customization Services | Benzamods"
      description="Expert car and bike wrapping, vinyl graphics, and complete vehicle modification services."
      keywords="car wrap services, bike modification, vehicle graphics, automotive customization"
    />

    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Client Reviews / Carousel */}
      <section className="py-12 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Clients
        </h2>
        <ClientCarousel />
      </section>

      {/* Location / Map */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Our Location</h2>
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <MyMap />
        </div>
      </section>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <WhatsAppButton
          phone="9189047008819"
          message="Hi Benzamods, I'd like to inquire about vehicle mods."
        />
      </div>

      {/* Footer & Access */}
      <Footer />
      <Access />
    </div>
  </>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>

          {/* Global SEO */}
          <SEO 
            title="Benzamods - Premium Car & Bike Customization"
            description="Transform your vehicle with premium car & bike wrapping, customization, and modification services."
            keywords="car wrapping, bike customization, vehicle modification, vinyl wrap"
          />

          <Routes>
            {/* Default route → Hero Banner first */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Auth routes */}
            <Route
              path="/login"
              element={isAuthenticated() ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated() ? <Navigate to="/home" /> : <Signup />}
            />

            {/* Public Home with HeroBanner */}
            <Route path="/home" element={<HomePage />} />

            {/* Services Page */}
            <Route 
              path="/services" 
              element={
                <>
                  <SEO 
                    title="Premium Vehicle Services | Benzamods"
                    description="Explore our premium car and bike modification services including wrapping, detailing, and performance upgrades."
                    keywords="car services, bike services, vehicle wrapping, detailing, performance upgrades"
                  />
                  <FeaturedServices />
                </>
              } 
            />

            {/* Portfolio Page */}
            <Route 
              path="/portfolio" 
              element={
                <>
                  <SEO 
                    title="Our Vehicle Customization Portfolio | Benzamods"
                    description="Browse our stunning car and bike transformation portfolio."
                    keywords="car wrap portfolio, bike modification examples, vehicle transformation gallery"
                  />
                  <Portfolio />
                </>
              } 
            />

            {/* Explore Page - Now as a separate page */}
            <Route 
              path="/explore" 
              element={
                <>
                  <SEO 
                    title="Explore Our Vehicle Customization Services | Benzamods"
                    description="Discover our range of vehicle customization options for cars and bikes."
                    keywords="vehicle customization, car modifications, bike styling, explore services"
                  />
                  <div className="py-12 px-6 md:px-12 bg-white">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                      Explore Our Vehicles
                    </h2>
                    <QuickNavigation />
                    <Explore />
                  </div>
                </>
              } 
            />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminPanel />} />

            {/* Product Gallery */}
            <Route 
              path="/product/:id" 
              element={
                <>
                  <SEO 
                    title="Vehicle Customization Products & Services | Benzamods"
                    description="Explore our premium products and services for cars and bikes."
                    keywords="car wrap products, bike modification materials, vinyl wrap brands"
                  />
                  <ProductGallery />
                </>
              } 
            />

            {/* Contact Page */}
            <Route 
              path="/contact" 
              element={
                <>
                  <SEO 
                    title="Contact Benzamods | Vehicle Customization Experts"
                    description="Get in touch with Benzamods for premium car and bike customization."
                    keywords="contact car wrap experts, bike modification consultation"
                  />
                  <ContactAdmin />
                </>
              } 
            />

            {/* Dashboard (Protected) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Explore sub-routes */}
            <Route path="/explore/:type/:catId" element={<CategoryDetail />} />
            <Route path="/explore/:type" element={<SubCategory />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;