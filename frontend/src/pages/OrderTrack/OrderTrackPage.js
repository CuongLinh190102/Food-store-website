import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackOrderById } from '../../services/orderService';
import NotFound from '../../components/NotFound/NotFound';
import classes from './orderTrackPage.module.css';
import DateTime from '../../components/DateTime/DateTime';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Title from '../../components/Title/Title';
import Map from '../../components/Map/Map';
import DashboardSideBar from '../../components/DashboardSidebar/DashboardSidebar';

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    orderId &&
      trackOrderById(orderId).then(order => {
        setOrder(order);
      });
  }, [orderId]);

  if (!orderId)
    return <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    order && (
      <div className={classes.dashboardLayout}>
        {/* Thêm DashboardSideBar */}
        <DashboardSideBar />

        {/* Phần nội dung chính */}
        <div className={classes.mainContent}>
          <div className={classes.container}>
            <div className={classes.content}>
              <h1>Order #{order.id}</h1>
              <div className={classes.header}>
                <div>
                  <strong>Date</strong>
                  <DateTime date={order.createdAt} />
                </div>
                <div>
                  <strong>Name</strong>
                  {order.name}
                </div>
                <div>
                  <strong>Address</strong>
                  {order.address}
                </div>
                <div>
                  <strong>State</strong>
                  {order.status}
                </div>
                {order.paymentId && (
                  <div>
                    <strong>Payment ID</strong>
                    {order.paymentId}
                  </div>
                )}
              </div>

              <OrderItemsList order={order} />
            </div>

            <div className={classes.mapContainer}>
              <Title title="Your Location" fontSize="1.6rem" />
              <Map location={order.addressLatLng} readonly={true} />
            </div>

            {order.status === 'NEW' && (
              <div className={classes.payment}>
                <Link to="/payment">Go To Payment</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
