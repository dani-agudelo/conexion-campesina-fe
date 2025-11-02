import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../state/auth";
import { ROLE_ACCESS } from "../../../constants/pages/pages";
import { useToken } from "../../../state/token";

const Navbar = () => {
    const clearUser = useAuth((state) => state.clearUser);
    const currentUser = useAuth((state) => state.currentUser);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const clearToken = useToken(state => state.clearToken);


    const handleSignOut = () => {
        clearToken();
        clearUser();
        navigate('/login')
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!currentUser) return null; // seguridad extra

    const links = ROLE_ACCESS[currentUser.role] || [];

    return (
        <header className="navbar">
            <section className="navbar__left">
                <div className="navbar__logo">
                    <span className="logo-bold">Conexión Campesina</span>
                </div>

                <nav className="navbar__links">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : ""}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </section>

            <div className="navbar__actions">
                <div className="cart-container">
                    <i className="cart-icon">🛒</i>
                    <span className="cart-badge">3</span>
                </div>

                <div className="profile-wrapper" ref={dropdownRef}>
                    <div
                        className="profile-circle"
                        onClick={() => setOpenDropdown(!openDropdown)}
                    >
                        <span className="profile-initial">
                            {currentUser.fullName.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {openDropdown && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <p className="profile-name">{currentUser.fullName}</p>
                                <p className="profile-role">{currentUser.role}</p>
                            </div>
                            <hr className="dropdown-divider" />
                            <button className="dropdown-btn">Ver perfil</button>
                            <button
                                className="dropdown-btn logout"
                                onClick={handleSignOut}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export { Navbar };
