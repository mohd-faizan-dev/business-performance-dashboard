"use client";
import { useMemo, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  FileText,
  BriefcaseBusiness,
  ShoppingCart,
  Wallet,
  Search,
  Bell,
  Download,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Target,
  CircleDollarSign,
  CheckCircle2,
  Clock3,
  XCircle,
  Menu,
  ChevronDown,
  Activity,
  CreditCard,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";

const DAY = 86400000;
const today = new Date();

function dateAgo(days) {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d;
}

function isoDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function makeData() {
  const names = [
    "Aarav Sharma", "Priya Verma", "Rahul Singh", "Ananya Gupta",
    "Rohan Kumar", "Sneha Patel", "Vikram Das", "Aisha Khan",
    "Karan Mehta", "Neha Joshi", "Arjun Rao", "Simran Kaur",
    "Kabir Ali", "Ishita Roy", "Aditya Jain", "Pooja Yadav",
    "Dev Malhotra", "Meera Nair", "Sahil Ansari", "Tanya Bose",
  ];
  const services = [
    "Website Development", "SEO Services", "E-commerce Website",
    "UI/UX Design", "Digital Marketing", "Mobile App Development",
  ];
  const sources = ["Google Ads", "Website", "Referral", "LinkedIn", "Just Dial"];
  const departments = ["Sales", "Marketing", "Business Development"];
  const priorities = ["High", "Medium", "Low"];
  const leads = [];
  const quotations = [];
  const deals = [];
  const orders = [];
  const payments = [];

  // Fixed formulas make the sample data repeatable.
  for (let i = 1; i <= 150; i++) {
    const createdAt = dateAgo((i * 7 + (i % 9) * 3) % 90);
    const status = i % 7 === 0 ? "Unqualified"
      : i % 4 === 0 ? "Converted"
        : i % 3 === 0 ? "Qualified" : "New";

    leads.push({
      id: `LD-${String(i).padStart(4, "0")}`,
      name: names[i % names.length],
      company: ["Northstar Labs", "BrightPath Co.", "Nova Retail", "PixelCraft", "BluePeak Ltd."][i % 5],
      createdAt,
      status,
      source: sources[i % sources.length],
      department: departments[i % departments.length],
      owner: names[(i * 3) % names.length],
    });
  }

  leads.forEach((lead, i) => {
    if (i % 3 === 0 || i % 5 === 0) {
      const count = i % 6 === 0 ? 2 : 1;
      for (let j = 0; j < count; j++) {
        const createdAt = new Date(lead.createdAt.getTime() + j * 2 * DAY);
        quotations.push({
          id: `QT-${String(quotations.length + 1).padStart(4, "0")}`,
          leadId: lead.id,
          service: services[(i + j) % services.length],
          amount: 12000 + ((i * 731 + j * 4200) % 68000),
          status: i % 5 === 0 ? "Accepted" : i % 4 === 0 ? "Rejected" : "Pending",
          createdAt,
          owner: lead.owner,
        });
      }
    }
  });

  quotations.filter((q) => q.status === "Accepted" || Number(q.id.slice(-2)) % 4 === 0)
    .forEach((q, i) => {
      const createdAt = new Date(q.createdAt.getTime() + DAY);
      const amount = Math.round(q.amount * (0.85 + (i % 4) * 0.05));
      const deal = {
        id: `DL-${String(deals.length + 1).padStart(4, "0")}`,
        leadId: q.leadId,
        quotationId: q.id,
        service: q.service,
        amount,
        priority: priorities[i % priorities.length],
        status: i % 4 === 0 ? "Completed" : i % 3 === 0 ? "In Progress" : "Pending",
        createdAt,
        owner: q.owner,
      };
      deals.push(deal);

      const orderCount = i % 5 === 0 ? 2 : 1;
      for (let j = 0; j < orderCount; j++) {
        const order = {
          id: `OR-${String(orders.length + 1).padStart(4, "0")}`,
          dealId: deal.id,
          leadId: deal.leadId,
          service: deal.service,
          amount: Math.round(deal.amount / orderCount),
          status: (i + j) % 5 === 0 ? "Completed"
            : (i + j) % 4 === 0 ? "On Hold"
              : (i + j) % 3 === 0 ? "In Progress" : "Pending",
          progress: (i + j) % 5 === 0 ? 100 : ((i * 13 + j * 19) % 85) + 10,
          createdAt: new Date(createdAt.getTime() + j * DAY),
        };
        orders.push(order);

        const collected = Math.round(order.amount * ((i + j) % 3 === 0 ? 0.45 : (i + j) % 2 === 0 ? 0.8 : 1));
        if (collected > 0) {
          payments.push({
            id: `PM-${String(payments.length + 1).padStart(4, "0")}`,
            orderId: order.id,
            amount: collected,
            status: collected >= order.amount ? "Paid" : "Partial",
            createdAt: new Date(order.createdAt.getTime() + DAY),
          });
        }
      }
    });

  return { leads, quotations, deals, orders, payments };
}

const DATA = makeData();
const COLORS = ["#818cf8", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#c084fc"];
const money = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(n || 0);
const shortMoney = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return money(n);
};
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short",
});
const pct = (a, b) => b === 0 ? (a ? 100 : 0) : ((a - b) / b) * 100;

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ title, value, change, icon: Icon, color, hint, onClick }) {
  const positive = change >= 0;
  return (
    <button className="metric-card" onClick={onClick} type="button">
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${color}`}><Icon size={18} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        <span className={positive ? "change-up" : "change-down"}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="muted">{hint || "vs previous period"}</span>
      </div>
    </button>
  );
}

function StatusBadge({ children }) {
  const cls = String(children).toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${cls}`}>{children}</span>;
}

