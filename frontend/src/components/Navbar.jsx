import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calculator, BarChart3, Brain, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/predict', label: 'Predict', icon: Calculator },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/model', label: 'Model', icon: Brain },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="navbar-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <div className="brand-icon">
            <Brain size={22} />
          </div>
          <span className="brand-text">AttritionAI</span>
        </NavLink>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${open ? 'nav-links--open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
