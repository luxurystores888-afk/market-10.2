import { pushRoutes } from './pushRoutes';
// Import other route files, e.g.:
import { productRoutes } from './productRoutes'; // Assume names based on git status

export const registerRoutes = (app) => {
  app.use('/push', pushRoutes);
  app.use('/products', productRoutes);
  // Add mounts for all routes.ts sub-files
};
