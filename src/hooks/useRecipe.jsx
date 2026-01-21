import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from '../components/API'; // Adjust path if needed

export const useRecipes = (closeModalCallback) => {
  const queryClient = useQueryClient();

  // Fetch
  const { data: recipes, isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  // Create
  const addMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (newItem) => {
      queryClient.setQueryData(['recipes'], (old) => [newItem, ...(old || [])]);
      if(closeModalCallback) closeModalCallback();
    },
    onError: (err, variables) => {
        const mockItem = { ...variables, id: Math.random() };
        queryClient.setQueryData(['recipes'], (old) => [mockItem, ...(old || [])]);
        if(closeModalCallback) closeModalCallback();
    }
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: updateRecipe,
    onSuccess: (serverData, variables) => {
      const finalItem = { ...serverData, ...variables }; 
      queryClient.setQueryData(['recipes'], (old) =>
        old.map((item) => (item.id === finalItem.id ? finalItem : item))
      );
      if(closeModalCallback) closeModalCallback();
    },
    onError: (error, variables) => {
      queryClient.setQueryData(['recipes'], (old) =>
        old.map((item) => (item.id === variables.id ? { ...item, ...variables } : item))
      );
      if(closeModalCallback) closeModalCallback();
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: (data, idToDelete) => {
      queryClient.setQueryData(['recipes'], (old) =>
        old.filter((item) => item.id !== idToDelete)
      );
    },
  });

  return {
    recipes,
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation
  };
};