// App.js
import React from 'react';
import './App.css';

import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

// pages
import Home from './pages/Home';
import Dates from './pages/Dates';

// layouts
import RootLayout from './layouts/RootLayout';

const page_router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={ <RootLayout/> }>
      <Route index element={<Home />} />
      <Route path="pages/Dates" element={<Dates />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={page_router} />
  );
}


export default App; 