import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const location = useLocation();
  const isAuth = ["/login", "/register", "/dashboard"].includes(location.pathname);
  return <div className="app">{!isAuth && <nav className="navbar"><Link to="/" className="logo">Charity<span>Chain</span></Link><div className="nav-links"><Link to="/">Home</Link><Link to="/dashboard">Dashboard</Link><Link to="/login" className="button login">Log in</Link><Link to="/register" className="button wallet">Join now</Link></div></nav>}<section className={isAuth ? "" : "main"}><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="*" element={<Home />} /></Routes></section></div>;
}
export default App;
