import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import classes from './checkoutPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map, { forwardGeocode } from '../../components/Map/Map';

//Component này được sử dụng để hiển thị trang thanh toán
export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart });
  const mapRef = useRef();
  const isManualAddressEdit = useRef(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  const handleLocationChange = (latlng, address) => {
    isManualAddressEdit.current = false;
    setOrder(prev => ({ ...prev, addressLatLng: latlng }));
    setValue("address", address); // Cập nhật trường address trong form
    console.log('latlng', latlng);
    console.log('address', address);
  };

  const handleAddressChange = (e) => {
    isManualAddressEdit.current = true;
    const newAddress = e.target.value;
    setValue("address", newAddress); // Cập nhật trường address trong form

    if(newAddress !== order.address) {
      setOrder(prev => ({ ...prev, addressLatLng: { lat: '', lng: '' } }));
    }
    console.log('newAddress', newAddress);
    console.log('order.address', order.address);
    console.log('order.addressLatLng', order.addressLatLng);
  };

  useEffect(() => {
    const subscription = watch(async (value, { name }) => {
      if (name === "address" && isManualAddressEdit.current && value.address) {
        const timer = setTimeout(async () => {
          const coords = await forwardGeocode(value.address);
          if (coords) {
            setOrder(prev => ({ ...prev, addressLatLng: coords }));
            mapRef.current?.flyTo(coords, 13);
          } else {
            setOrder(prev => ({ ...prev, addressLatLng: { lat: '', lng: '' } }));
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const submit = async data => {
    await createOrder({ 
      ...order, 
      name: data.name, 
      address: data.address,
      addressLatLng: order.addressLatLng || { lat: '', lng: '' },
    });
    toast.success('Order created successfully!');
    setTimeout(() => navigate('/payment'), 200);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submit)} className={classes.container}>
        <div className={classes.content}>
          <Title title="Order Form" fontSize="1.6rem" />
          <div className={classes.inputs}>
            <Input
              defaultValue={user.name}
              label="Name"
              {...register('name')}
              error={errors.name}
            />
            <Input
              defaultValue={""}
              label="Address"
              {...register('address')}
              error={errors.address}
              onChange={handleAddressChange}
            />
          </div>
          <OrderItemsList order={order} />
        </div>
        <div>
          <Title title="Choose Your Location" fontSize="1.6rem" />
          <Map
            location={order.addressLatLng}
            onChange={handleLocationChange}
            mapRef={mapRef}
          />
        </div>

        <div className={classes.buttons_container}>
          <div className={classes.buttons}>
            <Button
              type="submit"
              text="Go To Payment"
              width="100%"
              height="3rem"
            />
          </div>
        </div>
      </form>
    </>
  );
}
