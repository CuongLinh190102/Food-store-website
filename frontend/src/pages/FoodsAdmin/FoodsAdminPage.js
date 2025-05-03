import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';
import DashboardSideBar from '../../components/DashboardSidebar/DashboardSidebar';

export default function FoodsAdminPage() {
  const [foods, setFoods] = useState();
  const { searchTerm } = useParams();
// Tải danh sách món ăn khi từ khóa thay đổi
  useEffect(() => {
    loadFoods();
  }, [searchTerm]);
// Lấy tất cả món ăn hoặc tìm kiếm theo từ khóa
  const loadFoods = async () => {
    const foods = searchTerm ? await search(searchTerm) : await getAll();
    setFoods(foods);
  };

  const FoodsNotFound = () => {
    if (foods && foods.length > 0) return;

    return searchTerm ? (
      <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };
// Xóa món ăn sau khi xác nhận
  const deleteFood = async food => {
    const confirmed = window.confirm(`Delete Food ${food.name}?`);
    if (!confirmed) return;

    await deleteById(food.id);
    toast.success(`"${food.name}" Has Been Removed!`);
    setFoods(foods.filter(f => f.id !== food.id));
  };

  return (
    <div className={classes.dashboardLayout}>
      <DashboardSideBar />
      
      <div className={classes.mainContent}>
        <div className={classes.container}>
          <div className={classes.list}>
            <Title title="Manage Foods" />
            <Search
              searchRoute="/admin/foods/"
              defaultRoute="/admin/foods"
              placeholder="Search Foods"
            />
            <Link to="/admin/addFood" className={classes.add_food}>
              Add Food +
            </Link>
            
            <FoodsNotFound />
            
            <div className={classes.foodsList}>
              {foods &&
                foods.map(food => (
                  <div key={food.id} className={classes.list_item}>
                    <img src={food.imageUrl} alt={food.name} className={classes.foodImage} />
                    <Link to={'/food/' + food.id} className={classes.foodName}>{food.name}</Link>
                    <Price price={food.price} className={classes.foodPrice} />
                    <div className={classes.actions}>
                      <Link to={'/admin/editFood/' + food.id} className={classes.actionLink}>Edit</Link>
                      <span className={classes.actionLink} onClick={() => deleteFood(food)}>Delete</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}