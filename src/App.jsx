import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from './API';
import { FaEdit, FaTrash, FaPlus, FaPizzaSlice, FaFacebook, FaInstagram, FaTwitter, FaUpload } from 'react-icons/fa';

// Create a client
const queryClient = new QueryClient();

// --- COMPONENTS ---

// 1. Recipe Card
// 1. Recipe Card (Updated: Buttons Always Visible)
const RecipeCard = ({ recipe, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 group">
    
    {/* Image Section */}
    <div className="h-56 w-full overflow-hidden relative">
      <img
        src={recipe.image || 'https://via.placeholder.com/300?text=No+Image'}
        alt={recipe.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error'; }}
      />
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{recipe.name}</h3>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
          {recipe.caloriesPerServing} cal
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
        {recipe.ingredients ? recipe.ingredients.join(', ') : 'Secret ingredients'}
      </p>

        
        {/* CHANGED HERE: Removed 'opacity-0' and 'group-hover:opacity-100' */}
        <div className="flex gap-2"> 
          <button onClick={() => onEdit(recipe)} className="p-2 bg-gray-100 text-blue-600 rounded-full hover:bg-blue-100 transition">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(recipe.id)} className="p-2 bg-gray-100 text-red-600 rounded-full hover:bg-red-100 transition">
            <FaTrash />
          </button>
        </div>
      </div>
  </div>
);

// 2. Modal Form (With File Upload Support)
const RecipeModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // --- FILE UPLOAD LOGIC ---
    const file = formData.get('imageFile');
    let imageUrl = initialData?.image || 'https://placehold.co/600x400?text=New+Pizza';

    // If a file was selected, create a local URL for it
    if (file && file.size > 0) {
        imageUrl = URL.createObjectURL(file);
    }
    // -------------------------

    const data = {
      name: formData.get('name'),
      ingredients: formData.get('ingredients').split(','),
      caloriesPerServing: Number(formData.get('calories')),
      image: imageUrl, // Send the new local URL
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform transition-all">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
          {initialData ? 'Edit Recipe' : 'New Creation'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Recipe Name</label>
            <input name="name" defaultValue={initialData?.name} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
          </div>
          
          {/* File Upload Input (NEW) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <div className="relative">
              <input 
                name="imageFile" 
                type="file" 
                accept="image/*"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" 
              />
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                <FaUpload />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredients</label>
            <textarea name="ingredients" defaultValue={initialData?.ingredients?.join(', ')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" rows="3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Calories</label>
              <input name="calories" type="number" defaultValue={initialData?.caloriesPerServing} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold shadow-lg shadow-orange-200 transition flex items-center gap-2 disabled:bg-orange-400 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : (initialData ? 'Update Recipe' : 'Create Recipe')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Main Dashboard
const PizzaShopDashboard = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  const addMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (newItem) => {
      // FIX: Add (old || []) to handle cases where the list is empty/undefined
      queryClient.setQueryData(['recipes'], (old) => [newItem, ...(old || [])]);
      setIsModalOpen(false);
    },
    // Use onError to handle fake API limitations
    onError: (err, variables) => {
        // Create a fake ID and add the item locally
        const mockItem = { ...variables, id: Math.random() };
        
        // FIX: Add (old || []) here too!
        queryClient.setQueryData(['recipes'], (old) => [mockItem, ...(old || [])]);
        
        setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateRecipe,
    onSuccess: (serverData, variables) => {
      const finalItem = { ...serverData, ...variables }; 
      queryClient.setQueryData(['recipes'], (old) =>
        old.map((item) => (item.id === finalItem.id ? finalItem : item))
      );
      setIsModalOpen(false);
      setEditingRecipe(null);
    },
    onError: (error, variables) => {
      queryClient.setQueryData(['recipes'], (old) =>
        old.map((item) => (item.id === variables.id ? { ...item, ...variables } : item))
      );
      setIsModalOpen(false);
      setEditingRecipe(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: (data, idToDelete) => {
      queryClient.setQueryData(['recipes'], (old) =>
        old.filter((item) => item.id !== idToDelete)
      );
    },
  });

  const handleCreate = (data) => {
    addMutation.mutate({ ...data, userId: 1 });
  };
  
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
      
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg text-white">
              <FaPizzaSlice className="text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">Pizza8Box</span>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold transition shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <FaPlus className="text-sm" /> Add Recipe
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
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
              className="w-full pl-6 pr-4 py-4 rounded-full text-gray-900 focus:ring-4 focus:ring-orange-500/50 outline-none shadow-2xl"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-900/20 to-purple-900/20 z-0"></div>
      </div>

      {/* MAIN CONTENT */}
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

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
            <FaPizzaSlice className="text-orange-600" /> Pizza8Box
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 Pizza8Box Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-orange-600 transition"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-orange-600 transition"><FaInstagram size={24} /></a>
            <a href="#" className="hover:text-orange-600 transition"><FaTwitter size={24} /></a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PizzaShopDashboard />
    </QueryClientProvider>
  );
}