import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PizzaShopDashboard from './pages/PizzaShopDashboard';

// Create the client once here
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
     
      <PizzaShopDashboard />
    </QueryClientProvider>
  );
}