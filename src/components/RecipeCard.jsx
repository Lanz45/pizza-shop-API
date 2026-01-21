import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RecipeCard = ({ recipe, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 group">
    <div className="h-56 w-full overflow-hidden relative">
      <img
        src={recipe.image || 'https://via.placeholder.com/300?text=No+Image'}
        alt={recipe.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Error'; }}
      />
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{recipe.name}</h3>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">
          {recipe.caloriesPerServing} cal
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
        {recipe.ingredients ? recipe.ingredients.join(', ') : 'Secret ingredients'}
      </p>

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

export default RecipeCard;