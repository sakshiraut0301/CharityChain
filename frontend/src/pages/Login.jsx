import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const roleLabels = { donor: "Donor", organization: "Organization", admin: "Administrator" };

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "donor" });
  const [message, setMessage] = useState("");

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    const accounts = JSON.parse(localStorage.getItem("charityChainAccounts") || "[]");
    const account = accounts.find(
      (item) => item.email.toLowerCase() === form.email.trim().toLowerCase() && item.password === form.password
    );

    if (!account) {
      setMessage("We couldn't find an account with those details.");
      return;
    }
    if (account.role !== form.role) {
      setMessage(`This account is registered as a ${roleLabels[account.role]}. Please select that role.`);
      return;
    }

    localStorage.setItem("charityChainSession", JSON.stringify({ ...account, password: undefined }));
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <Link to="/" className="auth-brand">Charity<span>Chain</span></Link>
        <div className="auth-copy">
          <p className="eyebrow">ONE SECURE ACCOUNT</p>
          <h1>Make every act of giving count.</h1>
          <p>Sign in to see the impact you create, manage campaigns, or keep the CharityChain community safe.</p>
        </div>
        <div className="impact-card">
          <span className="impact-icon">✦</span>
          <div><strong>100% traceable</strong><small>Every giving journey has a record.</small></div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="form-subtitle">Choose your account type and enter your details.</p>
          <form onSubmit={handleSubmit}>
            <div className="role-picker" aria-label="Account type">
              {Object.entries(roleLabels).map(([role, label]) => (
                <button type="button" key={role} onClick={() => setForm({ ...form, role })} className={form.role === role ? "active" : ""}>
                  {role === "donor" ? "♥" : role === "organization" ? "⌂" : "◈"} <span>{label}</span>
                </button>
              ))}
            </div>
            <label>Email address<input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" required /></label>
            <label>Password<input type="password" name="password" value={form.password} onChange={updateField} placeholder="Enter your password" required /></label>
            {message && <p className="form-message" role="alert">{message}</p>}
            <button className="auth-submit" type="submit">Sign in as {roleLabels[form.role]} <span>→</span></button>
          </form>
          <p className="auth-switch">New to CharityChain? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </div>
  );
}

export default Login;
