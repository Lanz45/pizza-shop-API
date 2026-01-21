import React from 'react';
import { FaUpload } from 'react-icons/fa';

const RecipeModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const file = formData.get('imageFile');
    let imageUrl = initialData?.image || 'https://placehold.co/600x400?text=New+Pizza';

    if (file && file.size > 0) {
        imageUrl = URL.createObjectURL(file);
    }

    const data = {
      name: formData.get('name'),
      ingredients: formData.get('ingredients').split(','),
      caloriesPerServing: Number(formData.get('calories')),
      image: imageUrl,
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform transition-all">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
          {initialData ? 'Edit Recipe' : 'New Creation'}
        </h2>
        <form key={initialData ? initialData.id : 'new'} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Recipe Name</label>
            <input name="name" defaultValue={initialData?.name} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <div className="relative">
              <input 
                name="imageFile" 
                type="file" 
                accept="image/*"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-300" 
              />
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                <FaUpload />
              </div>
            </div>
          </div>

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
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-medium transition disabled:opacity-50">
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

export default RecipeModal;