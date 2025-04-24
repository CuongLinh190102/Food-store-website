import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getById, updateUser } from '../../services/userService';
import { useParams } from 'react-router-dom';
import classes from './userEdit.module.css';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import { EMAIL } from '../../constants/patterns';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import DashboardSideBar from '../../components/DashboardSidebar/DashboardSidebar';

export default function UserEditPage() {
  const { userId } = useParams();
  const isEditMode = !!userId;
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;
    getById(userId).then(user => {
      if (!user) return;
      reset(user);
      setAvatarUrl(user.avatar);
    });
  }, [userId, reset, isEditMode]);

  const upload = async (event) => {
    setIsUploading(true);
    try {
      setAvatarUrl(null);
      const imageUrl = await uploadImage(event);
      setAvatarUrl(imageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const submit = async (userData) => {
    try {
      const user = { 
        ...userData, 
        avatar: avatarUrl 
      };
      
      if (isEditMode) {
        await updateUser(user, userId);
        toast.success('User updated successfully!');
      } else {
        await register(user);
        toast.success('User created successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save user');
    }
  };

  return (
    <div className={classes.dashboardLayout}>
      <DashboardSideBar />
      
      <div className={classes.mainContent}>
        <div className={classes.container}>
          <div className={classes.content}>
            <Title title={isEditMode ? 'Edit User' : 'Add User'} />
            <form 
              className={classes.form}
              onSubmit={handleSubmit(submit)} 
              noValidate
            >
              <InputContainer label="Avatar">
                <input 
                  type='file' 
                  onChange={upload} 
                  accept='image/*' 
                  className={classes.avatarInput}
                />
                {isUploading && <span className={classes.uploadingText}>Uploading...</span>}
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
                label="Name"
                {...register('name', { required: true, minLength: 3 })}
                error={errors.name}
              />
              
              <Input
                label="Email"
                {...register('email', { required: true, pattern: EMAIL })}
                error={errors.email}
              />
              
              <Input
                label="Address"
                {...register('address', { required: true, minLength: 5 })}
                error={errors.address}
              />

              <Input
                label="Phone"
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                error={errors.phone}
              />

              <div className={classes.checkboxContainer}>
                <label htmlFor="isAdmin">Is Admin</label>
                <input 
                  type="checkbox" 
                  id="isAdmin" 
                  {...register('isAdmin')} 
                />
              </div>

              <Button 
                type="submit" 
                text={isEditMode ? 'Update' : 'Create'} 
                disabled={isUploading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}