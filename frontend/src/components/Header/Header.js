import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import classes from './header.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className={classes.header}>
      <nav>
          <Link to="/" className={classes.logo}>
            <img src="/icons/logo.png" alt="logo" />
          </Link>
          <ul>
            <li>
              <Link to="/">
                Home
              </Link>
            </li>
            <li>
              <Link to="/news">
                News
              </Link>
            </li>
            <li>
              <Link to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <ul>
            {user ? (
              <li className={classes.submenu_container}>
                <Link to="/dashboard">{user.name}</Link>
                <div className={classes.submenu}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              </li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}

            <li>
              <Link to="/cart">
                <i className='fa-solid fa-cart-shopping'></i>
                {cart.totalCount > 0 && (
                  <span className={classes.cart_count}>{cart.totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
    </header>
  );
}