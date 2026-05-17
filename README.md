# AtomAlign - In-House Goal Setting & Tracking Portal

AtomAlign is a robust, full-stack enterprise performance management solution engineered to streamline the full lifecycle of corporate and individual goals. Built specifically for the **AtomQuest Hackathon 1.0**, this portal eliminates fragmented tracking sheets and email review cycles by providing absolute transparency, automated evaluation metrics, and full audit-compliance for employees, managers, and HR personnel.

---

##  Live Demo & Repository
* **Live Deployment URL:** `https://atom-align-two.vercel.app/`
* **GitHub Repository:** `https://github.com/Sankalpa-01/AtomAlign`

---

##  Demo Access Credentials
To facilitate seamless evaluation across all three platform personas, use the following preset credentials:

| Role | Email Address | Password | Key Capabilities to Test |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee@company.com` | `password123` | Draft goals, log quarterly achievements, view locks |
| **Manager (L1)** | `manager@company.com` | `password123` | Approve sheets, return for rework, push shared KPIs |
| **HR / Admin** | `admin@company.com` | `password123` | System audit trail, force unlock, export achievement CSV |

---

##  Features Implemented (Adherence to BRD)

### 🟢 Phase 1 — Goal Creation & Validation (Must-Have)
* **Dynamic Goal Sheet Form:** Employees can seamlessly construct structured goal sheets grouped by corporate **Thrust Areas**.
* **Flexible Unit of Measurement (UoM):** Supports multi-type tracking constraints: *Numeric (Min/Max)*, *Timeline (Date-based)*, and *Zero-based targets*.
* **Strict Real-Time Business Rule Validations:**
  * Enforces that the total weightage across all goals equals exactly **100%**.
  * Rejects submissions if any individual goal has a weightage below **10%**.
  * Restricts maximum goal creation to a maximum limit of **8 goals** per employee.
* **Manager Review Workflow:** L1 Managers can instantly review submissions, **Approve** and freeze sheets, or **Return for Rework** to reopen editing privileges.

###  Phase 2 — Achievement Tracking & Score Computation (Must-Have)
* **Immutable Progression Tracking:** Once approved, targets are strictly locked down against employee tampering.
* **Progress Logging Module:** Employees can log actual achievement updates against active windows.
* **Automated Performance Scoring Engine:** Built-in calculation formulas matching the BRD rules:
  * **Numeric Min (Higher is better):** $\text{Achievement} \div \text{Target}$
  * **Numeric Max (Lower is better):** $\text{Target} \div \text{Achievement}$
  * **Timeline:** 100% if completed on or before the target date, else 0%.
  * **Zero-Incident Targets:** 100% if actual is 0, else 0%.

###  Hackathon Bonus Features Implemented (Section 5)
* **Top-Down Shared KPI Functionality (Section 2.1 & 5):** Managers can push a unified departmental KPI simultaneously to all direct reports. The title and targets remain strictly read-only for recipients, while they retain the flexibility to balance out individual weightages.
* **Immutable System Audit Trail (Section 4):** Complete accountability log ledger tracking all post-lock admin overrides and workflow transitions—capturing who performed the modification, what was impacted, and the precise timestamp.
* **Exportable Governance Reporting (Section 4):** Admins can download a well-formed CSV Achievement Report aggregating planned vs. actual progress company-wide.
* **Real-Time Analytical Dashboard (Section 5.4):** Dynamic, database-driven summary metrics calculating user submission rates and total completion statistics directly from live server aggregations.

---

##  Technical Architecture

### Tech Stack
* **Framework:** Next.js 14+ (App Router, Server Actions, Server Components)
* **Database:** Serverless PostgreSQL (Hosted on Neon)
* **ORM:** Prisma Client
* **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide Icons
* **Form & Data Validation:** React Hook Form, Zod Schema Validation
* **Hosting Platform:** Vercel (Optimized Serverless Runtime environment)

### Architecture Highlights & Cost Optimization
* **Type-Safe Injections:** Leveraged TypeScript union mapping alongside compile-time type guards to manage server workflows with strict zero-runtime exception vulnerabilities.
* **Serverless Scale-to-Zero:** Chosen database infrastructure automatically scales computing limits to absolute zero when idle, minimizing corporate infrastructure bills during off-peak windows.
* **Serverless Backend Consolidation:** Eliminated heavy secondary API servers by using Next.js Server Actions, keeping network requests rapid, secure, and performant.

---

##  Local Development Setup

To run this project locally, follow these instructions:

1. **Clone the repository:**
   ```bash
   git clone PASTE_YOUR_GITHUB_URL_HERE
   cd atomquest-portal
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables: **
   Create a .env file in the root directory and append your connection details:
   ```bash
   DATABASE_URL="postgresql://username:password@your-neon-host.postgres.neon.tech/neondb?sslmode=require"
   ```
4. **Initialize Database Schemas**
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. **Fire up the local environment**
   ```bash
   npm run dev
   ```

## 
