import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccounts, getOrganizations, id, saveAccounts, saveOrganizations, saveSession } from "../lib/demoData";

const orgFields = [
  ["organizationName", "Organization legal name", "Registered organization name"], ["registrationNumber", "Registration / NGO number", "e.g. MH/NGO/2026/001"],
  ["contactPerson", "Authorized contact person", "Full name"], ["phone", "Phone number", "+91 00000 00000"], ["city", "City", "Your operating city"], ["mission", "Mission and impact", "Tell donors and our verification team about your work"],
];

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "", registrationNumber: "", contactPerson: "", phone: "", city: "", mission: "" });
  const [message, setMessage] = useState("");
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const accounts = getAccounts();
    if (accounts.some((account) => account.email.toLowerCase() === form.email.trim().toLowerCase())) return setMessage("An account with this email already exists. Please sign in.");
    const account = { id: id("user"), email: form.email.trim(), password: form.password, role, name: role === "organization" ? form.organizationName : form.name, joinedAt: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
    if (role === "organization") {
      const documents = Array.from(event.currentTarget.documents.files).map((file) => file.name);
      const organization = { id: id("org"), name: form.organizationName, email: form.email.trim(), status: "pending", registrationNumber: form.registrationNumber, contactPerson: form.contactPerson, phone: form.phone, city: form.city, mission: form.mission, documents, submittedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) };
      account.organizationId = organization.id;
      saveOrganizations([...getOrganizations(), organization]);
    }
    saveAccounts([...accounts, account]);
    saveSession({ ...account, password: undefined });
    navigate("/dashboard");
  };
  const roleName = role === "organization" ? "Organization" : role === "admin" ? "Administrator" : "Donor";
  return <div className="auth-page register-page"><section className="auth-intro"><Link to="/" className="auth-brand">Charity<span>Chain</span></Link><div className="auth-copy"><p className="eyebrow">BUILD TRUST TOGETHER</p><h1>A place for every changemaker.</h1><p>Organizations are reviewed before being shown to donors. That is how we keep every campaign accountable.</p></div><div className="signup-stat"><strong>Verified organizations. Transparent campaigns.</strong><span>Give · Organize · Verify</span></div></section><section className="auth-panel"><div className="auth-form-wrap register-form"><p className="eyebrow">CREATE ACCOUNT</p><h2>{role === "organization" ? "Register your organization" : `Join as a ${roleName.toLowerCase()}`}</h2><p className="form-subtitle">{role === "organization" ? "Complete these details for our verification review." : "Create your CharityChain account in a few moments."}</p><div className="role-picker role-picker-wide">{[["donor", "♥", "Donor"], ["organization", "⌂", "Organization"], ["admin", "◈", "Admin"]].map(([key, icon, label]) => <button type="button" key={key} onClick={() => { setRole(key); setMessage(""); }} className={role === key ? "active" : ""}>{icon}<span>{label}</span></button>)}</div><form onSubmit={submit}>{role === "organization" ? <>{orgFields.map(([name, label, placeholder]) => <label key={name}>{label}{name === "mission" ? <textarea name={name} value={form[name]} onChange={update} placeholder={placeholder} required /> : <input name={name} value={form[name]} onChange={update} placeholder={placeholder} required />}</label>)}<label>Registration documents<input type="file" name="documents" accept=".pdf,image/*" multiple required /><small className="field-hint">Upload registration certificate, authorization letter, or proof documents.</small></label></> : <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your full name" required /></label>}<label>Email address<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label><label>Password<input type="password" name="password" value={form.password} onChange={update} minLength="4" placeholder="Create a password" required /></label>{message && <p className="form-message">{message}</p>}<button className="auth-submit" type="submit">{role === "organization" ? "Submit for verification" : `Create ${roleName} account`} <span>→</span></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></section></div>;
}
export default Register;
