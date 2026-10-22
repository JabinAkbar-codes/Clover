import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiChevronDown, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import "../styles/Navbar.css";
import logo from "../assets/logo.svg";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navRef = useRef(null);
  const { count: cartCount, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
    );
  }, []);

  const closeMenus = () => {
    setShopOpen(false);
    setCollectionsOpen(false);
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link-custom ${isActive ? "active" : ""}`;

  return (
    <motion.header
      ref={navRef}
      className="site-header"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-wrap">
        <div className="navbar-inner">
          <Link to="/" className="brand-link" onClick={closeMenus}>
            <img src={logo} alt="CLOVER logo" className="brand-logo" />
            <span className="brand-name">CLOVER</span>
          </Link>

          <button
            className={`burger-btn ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`main-nav ${mobileOpen ? "show" : ""}`}>
            <ul className="nav-list">
              <li>
                <NavLink to="/" className={navLinkClass} onClick={closeMenus}>
                  HOME
                </NavLink>
              </li>

              <li className={`dropdown-item-wrap ${shopOpen ? "open" : ""}`}>
                <button
                  className="nav-link-custom dropdown-toggle-btn"
                  onClick={() => {
                    setCollectionsOpen(false);
                    setShopOpen((v) => !v);
                  }}
                >
                  SHOP <FiChevronDown className="chev" />
                </button>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.ul
                      className="dropdown-menu-custom"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                    >
                      <li>
                        <NavLink to="/shop/necklaces" onClick={closeMenus}>
                          Necklaces
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/shop/bracelets" onClick={closeMenus}>
                          Bracelets
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/shop/earrings" onClick={closeMenus}>
                          Earrings
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/shop/rings" onClick={closeMenus}>
                          Rings
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/shop/anklets" onClick={closeMenus}>
                          Anklets
                        </NavLink>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <NavLink
                  to="/shop/charms"
                  className={navLinkClass}
                  onClick={closeMenus}
                >
                  CHARMS
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/personalize"
                  className={navLinkClass}
                  onClick={closeMenus}
                >
                  PERSONALIZE
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/sale"
                  className={navLinkClass}
                  onClick={closeMenus}
                >
                  SALE
                </NavLink>
              </li>

              <li>
                <Link
                  to="/about"
                  className="nav-link-custom"
                  onClick={closeMenus}
                >
                  ABOUT
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="nav-link-custom"
                  onClick={closeMenus}
                >
                  CONTACT
                </Link>
              </li>

              <li
                className={`dropdown-item-wrap ${collectionsOpen ? "open" : ""}`}
              >
                <button
                  className="nav-link-custom dropdown-toggle-btn"
                  onClick={() => {
                    setShopOpen(false);
                    setCollectionsOpen((v) => !v);
                  }}
                >
                  COLLECTIONS <FiChevronDown className="chev" />
                </button>

                <AnimatePresence>
                  {collectionsOpen && (
                    <motion.ul
                      className="dropdown-menu-custom"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.18 }}
                    >
                      <li>
                        <NavLink
                          to="/collections/sweet-valentina-collection"
                          onClick={closeMenus}
                        >
                          Sweet Valentina Collection
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/collections/autumn-collection"
                          onClick={closeMenus}
                        >
                          Autumn Collection
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/collections/sun-kissed-ibiza-collection"
                          onClick={closeMenus}
                        >
                          Sun Kissed Ibiza Collection
                        </NavLink>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <div className="dropdown-item-wrap account-wrap">
              <button
                className="icon-btn"
                aria-label="Account"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <FiUser />
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.ul
                    className="dropdown-menu-custom account-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <li className="account-greeting">Hi, {user?.username}</li>
                        <li>
                          <button
                            className="account-logout-btn"
                            onClick={() => {
                              logout();
                              setAccountOpen(false);
                            }}
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/login" onClick={() => setAccountOpen(false)}>Login</Link></li>
                        <li><Link to="/register" onClick={() => setAccountOpen(false)}>Create Account</Link></li>
                      </>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" onClick={closeMenus}>
              <FiHeart />
              {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
            </Link>
            <button className="icon-btn bag-btn" aria-label="Bag" onClick={openDrawer}>
              <FiShoppingBag />

              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
