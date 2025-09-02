import Dashboard from "./Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CategoryList from "../components/CategoryList.jsx";
import { Plus } from "lucide-react";
import Model from "./Model.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import EditCategoryForm from "../components/EditCategoryForm.jsx"; // ✅ create this

const Category = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Fetch all categories
  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete category
  const handleDeleteCategory = async (id) => {
    try {
      const response = await axiosConfig.delete(
        `${API_ENDPOINTS.DELETE_CATEGORY}/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        toast.success("Category deleted successfully!");
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  return (
    <Dashboard activeMenu="Category">
      <div className="my-5 mx-auto">
        {/* Add button */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <button
            onClick={() => setOpenAddCategoryModal(true)}
            className=" bg-purple-800 
        text-white 
        font-semibold 
        py-2 px-5 
        rounded-lg 
        shadow-lg 
        shadow-purple-300/50 
        hover:shadow-purple-400/70
        transform 
        hover:scale-105
        active:scale-100
        transition-all 
        duration-200 
        ease-in-out 
        flex 
        items-center 
        gap-2"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      {/* Category list */}
      <CategoryList
        categories={categoryData}
        loading={loading}
        onEditCategory={(category) => {
          setSelectedCategory(category);
          setOpenEditCategoryModal(true);
        }}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Add Category Modal */}
      <Model
        isOpen={openAddCategoryModal}
        onClose={() => setOpenAddCategoryModal(false)}
        title="Add Category"
      >
        <AddCategoryForm
          existingCategories={categoryData} 
          onSuccess={fetchCategoryDetails}
          onClose={() => setOpenAddCategoryModal(false)}
        />
      </Model>

      {/* Edit Category Modal */}
     <Model
  isOpen={openEditCategoryModal}
  onClose={() => setOpenEditCategoryModal(false)}
  title="Edit Category"
>
  <EditCategoryForm
    category={selectedCategory}
    existingCategories={categoryData}   // ✅ pass all categories for duplicate check
    onSuccess={fetchCategoryDetails}
    onClose={() => setOpenEditCategoryModal(false)}
  />
</Model>

    </Dashboard>
  );
};

export default Category;
