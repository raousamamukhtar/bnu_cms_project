# BNU Sustainability - Full User Directory & Permission Matrix

This document lists all system users and defines their specific operational boundaries.

## 🔐 Full User Directory (Default Password: `password`)

| Department | Role | Email | Scope |
| :--- | :--- | :--- | :--- |
| **IT / Admin** | Admin | `admin@bnu.edu.pk` | University-wide access |
| **SCIT** | Coordinator | `coordinator1@bnu.edu.pk` | Tech school data entry |
| **SCIT** | Coordinator | `coordinator2@bnu.edu.pk` | Tech school data entry |
| **SBM** | Coordinator | `coordinator3@bnu.edu.pk` | Business school data entry |
| **SBM** | Coordinator | `coordinator4@bnu.edu.pk` | Business school data entry |
| **SLASS** | Coordinator | `slass1@bnu.edu.pk` | Liberal Arts data entry |
| **SLASS** | Coordinator | `slass2@bnu.edu.pk` | Liberal Arts data entry |
| **SVAD** | Coordinator | `svad1@bnu.edu.pk` | Art & Design data entry |
| **SVAD** | Coordinator | `svad2@bnu.edu.pk` | Art & Design data entry |
| **Human Resources** | HR Manager | `hr1@bnu.edu.pk` | Staff events |
| **Human Resources** | HR Manager | `hr2@bnu.edu.pk` | Staff events |
| **Human Resources** | HR Team | `hr@bnu.edu.pk` | Generic HR access |
| **Marketing** | Marketing Head| `marketing@bnu.edu.pk` | Campaign management |
| **Environmental** | Carbon Acc. | `carbon@bnu.edu.pk` | AQI/Carbon tracking |
| **Executive** | Management | `management@bnu.edu.pk` | Read-only audit & reporting |

---

## 🚫 Role Permissions & Limitations

### 1. Sustainability Admin
- **Permitted**: Full CRUD for all consumption metrics, event management, and period configuration.
- **Limitations**: Only the creator of a specific "Event" can edit that event, though Admin can view all.

### 2. School Coordinators (SCIT, SLASS, etc.)
- **Permitted**: entering events and initiatives dedicated to their specific school.
- **Limitations**: 
  - ❌ Cannot view Electricity, Water, or Paper consumption metrics.
  - ❌ Restricted from seeing events entered by other schools (e.g., SLASS cannot see SCIT events).
  - ❌ No access to Management dashboards.

### 3. HR & Marketing
- **Permitted**: entering departmental events (Workshops, Campaigns).
- **Limitations**:
  - ❌ Restricted strictly to their own activity feed.
  - ❌ Cannot access school-specific data or campus-wide consumption analytics.

### 4. Carbon Accountant
- **Permitted**: Full management of Carbon Footprint and AQI history.
- **Limitations**:
  - ❌ No access to Paper, Electricity, or Water data entry.
  - ❌ Restricted from creating departmental events.

### 5. Management (University Audit)
- **Permitted**: **VIEW-ONLY** access to all dashboards. Advanced filtering of events by school/department. Generating PDF and Excel reports.
- **Limitations**:
  - 🛑 **NO DATA ENTRY**: Management accounts cannot create, edit, or delete any raw data records. Their role is strictly for oversight and audit verification.

---

## 🏗️ Data flow summary
1. **Consumptions** are entered by **Admin**.
2. **Impact Events** are entered by **Coordinators/HR/Marketing**.
3. **Environmental Scores** are entered by **Carbon Accountant**.
4. **All data** flows into the **Management Dashboard** for final reporting.

---
© 2026 BNU Sustainability Management System
