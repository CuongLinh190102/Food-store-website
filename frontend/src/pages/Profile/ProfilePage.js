import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import classes from './profilePage.module.css';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import DashboardSideBar from '../../components/DashboardSidebar/DashboardSidebar';

export default function ProfilePage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, updateProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');

  const submit = async userData => {
    try {
      await updateProfile({ ...userData, avatar: avatarUrl });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const upload = async (event) => {
    setAvatarUrl(null);
    const imageUrl = await uploadImage(event);
    setAvatarUrl(imageUrl);
  };

  return (
    <div className={classes.dashboardLayout}>
      {/* Thêm DashboardSideBar */}
      <DashboardSideBar />

      {/* Phần nội dung chính */}
      <div className={classes.mainContent}>
        <div className={classes.container}>
          <div className={classes.details}>
            <Title title="Update Profile" />
            <form 
              onSubmit={handleSubmit(submit)}
              className={classes.form}
              noValidate        
            >
              <InputContainer label="Avatar">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={upload}
                  className={classes.avatarInput}
                />
              </InputContainer>
              {avatarUrl && (
                <a href={avatarUrl} className={classes.avatarLink} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={avatarUrl} 
                    alt="Avatar Preview" 
                    className={classes.avatarPreview}
                  />
                </a>
              )}
              <Input
                defaultValue={user.name}
                type="text"
                label="Name"
                {...register('name', {
                  required: true,
                  minLength: 1,
                })}
                error={errors.name}
              />
              <Input
                defaultValue={user.address}
                type="text"
                label="Address"
                {...register('address', {
                  required: true,
                  minLength: 1,
                })}
                error={errors.address}
              />
              <Input
                defaultValue={user.phone || ''}
                type="tel"
                label="Phone Number"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                error={errors.phone}
              />

              <Button type="submit" text="Update" backgroundColor="#009e84" />
            </form>

            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
}