// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import classes from './dashboard.module.css';
import { getAll } from '../../services/orderService';
import { FaUtensils, FaClipboardList, FaDollarSign, FaHistory } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tất cả đơn hàng có trạng thái khác NEW
        const orders = await getAll();
        const nonNewOrders = orders.filter(order => order.status !== 'NEW');

        // Tính toán các số liệu
        const totalItems = nonNewOrders.reduce(
          (sum, order) => sum + order.items.reduce(
            (itemSum, item) => itemSum + item.quantity, 0
          ), 0
        );
        
        const totalOrders = nonNewOrders.length;
        const totalRevenue = nonNewOrders.reduce(
          (sum, order) => sum + order.totalPrice, 0
        );
        
        // Lấy top 3 đơn hàng mới nhất (sắp xếp theo createdAt giảm dần)
        const recentOrders = [...nonNewOrders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setStats({
          totalItems,
          totalOrders,
          totalRevenue,
          recentOrders
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  return (
    <div className={classes.dashboard}>
      <DashboardSidebar />
      <div className={classes.mainContent}>
        <h1><FaHistory className={classes.titleIcon} /> Admin Dashboard</h1>

        <div className={classes.statsContainer}>
          <div className={classes.statCard}>
            <div className={classes.statIcon}>
              <FaUtensils size={24} />
            </div>
            <h3>Food delivered</h3>
            <p>{stats.totalItems}</p>
          </div>
          <div className={classes.statCard}>
            <div className={classes.statIcon}>
              <FaClipboardList size={24} />
            </div>
            <h3>Total orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
          <div className={classes.statCard}>
            <div className={classes.statIcon}>
              <FaDollarSign size={24} />
            </div>
            <h3>Total revenue</h3>
            <p>${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className={classes.recentOrders}>
          <h2><FaClipboardList className={classes.sectionIcon} />Recent Orders</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total price</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 5)}</td>
                  <td>{order.name}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.status}</td>
                  <td>
                    <button onClick={() => handleViewOrder(order._id)}>Xem</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}