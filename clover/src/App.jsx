import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ScrollToTop from './components/ScrollToTop'
import BackToTop from './components/BackToTop'
import Seo from './components/Seo'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import BestSeller from './components/BestSeller'
import PersonalizePromo from './components/PersonalizePromo'
import NewArrivals from './components/NewArrivals'
import MakeYourOwnPromo from './components/MakeYourOwnPromo'
import ShopCollections from './components/ShopCollections'
import CollectionBanners from './components/CollectionBanners'
import Testimonials from './components/Testimonials'
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const SalePage = lazy(() => import('./pages/SalePage'))
const PersonalizePage = lazy(() => import('./pages/PersonalizePage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderStatus = lazy(() => import('./pages/OrderStatus'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Policy = lazy(() => import('./pages/Policy'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <TrustBar />
      <ShopCollections />
      <BestSeller />
      <PersonalizePromo />
      <NewArrivals />
      <MakeYourOwnPromo />
      <CollectionBanners />
      <Testimonials />
    </>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <motion.main key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:slug" element={<CategoryPage />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/personalize" element={<PersonalizePage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:number" element={<OrderStatus />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy/:kind" element={<Policy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.main>
      <BackToTop />
      <Footer />
    </>
  )
}
