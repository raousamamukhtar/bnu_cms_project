import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { loginSchema } from '../../utils/validation';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Coordinator', value: 'coordinator' },
  { label: 'Management ', value: 'management' },
  { label: 'HR', value: 'hr' },
  { label: 'Marketing ', value: 'marketing' },
  { label: 'Carbon Accountant', value: 'carbon_accountant' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useUI();
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'admin',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      });
      return;
    }

    try {
      const redirectPath = login(form.username, form.role);
      addToast(`Welcome back, ${form.username}!`);
      navigate(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
      setErrors((prev) => ({ ...prev, username: message }));
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
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Select
            label="Sign in as"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
          />
          <Button type="submit" className="w-full h-11">
            Enter Dashboard
          </Button>
          {errors.username && (
            <p className="text-xs text-red-500 text-center">{errors.username}</p>
          )}
          <p className="text-xs text-slate-400 text-center">
            Demo mode: any password works. Data auto-refreshes for sandbox use.
          </p>
        </form>
      </div>
    </div>
  );
}


