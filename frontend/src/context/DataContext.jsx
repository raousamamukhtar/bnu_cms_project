import { createContext, useContext, useMemo, useState } from 'react';
import {
  auditLogs as initialAuditLogs,
  departmentComparison,
  departmentMonthlyData,
  departmentRanking,
  departments as departmentSeed,
  impactInitiatives,
  kpiTargets,
  monthlyAdminData,
  monthlyKpiData,
  reportsCatalog,
  submissionLogs as initialSubmissions,
  trendHighlights,
  users as usersSeed,
} from '../data/data';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [audits, setAudits] = useState(initialAuditLogs);
  const [userList, setUserList] = useState(usersSeed);
  const [departmentList, setDepartmentList] = useState(departmentSeed);

  const addSubmission = (payload) => {
    setSubmissions((prev) => [
      {
        id: `sub-${prev.length + 1}`.padStart(3, '0'),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        ...payload,
      },
      ...prev,
    ]);
  };

  const updateSubmission = (id, updatedMetrics) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              metrics: { ...sub.metrics, ...updatedMetrics },
            }
          : sub,
      ),
    );
  };

  const updateSubmissionStatus = (id, status) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)),
    );
    addAudit({
      user: 'System',
      role: 'Admin',
      action: `Updated submission ${id} status to ${status}`,
    });
  };

  const addAudit = (log) => {
    setAudits((prev) => [
      {
        id: `audit-${prev.length + 1}`.padStart(3, '0'),
        timestamp: new Date().toISOString(),
        ...log,
      },
      ...prev,
    ]);
  };

  const addUser = (user) => {
    setUserList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...user,
      },
    ]);
    addAudit({
      user: 'System',
      role: 'Admin',
      action: `Created user ${user.name} (${user.role})`,
    });
  };

  const updateUserRole = (id, role) => {
    setUserList((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user)),
    );
    addAudit({
      user: 'System',
      role: 'Admin',
      action: `Updated role for user ${id} to ${role}`,
    });
  };

  const addDepartment = (name) => {
    if (!name) return;
    if (departmentList.includes(name)) return;
    setDepartmentList((prev) => [...prev, name]);
    addAudit({
      user: 'System',
      role: 'Admin',
      action: `Added new department ${name}`,
    });
  };

  const value = useMemo(
    () => ({
      departments: departmentList,
      users: userList,
      monthlyKpiData,
      monthlyAdminData,
      departmentMonthlyData,
      departmentComparison,
      departmentRanking,
      kpiTargets,
      impactInitiatives,
      trendHighlights,
      reportsCatalog,
      submissions,
      audits,
      addUser,
      updateUserRole,
      addDepartment,
      addSubmission,
      updateSubmission,
      updateSubmissionStatus,
      addAudit,
    }),
    [audits, departmentList, submissions, userList],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }
  return ctx;
}


