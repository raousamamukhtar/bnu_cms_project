import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useUI();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email || !form.password) {
      setErrors({ email: 'Email and password are required' });
      return;
    }

    try {
      const redirectPath = await login(form.email, form.password);
      addToast(`Welcome back!`);
      navigate(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
      setErrors((prev) => ({ ...prev, email: message }));
      addToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-700 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 glass-card bg-white/10 border border-white/20 text-white">
        <div className="p-8 space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">
            SDMS
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            Sustainability Data Management System
          </h1>
          <p className="text-sm text-white/80">
            Centralize all sustainability KPIs, departmental submissions, and
            leadership analytics in one modern workspace.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left text-sm">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-emerald-200 text-xs uppercase">Roles</p>
              <p>Admin · Coordinator · Management · HR · Carbon Accountant</p>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 space-y-4 text-slate-900"
        >
          <div>
            <h2 className="text-xl font-semibold">Welcome back </h2>
            <p className="text-sm text-slate-500">
              Sign in to continue to your workspace.
            </p>
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your.email@bnu.edu.pk"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" className="w-full h-11">
            Enter Dashboard
          </Button>
          {errors.email && (
            <p className="text-xs text-red-500 text-center">{errors.email}</p>
          )}
          <p className="text-xs text-slate-400 text-center">
            Demo mode: any password works. Data auto-refreshes for sandbox use.
          </p>
        </form>
      </div>
    </div>
  );
}


