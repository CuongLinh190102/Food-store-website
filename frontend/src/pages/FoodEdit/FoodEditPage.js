import { useParams } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DashboardSideBar from '../../components/DashboardSidebar/DashboardSidebar';

export default function FoodEditPage() {
  const { foodId } = useParams();
  const [imageUrl, setImageUrl] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = !!foodId;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    getById(foodId).then(food => {
      if (!food) return;
      reset(food);
      setImageUrl(food.imageUrl);
    });
  }, [foodId, reset, isEditMode]);

  const submit = async foodData => {
    const food = { ...foodData, imageUrl };

    try {
      if (isEditMode) {
        await update(food);
        toast.success(`Food "${food.name}" updated successfully!`);
      } else {
        const newFood = await add(food);
        toast.success(`Food "${food.name}" added successfully!`);
        navigate('/admin/editFood/' + newFood.id, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save food');
    }
  };

  const upload = async event => {
    setIsUploading(true);
    try {
      setImageUrl(null);
      const url = await uploadImage(event);
      setImageUrl(url);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={classes.dashboardLayout}>
      <DashboardSideBar />
      
      <div className={classes.mainContent}>
        <div className={classes.container}>
          <div className={classes.content}>
            <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
            <form
              className={classes.form}
              onSubmit={handleSubmit(submit)}
              noValidate
            >
              <InputContainer label="Food Image">
                <input 
                  type="file" 
                  onChange={upload} 
                  accept="image/*"
                  className={classes.fileInput}
                  disabled={isUploading}
                />
                {isUploading && <span className={classes.uploadingText}>Uploading image...</span>}
              </InputContainer>

              {imageUrl && (
                <div className={classes.imagePreview}>
                  <img src={imageUrl} alt="Preview" />
                </div>
              )}

              <Input
                type="text"
                label="Name"
                {...register('name', { 
                  required: 'Food name is required',
                  minLength: {
                    value: 3,
                    message: 'Name should be at least 3 characters'
                  }
                })}
                error={errors.name}
              />

              <Input
                type="number"
                label="Price ($)"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: {
                    value: 0.01,
                    message: 'Price must be greater than 0'
                  }
                })}
                error={errors.price}
              />

              <Input
                type="text"
                label="Tags (comma separated)"
                {...register('tags')}
                error={errors.tags}
              />

              <Input
                type="text"
                label="Origins"
                {...register('origins', { 
                  required: 'Origin is required'
                })}
                error={errors.origins}
              />

              <Input
                type="text"
                label="Cook Time (minutes)"
                {...register('cookTime', { 
                  required: 'Cook time is required'
                })}
                error={errors.cookTime}
              />

              <Button 
                type="submit" 
                text={isEditMode ? 'Update Food' : 'Create Food'} 
                disabled={isUploading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}