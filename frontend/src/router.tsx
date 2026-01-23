import { createBrowserRouter } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import MainLayout from './layout';
import Products from './pages/Products';
import Product from './pages/Product';

const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      {
        index: true,
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: ':id',
            element: <Product />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;