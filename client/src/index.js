import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import RecipeContent from './pages/RecipeContent';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreateRecipe from './pages/CreateRecipe';
import Categories from './pages/Categories';
import AuthorPosts from './pages/AuthorPosts';
import Dashboard from './pages/Dashboard';
import EditRecipe from './pages/EditRecipe';
import DeleteRecipe from './pages/DeleteRecipe';
import LogOut from './pages/LogOut';
import UserProvider from './context/userContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: <Home/>},
      {path: "recipes/:id", element: <RecipeContent/>},
      {path: "login", element: <LogIn />},
      {path: "signup", element: <SignUp/>},
      {path: "profile/:id", element: <UserProfile/>},
      {path: "authors", element: <Authors/>},
      {path: "create", element: <CreateRecipe/>},
      {path: "recipes/categories/:category", element: <Categories/>},
      {path: "recipes/users/:id", element: <AuthorPosts/>},
      {path: "myposts/:id", element: <Dashboard/>},
      {path: "recipes/:id/edit", element: <EditRecipe/>},
      {path: "recipes/:id/delete", element: <DeleteRecipe/>},
      {path: "logout", element: <LogOut/>},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);


