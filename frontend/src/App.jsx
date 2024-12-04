// initial input
// function App() {
//   return <h1> Hello from App </h1>;
// }

// export default App;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormModal';
import Navigation from './components/Navigation';
import SpotsPage from './components/SpotsPage';
import SpotDetail from './components/SpotDetails';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: '/spots',
        element: <SpotsPage />
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetail />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <h1>Welcome!</h1>
//   },
//   {
//     path: '/login',
//     element: <LoginFormPage />
//   }
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
