import React, { useState } from 'react';
import { FaPlus, FaPizzaSlice, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { useRecipes } from '../hooks/useRecipe';

const PizzaShopDashboard = () => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const { 
    recipes, 
    isLoading, 
    isError, 
    addMutation, 
    updateMutation, 
    deleteMutation 
  } = useRecipes(() => {
    setIsModalOpen(false);
    setEditingRecipe(null);
  });

  const handleCreate = (data) => addMutation.mutate({ ...data, userId: 1 });
  const handleUpdate = (data) => updateMutation.mutate({ id: editingRecipe.id, ...data });
  const openCreateModal = () => { setEditingRecipe(null); setIsModalOpen(true); };
  const openEditModal = (recipe) => { setEditingRecipe(recipe); setIsModalOpen(true); };

  const filteredRecipes = recipes?.filter((recipe) =>
    recipe.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div></div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading recipes</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <FaPizzaSlice className="text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">Pizza Shop</span>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold transition shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FaPlus className="text-sm" /> Add Recipe
          </button>
        </div>
      </nav>

      <div className="bg-gray-900 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Crave it. Make it.</h1>
          <p className="text-gray-400 text-lg mb-8">Discover and create the best pizza recipes in town.</p>
          
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for pizza, pasta..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-6 pr-4 py-4 rounded-full text-white-900 text-black focus:ring-4 focus:ring-orange-500/50 outline-none shadow-2xl"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-900/20 to-orange-900/20 z-0"></div>
      </div>

      <main className="flex-grow w-full px-6 py-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Menu Items ({filteredRecipes?.length})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {filteredRecipes?.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={openEditModal}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>

        {filteredRecipes?.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No recipes found matching "{filter}"</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
            <FaPizzaSlice className="text-red-600" /> PizzaShop
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 PizzaShop Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-red-600 transition"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-red-600 transition"><FaInstagram size={24} /></a>
            <a href="#" className="hover:text-red-600 transition"><FaTwitter size={24} /></a>
          </div>
        </div>
      </footer>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingRecipe ? handleUpdate : handleCreate}
        initialData={editingRecipe}
        isSubmitting={addMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PizzaShopDashboard;