export default function Home() {
  const [range, setRange] = useState("30");
  const [customStart, setCustomStart] = useState(isoDate(dateAgo(29)));
  const [customEnd, setCustomEnd] = useState(isoDate(today));
  const [department, setDepartment] = useState("All Departments");
  const [source, setSource] = useState("All Sources");
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("Overview");
  const [detail, setDetail] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  const { start, end, previousStart, previousEnd } = useMemo(() => {
    let e = new Date(today);
    let s = dateAgo(29);
    if (range === "today") s = new Date(today);
    if (range === "7") s = dateAgo(6);
    if (range === "30") s = dateAgo(29);
    if (range === "custom") {
      s = new Date(`${customStart}T00:00:00`);
      e = new Date(`${customEnd}T23:59:59`);
    }
    const duration = Math.max(1, Math.round((e - s) / DAY) + 1);
    return {
      start: s,
      end: e,
      previousStart: new Date(s.getTime() - duration * DAY),
      previousEnd: new Date(s.getTime() - 1),
    };
  }, [range, customStart, customEnd]);

  const inRange = (item, s, e) => {
    const d = new Date(item.createdAt);
    return d >= s && d <= e;
  };

  const filtered = useMemo(() => {
    const select = (items, s, e) => items.filter((x) =>
      inRange(x, s, e) &&
      (department === "All Departments" || !x.department || x.department === department) &&
      (source === "All Sources" || !x.source || x.source === source)
    );
    return {
      leads: select(DATA.leads, start, end),
      quotations: select(DATA.quotations, start, end),
      deals: select(DATA.deals, start, end),
      orders: select(DATA.orders, start, end),
      payments: select(DATA.payments, start, end),
      previous: {
        leads: select(DATA.leads, previousStart, previousEnd),
        quotations: select(DATA.quotations, previousStart, previousEnd),
        deals: select(DATA.deals, previousStart, previousEnd),
        orders: select(DATA.orders, previousStart, previousEnd),
        payments: select(DATA.payments, previousStart, previousEnd),
      },
    };
  }, [start, end, previousStart, previousEnd, department, source]);

  const leadStats = useMemo(() => {
    const leads = filtered.leads;
    const qualified = leads.filter(x => ["Qualified", "Converted"].includes(x.status)).length;
    const converted = leads.filter(x => x.status === "Converted").length;
    const unqualified = leads.filter(x => x.status === "Unqualified").length;
    return {
      total: leads.length, qualified, converted, unqualified,
      conversion: leads.length ? converted / leads.length * 100 : 0
    };
  }, [filtered.leads]);

  const prevLeadStats = useMemo(() => {
    const leads = filtered.previous.leads;
    return {
      total: leads.length,
      qualified: leads.filter(x => ["Qualified", "Converted"].includes(x.status)).length,
      converted: leads.filter(x => x.status === "Converted").length,
      unqualified: leads.filter(x => x.status === "Unqualified").length,
    };
  }, [filtered.previous.leads]);

  const revenue = filtered.deals.reduce((sum, d) => sum + d.amount, 0);
  const collected = filtered.payments.reduce((sum, p) => sum + p.amount, 0);
  const quotationValue = filtered.quotations.reduce((sum, q) => sum + q.amount, 0);
  const outstanding = Math.max(0, revenue - collected);
  const prevRevenue = filtered.previous.deals.reduce((sum, d) => sum + d.amount, 0);
  const prevCollected = filtered.previous.payments.reduce((sum, p) => sum + p.amount, 0);
  const prevQuotationValue = filtered.previous.quotations.reduce((sum, q) => sum + q.amount, 0);
  const prevOutstanding = Math.max(0, prevRevenue - prevCollected);

  const dailyTrend = useMemo(() => {
    const days = [];
    const count = Math.min(30, Math.max(1, Math.round((end - start) / DAY) + 1));
    for (let i = 0; i < count; i++) {
      const d = new Date(start.getTime() + i * DAY);
      const next = new Date(d.getTime() + DAY);
      days.push({
        day: fmtDate(d),
        leads: filtered.leads.filter(x => x.createdAt >= d && x.createdAt < next).length,
        qualified: filtered.leads.filter(x => x.createdAt >= d && x.createdAt < next && ["Qualified", "Converted"].includes(x.status)).length,
        converted: filtered.leads.filter(x => x.createdAt >= d && x.createdAt < next && x.status === "Converted").length,
        revenue: filtered.deals.filter(x => x.createdAt >= d && x.createdAt < next).reduce((sum, x) => sum + x.amount, 0),
        collected: filtered.payments.filter(x => x.createdAt >= d && x.createdAt < next).reduce((sum, x) => sum + x.amount, 0),
      });
    }
    return days;
  }, [start, end, filtered.leads, filtered.deals, filtered.payments]);

  const sourceData = useMemo(() => {
    const counts = {};
    filtered.leads.forEach(l => counts[l.source] = (counts[l.source] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered.leads]);

  const funnelData = [
    { name: "New leads", value: leadStats.total, fill: "#818cf8" },
    { name: "Qualified", value: leadStats.qualified, fill: "#22d3ee" },
    { name: "Converted", value: leadStats.converted, fill: "#34d399" },
  ];

  const quotationServices = useMemo(() => {
    const result = {};
    filtered.quotations.forEach(q => {
      if (!result[q.service]) result[q.service] = { name: q.service, count: 0, value: 0, accepted: 0 };
      result[q.service].count++;
      result[q.service].value += q.amount;
      if (q.status === "Accepted") result[q.service].accepted++;
    });
    return Object.values(result).sort((a, b) => b.value - a.value);
  }, [filtered.quotations]);

  const revenueServices = useMemo(() => {
    const result = {};
    filtered.deals.forEach(d => {
      result[d.service] = (result[d.service] || 0) + d.amount;
    });
    return Object.entries(result).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered.deals]);

  const priorities = ["High", "Medium", "Low"].map(name => {
    const items = filtered.deals.filter(d => d.priority === name);
    return { name, deals: items.length, revenue: items.reduce((s, d) => s + d.amount, 0) };
  });

  const orderStatuses = ["Pending", "In Progress", "Completed", "On Hold"].map(name => ({
    name, value: filtered.orders.filter(o => o.status === name).length,
  }));

  const recentLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...filtered.leads]
      .filter(x => !q || `${x.name} ${x.company} ${x.id} ${x.source}`.toLowerCase().includes(q))
      .sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  }, [filtered.leads, search]);

  const recentActivity = useMemo(() => [
    ...filtered.leads.map(x => ({ date: x.createdAt, title: "Lead created", record: x.id, person: x.name, status: x.status })),
    ...filtered.quotations.map(x => ({ date: x.createdAt, title: "Quotation created", record: x.id, person: x.owner, status: x.status })),
    ...filtered.deals.map(x => ({ date: x.createdAt, title: "Deal created", record: x.id, person: x.owner, status: x.status })),
    ...filtered.payments.map(x => ({ date: x.createdAt, title: "Payment received", record: x.id, person: x.orderId, status: x.status })),
  ].sort((a, b) => b.date - a.date).slice(0, 7), [filtered]);

  const exportCSV = () => {
    const rows = [
      ["Section", "ID", "Name / Service", "Status", "Date", "Amount"],
      ...filtered.leads.map(x => ["Lead", x.id, x.name, x.status, isoDate(x.createdAt), ""]),
      ...filtered.quotations.map(x => ["Quotation", x.id, x.service, x.status, isoDate(x.createdAt), x.amount]),
      ...filtered.deals.map(x => ["Deal", x.id, x.service, x.status, isoDate(x.createdAt), x.amount]),
      ...filtered.orders.map(x => ["Order", x.id, x.service, x.status, isoDate(x.createdAt), x.amount]),
      ...filtered.payments.map(x => ["Payment", x.id, x.orderId, x.status, isoDate(x.createdAt), x.amount]),
    ];
    const csv = rows.map(row => row.map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-analytics-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const nav = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Leads", icon: Users },
    { label: "Quotations", icon: FileText },
    { label: "Deals & Revenue", icon: BriefcaseBusiness },
    { label: "Orders & Payments", icon: ShoppingCart },
  ];

  const openDetail = (section) => {
    setActiveSection(section);
    setDetail(section === "Overview" ? null : section);
  };

  const detailRows = detail === "Leads" ? recentLeads :
    detail === "Quotations" ? filtered.quotations.slice(0, 12) :
      detail === "Deals & Revenue" ? filtered.deals.slice(0, 12) :
        detail === "Orders & Payments" ? filtered.orders.slice(0, 12) : [];

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={23} /></div>
          <div><strong>Pulse<span>Analytics</span></strong><small>BUSINESS INTELLIGENCE</small></div>
          <button className="mobile-close icon-button" onClick={() => setMobileNav(false)}><XCircle size={19} /></button>
        </div>

        <div className="workspace">
          <div className="workspace-icon">P</div>
          <div><strong>Pulse Agency</strong><small>Business workspace</small></div>
          <ChevronDown size={15} className="muted" />
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="nav-menu">
          {nav.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${activeSection === label ? "active" : ""}`}
              onClick={() => { openDetail(label); setMobileNav(false); }}>
              <Icon size={18} /><span>{label}</span>
              {label === "Leads" && <span className="nav-count">{filtered.leads.length}</span>}
            </button>
          ))}
        </nav>

        <p className="nav-label">INSIGHTS</p>
        <button className="nav-link" onClick={() => document.getElementById("revenue-section")?.scrollIntoView({ behavior: "smooth" })}>
          <TrendingUp size={18} /><span>Revenue insights</span>
        </button>
        <button className="nav-link" onClick={() => document.getElementById("team-section")?.scrollIntoView({ behavior: "smooth" })}>
          <Users size={18} /><span>Team performance</span>
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Target size={18} /></div>
            <strong>Revenue goal</strong>
            <p>Keep your team on track to hit this month's target.</p>
            <div className="progress-track"><span style={{ width: `${Math.min(100, revenue / 850000 * 100)}%` }} /></div>
            <div className="goal-row"><span>{Math.min(100, Math.round(revenue / 850000 * 100))}% achieved</span><span>₹8.5L</span></div>
          </div>
          <div className="profile">
            <div className="avatar">FA</div>
            <div><strong>Admin User</strong><small>Administrator</small></div>
            <ChevronDown size={16} className="muted" />
          </div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={21} /></button>
            <div className="breadcrumbs">Workspace <span>/</span> <strong>{activeSection}</strong></div>
          </div>
          <div className="topbar-right">
            <span className="live-status"><span /> Demo data</span>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
            <div className="top-avatar">FA</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span /> BUSINESS INTELLIGENCE</div>
              <h1>Business overview<span className="heading-dot">.</span></h1>
              <p>Track performance, discover trends, and make smarter decisions.</p>
            </div>
            <button className="btn-primary" onClick={exportCSV}><Download size={16} /> Export report</button>
          </div>

          <div className="filter-bar">
            <div className="filter-title"><Filter size={16} /><span>Filters</span></div>
            <div className="range-tabs">
              {[["today", "Today"], ["7", "7 days"], ["30", "30 days"], ["custom", "Custom"]].map(([value, label]) => (
                <button key={value} className={range === value ? "selected" : ""} onClick={() => setRange(value)}>{label}</button>
              ))}
            </div>
            {range === "custom" && (
              <div className="custom-dates">
                <input aria-label="Start date" type="date" value={customStart} max={customEnd} onChange={e => setCustomStart(e.target.value)} />
                <span>to</span>
                <input aria-label="End date" type="date" value={customEnd} min={customStart} onChange={e => setCustomEnd(e.target.value)} />
              </div>
            )}
            <div className="filter-selects">
              <label><Users size={14} /><select value={department} onChange={e => setDepartment(e.target.value)} aria-label="Department">
                <option>All Departments</option><option>Sales</option><option>Marketing</option><option>Business Development</option>
              </select></label>
              <label><Filter size={14} /><select value={source} onChange={e => setSource(e.target.value)} aria-label="Lead source">
                <option>All Sources</option><option>Google Ads</option><option>Website</option><option>Referral</option><option>LinkedIn</option><option>Just Dial</option>
              </select></label>
            </div>
            <span className="date-caption"><CalendarDays size={14} />{fmtDate(start)} – {fmtDate(end)}</span>
          </div>

          {detail && (
            <div className="detail-banner">
              <div><strong>{detail} details</strong><p>Filtered records for the selected period. Choose Overview to return to analytics.</p></div>
              <button className="btn-secondary" onClick={() => openDetail("Overview")}><Eye size={15} /> Back to overview</button>
            </div>
          )}

          <div className="section-title"><span className="section-icon"><Activity size={16} /></span><h2>Performance at a glance</h2><span className="section-line" /></div>
          <div className="metrics-grid">
            <MetricCard title="Total leads" value={leadStats.total} change={pct(leadStats.total, prevLeadStats.total)} icon={Users} color="violet" onClick={() => openDetail("Leads")} />
            <MetricCard title="Qualified leads" value={leadStats.qualified} change={pct(leadStats.qualified, prevLeadStats.qualified)} icon={CheckCircle2} color="cyan" onClick={() => openDetail("Leads")} />
            <MetricCard title="Converted leads" value={leadStats.converted} change={pct(leadStats.converted, prevLeadStats.converted)} icon={TrendingUp} color="green" onClick={() => openDetail("Leads")} />
            <MetricCard title="Unqualified leads" value={leadStats.unqualified} change={pct(leadStats.unqualified, filtered.previous.leads.filter(x => x.status === "Unqualified").length)} icon={XCircle} color="rose" onClick={() => openDetail("Leads")} />
            <MetricCard title="Lead conversion" value={`${leadStats.conversion.toFixed(1)}%`} change={pct(leadStats.conversion, filtered.previous.leads.length ? prevLeadStats.converted / filtered.previous.leads.length * 100 : 0)} icon={Target} color="amber" />
            <MetricCard title="Quotations" value={filtered.quotations.length} change={pct(filtered.quotations.length, filtered.previous.quotations.length)} icon={FileText} color="cyan" onClick={() => openDetail("Quotations")} />
            <MetricCard title="Deals created" value={filtered.deals.length} change={pct(filtered.deals.length, filtered.previous.deals.length)} icon={BriefcaseBusiness} color="violet" onClick={() => openDetail("Deals & Revenue")} />
            <MetricCard title="Orders created" value={filtered.orders.length} change={pct(filtered.orders.length, filtered.previous.orders.length)} icon={ShoppingCart} color="green" onClick={() => openDetail("Orders & Payments")} />
          </div>

          <div className="section-title"><span className="section-icon"><TrendingUp size={16} /></span><h2>Lead analytics</h2><span className="section-line" /></div>
          <div className="charts-grid charts-leads">
            <Panel title="Lead generation trend" subtitle="Daily leads and conversions" className="span-2">
              <div className="chart-legend"><span><i className="legend-dot indigo" /> Leads</span><span><i className="legend-dot cyan" /> Qualified</span><span><i className="legend-dot green" /> Converted</span></div>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrend}>
                    <defs>
                      <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity={0.28} /><stop offset="100%" stopColor="#818cf8" stopOpacity={0} /></linearGradient>
                      <linearGradient id="qualifiedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.15} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="#253148" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#8491a8", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={28} />
                    <YAxis tick={{ fill: "#8491a8", fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                    <Tooltip contentStyle={{ background: "#111b2d", border: "1px solid #2c3a52", borderRadius: 10, color: "#f8fafc" }} />
                    <Area type="monotone" dataKey="leads" stroke="#818cf8" strokeWidth={2.5} fill="url(#leadFill)" />
                    <Area type="monotone" dataKey="qualified" stroke="#22d3ee" strokeWidth={2} fill="url(#qualifiedFill)" />
                    <Area type="monotone" dataKey="converted" stroke="#34d399" strokeWidth={2} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Lead funnel" subtitle="From acquisition to conversion">
              <div className="funnel-stats">
                {funnelData.map((item, i) => (
                  <div className="funnel-row" key={item.name}>
                    <span className="funnel-color" style={{ background: item.fill }} />
                    <span>{item.name}</span><strong>{item.value}</strong>
                    <small>{leadStats.total ? `${(item.value / leadStats.total * 100).toFixed(0)}%` : "0%"}</small>
                  </div>
                ))}
              </div>
              <div className="chart-area funnel-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip contentStyle={{ background: "#111b2d", border: "1px solid #2c3a52", borderRadius: 10, color: "#f8fafc" }} />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      <LabelList position="center" fill="#08111f" stroke="none" dataKey="name" fontSize={11} fontWeight={600} />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Lead sources" subtitle="Where your leads come from">
              <div className="source-chart">
                <div className="donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="88%" paddingAngle={4} stroke="none">
                        {sourceData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#111b2d", border: "1px solid #2c3a52", borderRadius: 10, color: "#f8fafc" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-center"><strong>{leadStats.total}</strong><span>leads</span></div>
                </div>
                <div className="source-legend">
                  {sourceData.map((item, i) => (
                    <div key={item.name}><span><i style={{ background: COLORS[i % COLORS.length] }} />{item.name}</span><strong>{item.value}<small>{leadStats.total ? ` · ${(item.value / leadStats.total * 100).toFixed(0)}%` : ""}</small></strong></div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          <div className="section-title"><span className="section-icon"><FileText size={16} /></span><h2>Quotation analytics</h2><span className="section-line" /></div>
          <div className="charts-grid quotation-grid">
            <Panel title="Quotation value by service" subtitle="Total quoted amount">
              <div className="service-bars">
                {quotationServices.slice(0, 6).map((s, i) => (
                  <div className="service-bar-row" key={s.name}>
                    <div className="service-bar-label"><span>{s.name}</span><strong>{shortMoney(s.value)}</strong></div>
                    <div className="progress-track"><span style={{ width: `${Math.max(2, s.value / (quotationServices[0]?.value || 1) * 100)}%`, background: COLORS[i % COLORS.length] }} /></div>
                    <small>{s.count} quotations · {s.accepted} accepted</small>
                  </div>
                ))}
                {!quotationServices.length && <p className="empty-state">No quotations in this period.</p>}
              </div>
            </Panel>

            <Panel title="Quotation status" subtitle="Current quote outcomes">
              <div className="status-summary">
                {["Accepted", "Pending", "Rejected"].map((status, i) => {
                  const value = filtered.quotations.filter(q => q.status === status).length;
                  return <div key={status} className="status-summary-row"><span className={`status-icon status-icon-${i}`}><CheckCircle2 size={16} /></span><span>{status}</span><strong>{value}</strong><div className="mini-track"><i style={{ width: `${filtered.quotations.length ? value / filtered.quotations.length * 100 : 0}%`, background: COLORS[i] }} /></div></div>;
                })}
              </div>
              <div className="conversion-box"><span>Quote-to-deal conversion</span><strong>{filtered.quotations.length ? (filtered.deals.length / filtered.quotations.length * 100).toFixed(1) : "0.0"}%</strong><small>{filtered.deals.length} deals / {filtered.quotations.length} quotations</small></div>
            </Panel>

            <Panel title="Service-wise quotation details" subtitle={`${filtered.quotations.length} quotations`} className="span-2">
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Service</th><th>Quotes</th><th>Quoted value</th><th>Accepted</th><th>Pending</th><th>Status</th></tr></thead>
                  <tbody>
                    {quotationServices.slice(0, 7).map(s => (
                      <tr key={s.name}><td><strong>{s.name}</strong></td><td>{s.count}</td><td>{money(s.value)}</td><td className="positive">{s.accepted}</td><td>{filtered.quotations.filter(q => q.service === s.name && q.status === "Pending").length}</td><td><StatusBadge>{s.accepted ? "Accepted" : "Pending"}</StatusBadge></td></tr>
                    ))}
                    {!quotationServices.length && <tr><td colSpan={6} className="empty-state">No quotation data for these filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              <button className="text-action" onClick={() => openDetail("Quotations")}>View all quotations <ArrowUpRight size={14} /></button>
            </Panel>
          </div>

          <div id="revenue-section" className="section-title"><span className="section-icon"><CircleDollarSign size={16} /></span><h2>Deals & revenue</h2><span className="section-line" /></div>
          <div className="charts-grid revenue-grid">
            <Panel title="Revenue by service" subtitle="Deal value distribution" className="span-2">
              <div className="revenue-bars">
                {revenueServices.slice(0, 6).map((s, i) => (
                  <div className="revenue-bar-row" key={s.name}>
                    <span className="revenue-bar-name">{s.name}</span>
                    <div className="progress-track"><span style={{ width: `${Math.max(2, s.value / (revenueServices[0]?.value || 1) * 100)}%`, background: COLORS[i % COLORS.length] }} /></div>
                    <strong>{shortMoney(s.value)}</strong>
                  </div>
                ))}
                {!revenueServices.length && <p className="empty-state">No deals in this period.</p>}
              </div>
            </Panel>

            <Panel title="Daily revenue trend" subtitle="Deal value vs. payments received" className="span-2">
              <div className="chart-legend"><span><i className="legend-dot indigo" /> Deal revenue</span><span><i className="legend-dot green" /> Collected</span></div>
              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrend}>
                    <CartesianGrid stroke="#253148" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#8491a8", fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={28} />
                    <YAxis tick={{ fill: "#8491a8", fontSize: 10 }} tickLine={false} axisLine={false} width={45} tickFormatter={shortMoney} />
                    <Tooltip formatter={(v) => money(v)} contentStyle={{ background: "#111b2d", border: "1px solid #2c3a52", borderRadius: 10, color: "#f8fafc" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={2.5} fill="#818cf8" fillOpacity={0.12} />
                    <Area type="monotone" dataKey="collected" stroke="#34d399" strokeWidth={2} fill="#34d399" fillOpacity={0.08} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Priority breakdown" subtitle="Deals by priority">
              <div className="priority-list">
                {priorities.map((p, i) => (
                  <div className="priority-row" key={p.name}>
                    <span className={`priority-dot priority-${p.name.toLowerCase()}`} />
                    <div className="priority-main"><div><span>{p.name}</span><strong>{p.deals} deals</strong></div><div className="progress-track"><span style={{ width: `${filtered.deals.length ? p.deals / filtered.deals.length * 100 : 0}%`, background: ["#fb7185", "#fbbf24", "#34d399"][i] }} /></div></div>
                    <strong>{shortMoney(p.revenue)}</strong>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Revenue summary" subtitle="Financial overview">
              <div className="finance-card total">
                <div className="finance-icon"><Wallet size={19} /></div>
                <div><span>Total deal value</span><strong>{money(revenue)}</strong><small>{filtered.deals.length} deals created</small></div>
              </div>
              <div className="finance-card collected">
                <div className="finance-icon"><CheckCircle2 size={19} /></div>
                <div><span>Net collected</span><strong>{money(collected)}</strong><small>{filtered.payments.length} payment records</small></div>
              </div>
              <div className="finance-card outstanding">
                <div className="finance-icon"><Clock3 size={19} /></div>
                <div><span>Outstanding balance</span><strong>{money(outstanding)}</strong><small>Deal value minus collections</small></div>
              </div>
              <div className="collection-track"><span style={{ width: `${revenue ? Math.min(100, collected / revenue * 100) : 0}%` }} /></div>
              <div className="collection-caption"><span>Collection rate</span><strong>{revenue ? (collected / revenue * 100).toFixed(1) : "0.0"}%</strong></div>
            </Panel>
          </div>

          <div className="section-title"><span className="section-icon"><ShoppingCart size={16} /></span><h2>Orders & operations</h2><span className="section-line" /></div>
          <div className="charts-grid operations-grid">
            <Panel title="Order status" subtitle="Orders by progress">
              <div className="order-total"><strong>{filtered.orders.length}</strong><span>total orders</span></div>
              <div className="order-status-list">
                {orderStatuses.map((o, i) => <div key={o.name} className="order-status-row"><span><i style={{ background: COLORS[i] }} />{o.name}</span><strong>{o.value}</strong><div className="mini-track"><i style={{ width: `${filtered.orders.length ? o.value / filtered.orders.length * 100 : 0}%`, background: COLORS[i] }} /></div></div>)}
              </div>
              <div className="completion-note"><CheckCircle2 size={16} /><span>{orderStatuses.find(x => x.name === "Completed")?.value || 0} orders completed in this period</span></div>
            </Panel>

            <Panel title="Recent leads" subtitle="Latest incoming opportunities" className="span-2">
              <div className="table-toolbar">
                <label className="search-box"><Search size={15} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads, company, ID..." /></label>
                <button className="btn-secondary" onClick={() => { setSearch(""); setSource("All Sources"); }}><RefreshCw size={14} /> Reset</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Created</th><th>Status</th><th /></tr></thead>
                  <tbody>
                    {recentLeads.map(l => <tr key={l.id}>
                      <td><div className="person-cell"><span className="person-avatar">{l.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span><div><strong>{l.name}</strong><small>{l.id}</small></div></div></td>
                      <td>{l.company}</td><td>{l.source}</td><td>{fmtDate(l.createdAt)}</td><td><StatusBadge>{l.status}</StatusBadge></td>
                      <td><button className="row-action" title="View lead" onClick={() => setDetail("Leads")}><Eye size={15} /></button></td>
                    </tr>)}
                    {!recentLeads.length && <tr><td colSpan={6} className="empty-state">No leads match your filters.</td></tr>}
                  </tbody>
                </table>
              </div>
              <button className="text-action" onClick={() => openDetail("Leads")}>Explore lead analytics <ArrowUpRight size={14} /></button>
            </Panel>

            <Panel title="Recent activity" subtitle="Latest updates across your workspace">
              <div className="activity-list">
                {recentActivity.map((item, i) => (
                  <div className="activity-item" key={`${item.record}-${i}`}>
                    <span className={`activity-icon activity-${i % 4}`}>{item.title.includes("Payment") ? <CreditCard size={15} /> : item.title.includes("Quotation") ? <FileText size={15} /> : item.title.includes("Deal") ? <BriefcaseBusiness size={15} /> : <Users size={15} />}</span>
                    <div className="activity-text"><strong>{item.title}</strong><span>{item.person}</span><small>{item.record} · {fmtDate(item.date)}</small></div>
                    <StatusBadge>{item.status}</StatusBadge>
                  </div>
                ))}
                {!recentActivity.length && <p className="empty-state">No recent activity.</p>}
              </div>
            </Panel>
          </div>

          {detail && (
            <Panel title={`${detail} — filtered records`} subtitle="Select another section from the sidebar or return to overview." className="detail-table-panel">
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Record ID</th><th>Name / Service</th><th>Status</th><th>Date</th><th>Amount</th></tr></thead>
                  <tbody>
                    {detailRows.map((r) => <tr key={r.id}>
                      <td><strong>{r.id}</strong></td>
                      <td>{r.name || r.service || r.company || r.leadId}</td>
                      <td><StatusBadge>{r.status}</StatusBadge></td>
                      <td>{fmtDate(r.createdAt)}</td>
                      <td>{r.amount ? money(r.amount) : "—"}</td>
                    </tr>)}
                    {!detailRows.length && <tr><td colSpan={5} className="empty-state">No records available for this selection.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

          <footer className="footer"><span>© 2026 Pulse Analytics</span><span><span className="footer-dot" /> All systems operational</span><span>Demo dashboard · Sample data only</span></footer>
        </div>
      </div>
    </main>
  );
}
