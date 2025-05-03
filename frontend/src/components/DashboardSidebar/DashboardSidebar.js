import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import classes from './DashboardSidebar.module.css';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// Component này được sử dụng để hiển thị thanh bên trong bảng điều khiển
export default function DashboardSideBar() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className={classes.mobileToggle} onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`${classes.sidebar} ${isSidebarOpen ? classes.open : classes.closed}`}>
        {allItems
          .filter((item) => user.isAdmin || !item.forAdmin)
          .map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={classes.menuItem}
              style={{
                backgroundColor: item.bgColor,
                color: item.color,
              }}
              onClick={() => setIsSidebarOpen(false)} // Đóng sidebar khi click
            >
              <img src={item.imageUrl} alt={item.title} />
              <h2>{item.title}</h2>
            </Link>
          ))}
      </div>
    </>
  );
}

const allItems = [
  {
    title: 'Dashboard',
    imageUrl: '/icons/dashboard.svg',
    url: '/dashboard',
    forAdmin: true,
    bgColor: '#ff9800',
    color: 'white',
  },
  {
    title: 'Orders',
    imageUrl: '/icons/orders.svg',
    url: '/orders',
    bgColor: '#ec407a',
    color: 'white',
  },
  {
    title: 'Profile',
    imageUrl: '/icons/profile.svg',
    url: '/profile',
    bgColor: '#1565c0',
    color: 'white',
  },
  {
    title: 'Users',
    imageUrl: '/icons/users.svg',
    url: '/admin/users',
    forAdmin: true,
    bgColor: '#00bfa5',
    color: 'white',
  },
  {
    title: 'Foods',
    imageUrl: '/icons/foods.svg',
    url: '/admin/foods',
    forAdmin: true,
    bgColor: '#e040fb',
    color: 'white',
  },
];