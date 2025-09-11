import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

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

// HomePage component to avoid code duplication
const HomePage = () => (
  <>
    <SEO 
      title="Premium Vehicle Customization Services | Benzamods"
      description="Expert car and bike wrapping, vinyl graphics, and complete vehicle modification services. Perfect for car & bike owners, dealerships, resellers, and workshop garages."
      keywords="car wrap services, bike modification, vehicle graphics, automotive customization, car vinyl wrap, bike styling, car owners, bike owners, car enthusiasts, bike enthusiasts, vehicle tuners, car tuning, bike tuning, hobbyist mods, dealerships, resellers, auto dealers, car dealerships, bike dealerships, garages, workshop owners, auto workshops"
    />

    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen relative">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Scroll Down Arrow to Explore Section */}
      <a href="#explore">
        <div className="animate-bounce absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-4xl cursor-pointer z-20">
          ▼
        </div>
      </a>

      {/* Explore / Quick Navigation */}
      <section id="explore" className="py-12 px-6 md:px-12 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Our Vehicles
        </h2>
        <QuickNavigation />
        <Explore />
      </section>

      {/* Client Reviews / Carousel */}
      <section className="py-12 px-6 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Clients
        </h2>
        <ClientCarousel />
      </section>

      {/* Contact Form */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <ContactAdmin />
      </section>

      {/* Location / Map */}
      <section className="py-12 px-6 md:px-12 bg-gray-50">
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
            description="Transform your vehicle with premium car & bike wrapping, customization, and modification services. Trusted by owners, dealerships, and garages."
            keywords="car wrapping, bike customization, vehicle modification, vinyl wrap, car owners, bike owners, car enthusiasts, bike enthusiasts, tuners, hobbyists, dealerships, resellers, garages, workshop owners"
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

            {/* Services Page - Only accessible via navigation */}
            <Route 
              path="/services" 
              element={
                <>
                  <SEO 
                    title="Premium Vehicle Services | Benzamods"
                    description="Explore our premium car and bike modification services including wrapping, detailing, and performance upgrades. Professional services for owners, dealerships, and garages."
                    keywords="car services, bike services, vehicle wrapping, detailing, performance upgrades, car owners, bike owners, dealerships, garages, workshops"
                  />
                  <FeaturedServices />
                </>
              } 
            />

            {/* Portfolio Page - Only accessible via navigation */}
            <Route 
              path="/portfolio" 
              element={
                <>
                  <SEO 
                    title="Our Vehicle Customization Portfolio | Before & After Gallery | Benzamods"
                    description="Browse our stunning car and bike transformation portfolio. See before/after examples of wrapping, customization, and modification. Trusted by owners, enthusiasts, dealerships, and garages."
                    keywords="car wrap portfolio, bike modification examples, vehicle transformation gallery, before after car wrap, car owners, bike owners, car enthusiasts, bike enthusiasts, vehicle tuners, hobbyist vehicle mods, dealerships, auto resellers, garages, auto workshops"
                  />
                  <Portfolio />
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
                    description="Explore our premium products and services for cars and bikes. Quality materials and expert installation. Serving owners, enthusiasts, dealerships, and garages."
                    keywords="car wrap products, bike modification materials, vinyl wrap brands, vehicle customization services, car owners, bike owners, car enthusiasts, bike enthusiasts, car tuners, bike tuners, dealerships, resellers, garages, workshops"
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
                    description="Get in touch with Benzamods for premium car and bike customization. Consultation available for owners, enthusiasts, dealerships, and garages."
                    keywords="contact car wrap experts, bike modification consultation, vehicle customization quote, dealership inquiry, car owners, bike owners, dealerships, garages, workshops"
                  />
                  <ContactAdmin />
                </>
              } 
            />

            {/* Contact Admin */}
            <Route 
              path="/contact-admin" 
              element={
                <>
                  <SEO 
                    title="Contact Admin | Benzamods"
                    description="Contact the admin team at Benzamods for inquiries about services, partnerships, dealerships, and workshop collaborations."
                    keywords="contact admin, business inquiry, partnership opportunities, dealership services, workshop collaborations, garages, resellers"
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

            {/* Explore Pages */}
            <Route path="/explore" element={<Explore />} />
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