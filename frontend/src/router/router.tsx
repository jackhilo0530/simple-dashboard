import { createBrowserRouter } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';
import MainLayout from '../layout';
import ShopProducts from '../pages/ShopProducts';
import ShopProduct from '../pages/ShopProduct';
import Products from '../pages/Products';
import Product from '../pages/Product';
import Orders from '../pages/Orders';
// import Order from '../pages/Order';
import AuthLayout from '../layout/AuthLayout';
import { AuthProvider } from '../providers';
import { ProtectedRoute } from './ProtectedRoute';



const router = createBrowserRouter([
  {
    Component: AuthProvider,
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
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
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <MainLayout />,
            children: [
              {
                index: true,
                element: <Dashboard />
              },
              {
                path: 'users',
                children: [
                  {
                    index: true,
                    element: <Users />
                  },
                  // {
                  //   path: ':id',
                  //   element: <User />
                  // }
                ]
              },
              {
                path: 'products',
                children: [
                  {
                    index: true,
                    element: <ShopProducts />,
                  },
                  {
                    path: ':id',
                    element: <ShopProduct />
                  }
                ]
              },
              {
                path: 'dummyProducts',
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
              },
              {
                path: 'orders',
                children: [
                  {
                    index: true,
                    element: <Orders />,
                  },
                  // {
                  //   path: ':id',
                  //   element: <Order />
                  // }
                ]
              }
            ]
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ]
  }
]);

export default router;