import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Users from '../admin/pages/Users';
import NotFound from '../pages/NotFound';
import Dashboard from '../admin/pages/Dashboard';
import MainLayout from '../layout';
import ShopProducts from '../admin/pages/ShopProducts';
import ShopProduct from '../admin/pages/ShopProduct';
import Products from '../admin/pages/Products';
import Product from '../admin/pages/Product';
import Orders from '../admin/pages/Orders';
// import Order from '../pages/Order';
import AuthLayout from '../layout/AuthLayout';
import { AuthProvider } from '../providers';
import { ProtectedRoute } from './ProtectedRoute';



const router = createBrowserRouter([
  {
    Component: AuthProvider,
    children: [
      {
        path: '/',
        element: <Navigate to="/admin" replace />
      },
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
                element: <Navigate to="/admin" replace />
              },
              {
                path: '/admin',
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

              },
              {
                path: '/users',
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
              }
            ]
          },
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