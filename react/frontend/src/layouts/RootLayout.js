import React from 'react';
import { NavLink, Outlet} from 'react-router-dom';

import '../App.css';


export default function RootLayout() {
    return (
        <div className="root-layout">
            <header className="header">
                <div className="logo"></div>
                <nav className="nav">
                    <NavLink to="/" className='header-link'>HOME</NavLink>
                    <NavLink to="pages/Dates" className='header-link'>DATES</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            

        </div>

    )
}

