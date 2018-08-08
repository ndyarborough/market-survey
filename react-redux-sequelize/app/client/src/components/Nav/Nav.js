import React, { Component } from 'react';
import { Navbar, Nav as NavTag, NavItem, NavLink } from 'reactstrap';
import './Nav.css';

export default class Nav extends Component {
  render() {
    return (
        <Navbar className="home-navbar">
            <NavTag>
            {/* If Logged in */}
                <NavItem>
                <NavLink href="/">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="/my-properties">My Properties</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="/users/logout">Logout</NavLink>
                </NavItem>
                {/* Not Logged in */}
                <NavItem>
                <NavLink href="/users/login">Login</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href="/register">Register</NavLink>
                </NavItem>
            </NavTag>     
        </Navbar>
    )
  }
}
