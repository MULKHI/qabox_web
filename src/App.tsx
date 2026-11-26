import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleAlert, Code2, Command, Cpu, Download, ExternalLink,
  FileCode2, Github, Globe2, Layers3, Menu, Monitor, Play, ScanSearch,
  ShieldCheck, Sparkles, Terminal, X, Zap, LayoutDashboard, Folder, ListChecks,
  ClipboardList, Activity, Bot, Plug, Bug, Search, Filter, PanelLeft, Plus, MoreHorizontal,
  CircleCheck, Settings, Bell, UserRound, Pause, MousePointer2, Workflow, Globe, Smartphone, Mail,
} from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const asset = (path: string) => path;

type User = { name?: string; email?: string; [key: string]: unknown };
type AuthResult = { token?: string; access_token?: string; user?: User; data?: { token?: string; access_token?: string; user?: User }; [key: string]: unknown };

function readUser(): User | null {
  try { const raw = localStorage.getItem("qabox_user"); return raw ? JSON.parse(raw) as User : null; }
  catch { return null; }
}
function getToken(data: AuthResult) {
  return data.token || data.access_token || data.data?.token || data.data?.access_token || null;
}
function getUser(data: AuthResult): User {
  return data.user || data.data?.user || {};
}
function Brand({ compact = false }: { compact?: boolean }) {
  return <a className="brand" href="/" aria-label="QaBox home"><img src={asset("/qabox-logo.png")} alt="" /><span>QaBox</span>{!compact && <small>QA WORKSPACE</small>}</a>;
}
function ButtonLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <a className={secondary ? "button button-secondary" : "button"} href={href}>{children}</a>;
}
function Eyebrow({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" }) {
  return <div className={`eyebrow ${tone}`}><span />{children}</div>;
}
function Header({ active = "" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="nav-wrap">
    <Brand />
    <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? "main-nav open" : "main-nav"}>
      <a href="/#features" onClick={() => setOpen(false)}>Features</a>
      <a href="/#problem" onClick={() => setOpen(false)}>Why QaBox</a>
      <a href="/#workflow" onClick={() => setOpen(false)}>Workflow</a>
      <a href="/#desktop-preview" onClick={() => setOpen(false)}>Desktop app</a>
      <a className={active === "pricing" ? "active" : ""} href="/pricing">Pricing</a>
      <a className={active === "docs" ? "active" : ""} href="/docs">Docs</a>
    </nav>
    <div className="nav-actions"><a className="nav-signin" href="/sign-in">Sign in</a><ButtonLink href="/sign-up">Get started <ArrowUpRight size={15} /></ButtonLink></div>
  </div></header>;
}
function Footer() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div className="footer-brand"><Brand /><p>Vibe Coding for QA. Capture application context, prepare tests, connect AI agents, and review automation results with QaBox.</p><span className="footer-note"><i/> Built for teams who care about reliable software.</span></div>
    <div><h4>Product</h4><a href="/#features">Capabilities</a><a href="/#workflow">How it works</a><a href="/#desktop-preview">Desktop workspace</a><a href="/#download">Get QaBox</a><a href="/pricing">Access & pricing</a></div>
    <div><h4>Resources</h4><a href="/docs">Documentation</a><a href="/docs#quick-start">Quick start</a><a href="/docs#faq">Frequently asked questions</a><a href="/docs#automation">Automation guide</a></div>
    <div><h4>Get in touch</h4><a href="mailto:hello@qabox.id">hello@qabox.id</a><a href="mailto:hello@qabox.id?subject=QaBox%20Product%20Question">Product questions</a><a href="mailto:hello@qabox.id?subject=QaBox%20Feedback">Send feedback</a></div>
  </div><div className="footer-bottom container"><span>© {new Date().getFullYear()} QaBox. All rights reserved.</span><span><a href="/docs#privacy">Privacy</a><i/> <a href="/docs#terms">Terms</a><i/> VIBE CODING FOR QA</span></div></footer>;
}
function PageFrame({ children, active = "" }: { children: ReactNode; active?: string }) {
  return <><Header active={active} />{children}<Footer /></>;
}
function SectionHeading({ tag, title, text, center = false }: { tag: string; title: ReactNode; text?: string; center?: boolean }) {
  return <div className={center ? "section-heading center" : "section-heading"}><Eyebrow>{tag}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

const downloadTargets = [
  { os: "Windows", label: "Windows 10 / 11", detail: "64-bit installer", ext: ".exe", icon: Monitor },
  { os: "macOS", label: "Apple Silicon & Intel", detail: "M-series and Intel Macs", ext: ".dmg", icon: Cpu },
  { os: "Linux", label: "Linux distributions", detail: "64-bit package", ext: ".AppImage · .deb", icon: Terminal },
];
const faqs = [
  ["How do I scan a web application?", "Choose Single Page Scan, Manual Record, bounded Auto Crawl, or AI Auto Scan in the Extension. Desktop stages the Application Knowledge bundle, then you select the destination Project and Scan folder before import."],
  ["Can QaBox scan Android applications?", "Yes. QaBox Desktop includes a mobile scanning workflow for Android devices connected over USB."],
  ["How can I create test cases?", "Create test cases manually, use AI-assisted generation, or import test case data from a supported JSON file."],
  ["What does the QaBox MCP server do?", "The local QaBox MCP server exposes supported QA resources and tools. In AI Auto Scan, the agent coordinates with Desktop Bridge and the Extension; the Extension performs browser actions while the agent handles reasoning."],
  ["Which AI agents can I connect?", "Current workflows include Claude, OpenCode, Qwen, and Cursor through MCP-compatible client setups. Exact connection steps depend on the client."],
  ["Does QaBox automatically explore every page?", "No. Auto Crawl is bounded to the configured application scope. AI Auto Scan also follows supported browser actions and safety limits; it is not unrestricted browsing."],
  ["Can I run and review automation?", "Yes. Test runners execute scripts, Reporter integrations return results and evidence, and AI Bug Analysis helps investigate failures with reproduction steps and a structured technical report."],
  ["Where can I get the desktop app?", "Installer links are not published on this website yet. Contact the QaBox team for current access and release information."]
];


const desktopPreviewFeatures = [
  { id: "scan", label: "Scans", icon: Folder, title: "Scan Manager", description: "Browse scan folders, inspect Application Knowledge packages, and preview captured files.", points: ["Folder-based scan organization", "Application Knowledge imports from Extension", "File details and content preview"] },
  { id: "cases", label: "Test Cases", icon: ListChecks, title: "Test Case Management", description: "Select a Test Suite, search and filter cases, then inspect their priority, severity, status, and automation type.", points: ["Test Suites in the sidebar", "Search and multi-filter controls", "Structured test case table"] },
  { id: "plans", label: "Test Plans", icon: ClipboardList, title: "Test Plan Library", description: "Create reusable collections of test cases across the suites in a project.", points: ["Searchable plan library", "Case counts and update dates", "Plan details with included cases and run history"] },
  { id: "runs", label: "Test Runs", icon: Activity, title: "Test Runner", description: "Create runs, review execution cards, and open detailed run results.", points: ["New Run workflow", "Search and execution filters", "Run status and result summaries"] },
  { id: "studio", label: "AI Studio", icon: Code2, title: "Code Workspace", description: "Work in the built-in editor with a file explorer, editor tabs, and integrated terminal.", points: ["Workspace file tree and code editor", "Terminal and source-control tools", "Optional AI assistant panel"] },
  { id: "bugs", label: "Bug Analysis", icon: Bug, title: "Scan Bug Report", description: "Upload a supported test report, choose its framework, and review previous analyses.", points: ["Framework selection and JSON upload", "Run Bug Analysis action", "Recent analysis history"] },
];

const desktopNavItems = [
  ["Projects", LayoutDashboard],
  ["Scans", Folder],
  ["Test Cases", ListChecks],
  ["Shared steps", Workflow],
  ["Test Plans", ClipboardList],
  ["Test Runs", Activity],
  ["AI Studio", Bot],
  ["Integration", Plug],
  ["Bug Analysis", Bug],
] as const;

function DesktopPrototype() {
  const [active, setActive] = useState("scan");
  const selected = desktopPreviewFeatures.find((item) => item.id === active) || desktopPreviewFeatures[0];
  const FeatureIcon = selected.icon;
  const screenTitle = active === "scan" ? "Scans" : active === "cases" ? "Test Cases" : active === "plans" ? "Test Plans" : active === "runs" ? "Test Runs" : active === "studio" ? "AI Studio" : "Bug Analysis";
  const screenSubtitle = active === "scan" ? "Scan Manager" : active === "cases" ? "Test Case Management" : active === "plans" ? "Plan & Organize Test Execution" : active === "runs" ? "Run & Monitor Tests" : active === "studio" ? "VibeQA · Vibe Coding" : "Scan Bug Report";
  return <section className="desktop-showcase section" id="desktop-preview">
    <div className="container">
      <div className="showcase-heading">
        <div><Eyebrow>PRODUCT PREVIEW</Eyebrow><h2>Preview · <span className="text-accent">QaBox Desktop App</span></h2><p>Explore the actual workspace structure: the page header, navigation, suite and folder panels, and the tools used across the QA lifecycle.</p></div>
        <span className="preview-platform"><Monitor size={14}/> DESKTOP WORKSPACE</span>
      </div>
      <div className="product-preview-layout">
        <div className="preview-window">
          {active !== "studio" && <div className="preview-window-bar"><div className="window-dots"><i/><i/><i/></div><span className="desktop-app-title"><img src="/qabox-logo.png" alt=""/> QaBox <small>Desktop</small></span><span className="preview-window-label">SAMPLE PROJECT · UI PREVIEW</span></div>}
          <div className={active === "studio" ? "preview-app-body preview-studio-mode" : "preview-app-body"}>
            {active === "studio" ? <>
              <div className="preview-studio-header"><div><span className="preview-studio-mark"><Sparkles size={16}/></span><div><b>AI Studio <small>CODE WORKSPACE</small></b><em>VibeQA · Vibe Coding</em></div></div><span className="preview-opencode-connected"><span className="opencode-live-dot"/> OpenCode Agent <i>MCP CONNECTED</i></span><button><ArrowLeft size={12}/> Back to Scans</button></div>
              <div className="preview-editor-toolbar"><span><PanelLeft size={12}/> Explorer</span><span><Search size={12}/> Search</span><span><Workflow size={12}/> Source Control</span><span className="active"><Terminal size={12}/> Terminal</span><span className="editor-toolbar-spacer"/><span>⌘ P</span></div>
              <div className="preview-editor-layout"><aside className="preview-file-tree"><small>EXPLORER</small><b><ChevronDown size={11}/> QA PROJECT</b><span><ChevronDown size={11}/> src</span><span className="file-active"><FileCode2 size={11}/> checkout.spec.ts</span><span><FileCode2 size={11}/> login.spec.ts</span><span><FileCode2 size={11}/> payment.helper.ts</span><span><ChevronRight size={11}/> tests</span><span><ChevronRight size={11}/> fixtures</span><span><FileCode2 size={11}/> package.json</span><span><FileCode2 size={11}/> playwright.config.ts</span></aside><div className="preview-code-area"><div className="preview-editor-tabs"><span className="selected"><FileCode2 size={11}/> checkout.spec.ts <i>×</i></span><span><FileCode2 size={10}/> login.spec.ts</span><span><FileCode2 size={10}/> payment.helper.ts</span></div><div className="preview-code-lines">
                <span><i>1</i><code><b>import</b> {'{'} test, expect {'}'} <b>from</b> <em>'@playwright/test'</em>;</code></span>
                <span><i>2</i><code><b>import</b> {'{'} login {'}'} <b>from</b> <em>'./helpers/auth'</em>;</code></span>
                <span><i>3</i><code><b>import</b> {'{'} addToCart {'}'} <b>from</b> <em>'./helpers/cart'</em>;</code></span>
                <span><i>4</i></span>
                <span><i>5</i><code><em>// Checkout regression scenarios</em></code></span>
                <span><i>6</i><code>test.describe(<em>'Checkout flow'</em>, () =&gt; {'{'}</code></span>
                <span><i>7</i><code>  test.beforeEach(<b>async</b> ({'{'} page {'}'}) =&gt; {'{'}</code></span>
                <span><i>8</i><code>    <b>await</b> login(page, <em>'qa.user@example.test'</em>);</code></span>
                <span><i>9</i><code>    <b>await</b> addToCart(page, <em>'SKU-1042'</em>);</code></span>
                <span><i>10</i><code>    <b>await</b> page.goto(<em>'/checkout'</em>);</code></span>
                <span><i>11</i><code>  {'}'});</code></span>
                <span><i>12</i></span>
                <span><i>13</i><code>  test(<em>'completes payment with valid card'</em>, <b>async</b> ({'{'} page {'}'}) =&gt; {'{'}</code></span>
                <span><i>14</i><code>    <b>await</b> page.getByLabel(<em>'Card number'</em>).fill(<em>'4242 4242 4242 4242'</em>);</code></span>
                <span><i>15</i><code>    <b>await</b> page.getByRole(<em>'button'</em>, {'{'} name: <em>'Pay now'</em> {'}'}).click();</code></span>
                <span><i>16</i><code>    <b>await</b> expect(page.getByText(<em>'Order confirmed'</em>)).toBeVisible();</code></span>
                <span><i>17</i><code>  {'}'});</code></span>
                <span><i>18</i><code>{'}'});</code></span>
              </div><div className="preview-editor-breadcrumb"><span>checkout.spec.ts</span><span>TypeScript</span><span>18 lines</span></div></div></div>
              <div className="preview-terminal preview-opencode-terminal">
                <div className="preview-terminal-tabs">
                  <span className="active"><Terminal size={11}/> TERMINAL</span>
                  <span>AGENT SESSION</span>
                  <span>OUTPUT</span>
                  <span className="terminal-actions"><span className="opencode-terminal-badge"><span className="opencode-live-dot"/> OPENCODE</span><MoreHorizontal size={12}/></span>
                </div>
                <div className="opencode-session-heading">
                  <div className="opencode-session-identity"><span className="opencode-brand-icon"><Bot size={12}/></span><span><b>OpenCode</b><small>build agent · qa-project</small></span></div>
                  <span className="opencode-session-status"><span className="opencode-live-dot"/> Connected to QaBox MCP</span>
                </div>
                <div className="opencode-conversation">
                  <div className="opencode-meta-line">SESSION 01 <span>·</span> Claude Sonnet <span>·</span> MCP tools enabled</div>
                  <div className="opencode-message opencode-user-message"><span className="opencode-message-label">YOU</span><p>Buatkan automation testing untuk checkout flow berdasarkan Application Knowledge dan test case yang tersedia.</p></div>
                  <div className="opencode-agent-message"><div className="opencode-agent-heading"><span className="opencode-agent-icon"><Bot size={10}/></span><b>OpenCode</b><span>Thinking</span></div><p>Saya akan membaca konteks aplikasi dan test case melalui QaBox MCP, lalu menyusun Playwright test.</p></div>
                  <div className="opencode-activity-group"><div className="opencode-activity-title">TOOL CALLS <span>2 completed</span></div><div className="opencode-tool-row"><code>qabox.get_application_knowledge</code><span className="opencode-tool-done">✓ completed</span></div><div className="opencode-tool-row"><code>qabox.list_test_cases</code><span className="opencode-tool-done">✓ 8 cases found</span></div></div>
                  <div className="opencode-agent-message opencode-agent-followup"><div className="opencode-agent-heading"><span className="opencode-agent-icon"><Bot size={10}/></span><b>OpenCode</b></div><p>Menemukan alur login, cart, coupon, dan pembayaran. Saya membuat suite checkout dari skenario tersebut.</p></div>
                  <div className="opencode-created-file"><FileCode2 size={12}/><span><b>checkout.spec.ts</b><small>tests/ · Playwright test file</small></span><em>CREATED</em></div>
                  <div className="opencode-result-row"><span className="opencode-result-check"><Check size={10}/></span><span><b>Automation generated & validated</b><small>Playwright execution completed</small></span><strong>4 PASSED</strong><em>6.8s</em></div>
                </div>
                <div className="opencode-input-bar"><span className="opencode-input-prompt">›</span><span>Ask OpenCode to make changes...</span><kbd>↵</kbd></div>
              </div>
              <div className="preview-editor-status"><span>QaBox Workspace</span><span>Ln 7, Col 42&nbsp;&nbsp; UTF-8&nbsp;&nbsp; TypeScript</span></div>
            </> : <>
              <div className="preview-real-header"><div className="preview-real-heading"><span className="preview-real-icon">{active === "scan" ? <Folder size={17}/> : active === "cases" ? <ListChecks size={17}/> : active === "plans" ? <ClipboardList size={17}/> : active === "runs" ? <Activity size={17}/> : <Bug size={17}/>}</span><div><b>{screenTitle}</b><small>{screenSubtitle}</small></div></div><div className="preview-header-actions"><span><Bell size={15}/></span><span><UserRound size={15}/></span></div></div>
              <div className="preview-workspace">
                <aside className="preview-sidebar">
                  <div className="preview-nav-list">{desktopNavItems.map(([name, Icon]) => {
                    const isActive = (active === "scan" && name === "Scans") || (active === "cases" && name === "Test Cases") || (active === "plans" && name === "Test Plans") || (active === "runs" && name === "Test Runs") || (active === "bugs" && name === "Bug Analysis");
                    return <div key={name} className={isActive ? "preview-nav-item active" : name === "Shared steps" ? "preview-nav-item disabled" : "preview-nav-item"}><Icon size={15}/><span>{name}</span></div>;
                  })}</div>
                  {active === "scan" && <div className="preview-sidebar-extra"><small>FOLDERS</small>{["Application Knowledge","Authentication","Checkout","Dashboard"].map((name,i)=><span key={name} className={i===0?"selected":""}><Folder size={12}/>{name}</span>)}</div>}
                  {active === "cases" && <div className="preview-sidebar-extra"><small>TEST SUITES <Plus size={12}/></small>{["Authentication","Checkout","User profile"].map((name,i)=><span key={name} className={i===0?"selected":""}><Folder size={12}/>{name}<i>{[12,8,6][i]}</i></span>)}</div>}
                  <div className="preview-sidebar-bottom"><Settings size={14}/> Settings</div>
                </aside>
                <main className="preview-main">
                  {active === "scan" && <div className="preview-scan-layout"><div className="preview-main-content"><div className="preview-content-heading"><div><h3>Application Knowledge</h3><p>Captured context from your application</p></div><span className="preview-status"><i/> READY</span></div><div className="preview-import-card"><div><Globe size={15}/></div><span><small>APPLICATION MANIFEST</small><b>Customer Portal</b><em>app.customer-portal.dev</em></span><i>v2</i></div><div className="preview-scan-summary"><span><b>08</b><small>Pages</small></span><span><b>24</b><small>Components</small></span><span><b>16</b><small>Behaviors</small></span></div><div className="preview-panel"><div className="preview-panel-heading"><b>Application files</b><span>12 files</span></div>{[["manifest.json","Application manifest","JSON"],["pages/dashboard.json","Page snapshot","JSON"],["pages/checkout.json","Page snapshot","JSON"],["components/payment.json","Component map","JSON"]].map(([file,meta,type])=><div className="preview-file-row" key={file}><FileCode2 size={12}/><span><b>{file}</b><small>{meta}</small></span><em>{type}</em></div>)}</div></div><aside className="preview-file-preview"><div><b>File Preview</b><X size={12}/></div><small>manifest.json</small><pre>{'{\n'}  <i>"application"</i>: <em>"Customer Portal"</em>,{ '\n'}  <i>"pages"</i>: <b>8</b>,{ '\n'}  <i>"components"</i>: <b>24</b>,{ '\n'}  <i>"behaviors"</i>: <b>16</b>{'\n}'}</pre><span><CheckCircle2 size={11}/> Application Knowledge</span></aside></div>}
                  {active === "cases" && <div className="preview-page-content"><div className="preview-content-heading"><div><h3>Authentication</h3><p>12 test cases · showing 8</p></div><span className="preview-primary-action"><Plus size={11}/> Create Case</span></div><div className="preview-search"><Search size={13}/> Search in Authentication...</div><div className="preview-filter-row"><span><Filter size={11}/> Filters</span><i>Priority: All</i><i>Severity: All</i><i>Status: All</i><i>Automation: All</i></div><div className="preview-data-table"><div className="preview-table-head"><span>ID</span><span>Test Title</span><span>Type</span><span>Priority</span><span>Severity</span><span>Status</span><span>Automation</span></div>{[["TC-001","Successful login with valid credentials","Functional","High","Major","ACTIVE","AUTOMATED"],["TC-002","Login fails with invalid password","Functional","High","Major","ACTIVE","AUTOMATED"],["TC-003","Session expires after inactivity","Security","Medium","Minor","ACTIVE","MANUAL"],["TC-004","User can log out successfully","Functional","Medium","Minor","ACTIVE","AUTOMATED"],["TC-005","Required fields show validation errors","Validation","High","Major","ACTIVE","MANUAL"],["TC-006","Password visibility can be toggled","UI","Low","Minor","DRAFT","MANUAL"],["TC-007","Account locks after repeated failures","Security","High","Critical","ACTIVE","AUTOMATED"],["TC-008","Remember me keeps user signed in","Functional","Medium","Major","DRAFT","MANUAL"]].map(row=><div className="preview-table-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><small>{row[2]}</small><em>{row[3]}</em><small>{row[4]}</small><small className={row[5]==="ACTIVE"?"good":"muted"}>{row[5]}</small><small>{row[6]}</small></div>)}</div></div>}
                  {active === "plans" && <div className="preview-page-content"><div className="preview-content-heading"><div><h3>Test Plan Library</h3><p>Create reusable collections of test cases across project suites.</p></div><span className="preview-primary-action"><Plus size={11}/> Create Test Plan</span></div><div className="preview-search"><Search size={13}/> Search test plans...</div><div className="preview-data-table"><div className="preview-table-head plans"><span>Plan</span><span>Test Cases</span><span>Last Updated</span><span>Action</span></div>{[["Sprint 12 Regression","18 cases","Nov 25"],["Checkout Smoke Test","8 cases","Nov 24"],["Authentication Suite","12 cases","Nov 22"]].map(row=><div className="preview-table-row plans" key={row[0]}><span><b>{row[0]}</b><small>Reusable test collection</small></span><small>{row[1]}</small><small>{row[2]}</small><em>View details →</em></div>)}</div></div>}
                  {active === "runs" && <div className="preview-run-detail">
                    <div className="preview-run-breadcrumb"><span>Test Runs</span><ChevronRight size={11}/><b>Checkout regression #RUN-024</b><span className="preview-run-actions"><i>Export JSON</i><i>Export CSV</i></span></div>
                    <div className="preview-run-detail-title"><div><small>TEST RUN · RUN-024</small><h3>Checkout regression</h3><p>Regression suite · Release candidate 1.8.0</p></div><span className="preview-run-status"><i/> COMPLETED</span></div>
                    <div className="preview-run-overview">
                      <section className="preview-run-status-panel"><div className="preview-run-status-top"><span><small>RUN STATUS</small><b><CheckCircle2 size={15}/> COMPLETED</b></span><span><small>DURATION</small><strong>2m 34s</strong></span></div><div className="preview-run-progress"><i/><i/><i/></div><div className="preview-run-metrics"><span><small>Passed</small><b className="pass">11</b></span><span><small>Failed</small><b className="fail">2</b></span><span><small>Skipped</small><b>1</b></span><span><small>Total</small><b>14</b></span></div></section>
                      <section className="preview-run-context"><small>EXECUTION CONTEXT</small><div><span><Code2 size={11}/> Framework</span><b>Playwright</b></div><div><span><Monitor size={11}/> Environment</span><b>Staging</b></div><div><span><Activity size={11}/> Started</span><b>Nov 26 · 14:32</b></div></section>
                    </div>
                    <div className="preview-results-heading"><div><b>Test Results</b><small>14 test cases executed in this run</small></div><span><Search size={11}/> Search results...</span></div>
                    <div className="preview-result-filters"><i className="selected">All (14)</i><i>Passed (11)</i><i className="failed">Failed (2)</i><i>Skipped (1)</i></div>
                    <div className="preview-result-list">
                      <div className="preview-result-item passed"><span className="result-state"><Check size={11}/></span><b>TC-CHK-001</b><span className="result-name">User can add product to cart</span><small>8.4s</small><em>PASSED</em></div>
                      <div className="preview-result-item failed"><span className="result-state"><CircleAlert size={11}/></span><b>TC-CHK-008</b><span className="result-name">Checkout with valid card details</span><small>12.7s</small><em>FAILED</em></div>
                      <div className="preview-result-error"><b><CircleAlert size={10}/> AssertionError</b><span>Expected order confirmation to be visible, but the element was not found.</span></div>
                      <div className="preview-result-item passed"><span className="result-state"><Check size={11}/></span><b>TC-CHK-009</b><span className="result-name">Apply valid discount coupon</span><small>5.2s</small><em>PASSED</em></div>
                      <div className="preview-result-item failed"><span className="result-state"><CircleAlert size={11}/></span><b>TC-CHK-012</b><span className="result-name">Declined payment shows error message</span><small>9.1s</small><em>FAILED</em></div>
                    </div>
                  </div>}
                  {active === "bugs" && <div className="preview-analysis-detail">
                    <div className="preview-analysis-breadcrumb"><span>Bug Analysis</span><ChevronRight size={11}/><b>Executive Summary · BA-018</b><span className="preview-analysis-actions"><i>Export JSON</i><i>Download Report</i></span></div>
                    <div className="preview-analysis-title"><div><small>AI BUG ANALYSIS · BA-018</small><h3>Checkout Flow — Failure Investigation</h3><p>Playwright report · Staging environment · Nov 26, 2026</p></div><span className="preview-analysis-complete"><CheckCircle2 size={11}/> ANALYSIS COMPLETE</span></div>
                    <div className="preview-analysis-metrics">
                      <div><small>TOTAL TESTS</small><b>24</b><span>Test cases analyzed</span></div>
                      <div><small>RISK SCORE</small><b className="risk">HIGH</b><span>Requires attention</span></div>
                      <div><small>PASSED</small><b className="pass">19</b><span>79.2% success rate</span></div>
                      <div><small>FAILED</small><b className="fail">5</b><span>Potential defects found</span></div>
                    </div>
                    <section className="preview-analysis-ai"><div className="preview-analysis-section-title"><span><Sparkles size={12}/></span><b>AI Analysis & Key Findings</b><em>GENERATED INSIGHTS</em></div><p>The checkout flow shows recurring failures during order confirmation. The evidence suggests a possible state synchronization issue after payment submission, causing the confirmation component to render before the order response is available.</p><div className="preview-analysis-insight"><CircleAlert size={11}/><span><b>Primary concern</b> — Order confirmation is intermittently missing after a successful payment response.</span></div></section>
                    <div className="preview-analysis-lower">
                      <section className="preview-analysis-distribution"><div className="preview-analysis-section-title"><b>Failure Distribution</b><small>5 failed tests</small></div><div className="preview-analysis-bar-row"><span>Logic</span><div><i style={{width:"80%"}}/></div><b>4</b></div><div className="preview-analysis-bar-row"><span>Timeout</span><div><i className="timeout" style={{width:"40%"}}/></div><b>2</b></div><div className="preview-analysis-bar-row"><span>Network</span><div><i className="network" style={{width:"20%"}}/></div><b>1</b></div></section>
                      <section className="preview-analysis-summary"><div className="preview-analysis-section-title"><b>Recommended Focus</b></div><ul><li>Verify payment response handling</li><li>Check order confirmation state updates</li><li>Review asynchronous UI rendering</li></ul></section>
                    </div>
                    <section className="preview-analysis-bugs"><div className="preview-analysis-section-title"><b>Identified Bugs</b><small>3 findings · sample report</small></div>
                      <div className="preview-analysis-bug-row"><span>BUG-018</span><div><b>Order confirmation not displayed</b><small>Checkout · Payment success flow</small></div><em className="high">HIGH</em><ChevronRight size={12}/></div>
                      <div className="preview-analysis-bug-detail"><div><b><Sparkles size={10}/> ROOT CAUSE HYPOTHESIS</b><p>UI state may update before the order creation response has completed.</p></div><div><b><Activity size={10}/> REPRODUCTION</b><p>Submit valid card details, wait for payment success, then observe the confirmation view.</p></div><div><b><CheckCircle2 size={10}/> EXPECTED VS ACTUAL</b><p>Expected: confirmation and order ID appear. Actual: confirmation component remains unavailable.</p></div></div>
                      <div className="preview-analysis-bug-row"><span>BUG-019</span><div><b>Discount total not refreshed</b><small>Cart · Coupon recalculation</small></div><em className="medium">MEDIUM</em><ChevronRight size={12}/></div>
                      <div className="preview-analysis-bug-row"><span>BUG-020</span><div><b>Payment error message delayed</b><small>Checkout · Declined payment</small></div><em className="low">LOW</em><ChevronRight size={12}/></div>
                    </section>
                    <div className="preview-analysis-footer"><span>AI-generated findings are suggestions and should be validated by QA.</span><i><Download size={10}/> Export report</i></div>
                  </div>}
                </main>
              </div>
            </>}
          </div>
        </div>
        <aside className="preview-feature-panel">
          <div className="preview-feature-kicker">EXPLORE DESKTOP SCREENS</div>
          <div className="preview-feature-tabs">{desktopPreviewFeatures.map((item,index)=>{const I=item.icon;return <button key={item.id} className={active===item.id?"preview-feature-tab active":"preview-feature-tab"} onClick={()=>setActive(item.id)}><span className="preview-feature-number">0{index+1}</span><I size={16}/><b>{item.label}</b><ChevronRight size={14}/></button>;})}</div>
          <div className="preview-feature-detail" key={selected.id}><span className="preview-feature-icon"><FeatureIcon size={19}/></span><h3>{selected.title}</h3><p>{selected.description}</p><ul>{selected.points.map(point=><li key={point}><CheckCircle2 size={13}/>{point}</li>)}</ul></div>
          <div className="preview-footnote">UI structure follows the current QaBox Desktop FE. Sample names and records are illustrative.</div>
        </aside>
      </div>
    </div>
  </section>;
}
function WorkflowMarquee() {
  const stages = ["Capture real application behavior", "Organize Application Knowledge", "Prepare test cases and automation", "Run tests and investigate failures"];
  return <div className="workflow-marquee" aria-label="QaBox workflow">
    <div className="workflow-marquee-track">
      {[0, 1].map((copy) => <div className="workflow-marquee-group" key={copy} aria-hidden={copy === 1}>
        {stages.map((stage, index) => <span className="workflow-marquee-item" key={stage}><i>0{index + 1}</i>{stage}<b>↗</b></span>)}
      </div>)}
    </div>
  </div>;
}


function FailureInvestigationDemo() {
  const [activeTab, setActiveTab] = useState<"overview" | "root" | "repro">("overview");
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "root" as const, label: "Root cause", icon: Search },
    { id: "repro" as const, label: "Reproduction", icon: ListChecks },
  ];
  return <div className="failure-demo-window">
    <div className="failure-demo-topbar"><span><i/><i/><i/></span><b><Bug size={13}/> BUG ANALYSIS / BA-018</b><small>ILLUSTRATIVE REPORT</small></div>
    <div className="failure-demo-content">
      <div className="failure-demo-heading"><div><small>CHECKOUT FLOW · REGRESSION RUN</small><h3>Failure investigation</h3><p>Playwright · Staging environment · Sample data</p></div><span><CircleAlert size={11}/> REVIEW REQUIRED</span></div>
      <div className="failure-demo-tabs" role="tablist" aria-label="Failure investigation views">
        {tabs.map(({id,label,icon:Icon})=><button type="button" role="tab" key={id} aria-selected={activeTab===id} className={activeTab===id?"active":""} onClick={()=>setActiveTab(id)}><Icon size={12}/>{label}</button>)}
      </div>
      {activeTab === "overview" && <div className="failure-demo-panel" role="tabpanel">
        <div className="failure-demo-stats"><div><small>TESTED</small><b>24</b><span>test cases</span></div><div><small>PASSED</small><b className="pass">19</b><span>79.2% success</span></div><div><small>FAILED</small><b className="fail">05</b><span>20.8% failed</span></div><div><small>RISK LEVEL</small><b className="risk">HIGH</b><span>review needed</span></div></div>
        <div className="failure-demo-overview-grid"><section><div className="failure-demo-subhead"><b>Key finding</b><span>01 / 03</span></div><h4>Payment confirmation is not displayed</h4><p>The checkout flow remains on the payment step after submission. The available trace shows that the expected confirmation element was not found.</p><div className="failure-demo-callout"><CircleAlert size={12}/><span><b>Primary concern</b> — The order confirmation may not be rendered after payment submission.</span></div></section><section className="failure-demo-distribution"><div className="failure-demo-subhead"><b>Failure distribution</b><span>5 failures</span></div>{[["Timeout",3,"68%"],["Assertion",1,"42%"],["Network",1,"42%"]].map(([label,count,width])=><div className="failure-demo-bar" key={String(label)}><span>{label}</span><i><b style={{width:String(width)}}/></i><em>{count}</em></div>)}</section></div>
      </div>}
      {activeTab === "root" && <div className="failure-demo-panel failure-demo-root" role="tabpanel">
        <div className="failure-demo-hypothesis"><span><Sparkles size={13}/> AI-GENERATED HYPOTHESIS</span><b>Possible state synchronization issue</b><p>The UI may attempt to display the confirmation view before the order creation response has completed. This could explain why the expected element is missing in the captured result.</p></div>
        <div className="failure-demo-evidence"><b>Evidence to review</b><div><CheckCircle2 size={12}/><span>Assertion output: confirmation element not found</span></div><div><CheckCircle2 size={12}/><span>Execution trace: failure occurs after payment submission</span></div><div><CheckCircle2 size={12}/><span>Related scenario: checkout with valid card details</span></div></div>
        <div className="failure-demo-validation"><ShieldCheck size={13}/><span><b>QA validation required</b> — Inspect the network response, order state, and UI render timing before confirming the cause.</span></div>
      </div>}
      {activeTab === "repro" && <div className="failure-demo-panel failure-demo-repro" role="tabpanel">
        <div className="failure-demo-subhead"><b>Reproduction steps</b><span>Sample scenario · TC-CHK-008</span></div>
        <ol><li><i>01</i><span>Open the checkout page and add an available product to the cart.</span></li><li><i>02</i><span>Continue to payment and enter valid card details in the staging environment.</span></li><li><i>03</i><span>Select <b>Place order</b> and wait for the payment response.</span></li><li><i>04</i><span>Observe whether the order confirmation and order ID are displayed.</span></li></ol>
        <div className="failure-demo-expected"><div><small>EXPECTED RESULT</small><p>Confirmation view appears with the new order ID.</p></div><div><small>OBSERVED IN SAMPLE REPORT</small><p>Confirmation element was not found; checkout remains on the payment step.</p></div></div>
      </div>}
      <div className="failure-demo-footer"><span><ShieldCheck size={11}/> AI findings are suggestions, not confirmed defects.</span><b>QA REVIEW REQUIRED</b></div>
    </div>
  </div>;
}

function AiStudioInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"agent" | "knowledge" | "test">("agent");
  const tabs = [
    { id: "agent" as const, label: "Agent chat", icon: Bot },
    { id: "knowledge" as const, label: "Knowledge", icon: Folder },
    { id: "test" as const, label: "Generated test", icon: Code2 },
  ];
  return <div className="ai-demo-shell">
    <div className="ai-demo-windowbar"><span className="ai-demo-dots"><i/><i/><i/></span><span>qabox / ai-studio / checkout</span><span className="ai-demo-connection"><i/> MCP CONNECTED</span></div>
    <div className="ai-demo-toolbar"><div><span className="ai-demo-project-icon"><Layers3 size={14}/></span><span><b>Customer Portal</b><small>PROJECT WORKSPACE</small></span></div><span className="ai-demo-branch">main</span></div>
    <div className="ai-demo-tabs" role="tablist" aria-label="AI Studio demo views">
      {tabs.map(({id,label,icon:Icon})=><button type="button" role="tab" key={id} aria-selected={activeTab===id} className={activeTab===id?"active":""} onClick={()=>setActiveTab(id)}><Icon size={13}/>{label}</button>)}
    </div>
    <div className="ai-demo-content" role="tabpanel">
      {activeTab==="agent"&&<div className="ai-demo-chat">
        <div className="ai-demo-context-chip"><Folder size={12}/> Checkout · Application Knowledge <span>SELECTED</span></div>
        <div className="ai-demo-message ai-demo-user"><small>YOU</small><p>Create Playwright automation for checkout using the linked test cases and captured application context.</p></div>
        <div className="ai-demo-message ai-demo-assistant"><div className="ai-demo-agent-label"><span><Bot size={13}/></span><b>OpenCode Agent</b><i>USING QABOX MCP</i></div><p>I'll review the checkout page structure and test intent before drafting the spec.</p><div className="ai-demo-tool-list"><span><CheckCircle2 size={12}/> Read Application Knowledge</span><span><CheckCircle2 size={12}/> Retrieved 8 linked test cases</span><span><CheckCircle2 size={12}/> Reviewed selectors and expected results</span></div><div className="ai-demo-draft-result"><FileCode2 size={14}/><span><b>checkout.spec.ts</b><small>Automation draft prepared · review required</small></span><span className="ai-demo-draft-badge">DRAFT</span></div></div>
      </div>}
      {activeTab==="knowledge"&&<div className="ai-demo-knowledge">
        <div className="ai-demo-filetree"><small>APPLICATION KNOWLEDGE</small><div className="selected"><Folder size={12}/> Checkout</div><span><FileCode2 size={11}/> page.snapshot.json</span><span><FileCode2 size={11}/> selectors.json</span><span><FileCode2 size={11}/> behaviors.json</span><span><Folder size={11}/> components</span><span><Folder size={11}/> forms</span><div className="ai-demo-tree-note"><CheckCircle2 size={11}/> Imported to project</div></div>
        <div className="ai-demo-knowledge-detail"><div className="ai-demo-detail-heading"><div><small>CAPTURED PAGE</small><b>Checkout</b></div><span>STRUCTURED DATA</span></div><div className="ai-demo-knowledge-stats"><div><b>08</b><small>Pages</small></div><div><b>24</b><small>Components</small></div><div><b>16</b><small>Behaviors</small></div></div><div className="ai-demo-code-preview"><span>OBSERVED ELEMENTS</span><code><i>button</i> <em>"Place order"</em><br/><i>input</i> <em>"Card number"</em><br/><i>form</i> <em>"Payment details"</em><br/><i>state</i> <em>"Validation error"</em></code></div><p><CheckCircle2 size={12}/> Context is available to the connected agent through supported MCP resources.</p></div>
      </div>}
      {activeTab==="test"&&<div className="ai-demo-codeview">
        <div className="ai-demo-code-header"><span><FileCode2 size={12}/> checkout.spec.ts</span><span>PLAYWRIGHT · TYPESCRIPT</span></div>
        <pre><span className="code-muted">01</span> <i>import</i> {'{'} test, expect {'}'} <i>from</i> <em>'@playwright/test'</em>;{'\n'}<span className="code-muted">02</span>{'\n'}<span className="code-muted">03</span> test(<em>'completes checkout'</em>, <i>async</i> ({'{'} page {'}'}) =&gt; {'{'}{'\n'}<span className="code-muted">04</span>   <i>await</i> page.goto(<em>'/checkout'</em>);{'\n'}<span className="code-muted">05</span>   <i>await</i> page.getByLabel(<em>'Card number'</em>).fill(...);{'\n'}<span className="code-muted">06</span>   <i>await</i> page.getByRole(<em>'button'</em>, {'{'} name: <em>'Place order'</em> {'}'}).click();{'\n'}<span className="code-muted">07</span>   <i>await</i> expect(page.getByText(<em>'Order confirmed'</em>)).toBeVisible();{'\n'}<span className="code-muted">08</span> {'}'});</pre>
        <div className="ai-demo-code-footer"><span><CircleAlert size={12}/> Illustrative draft — selectors and test data need review.</span><span>NOT EXECUTED</span></div>
      </div>}
    </div>
    <div className="ai-demo-bottom"><span><i/> Demo workspace · illustrative data</span><span>AGENT DRAFTS. QA REVIEWS.</span></div>
  </div>;
}

function AgentConnectionBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resourceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hubRef = useRef<HTMLDivElement>(null);
  const agentGroupRef = useRef<HTMLDivElement>(null);
  const [beamPaths, setBeamPaths] = useState<string[]>([]);

  const resources = [
    { name: "Test Scans", detail: "Captured app flows", Icon: ScanSearch },
    { name: "Test Cases", detail: "Reusable QA scenarios", Icon: ClipboardList },
    { name: "Application Knowledge", detail: "Project context & evidence", Icon: Folder },
    { name: "Docs App", detail: "Desktop workspace", Icon: Monitor },
  ];
  const agents = [
    { name: "Qwen Code", logo: "/agents/qwen.svg" },
    { name: "OpenCode", logo: "/agents/opencode.svg" },
    { name: "Claude", logo: "/agents/claude.svg" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const bounds = container.getBoundingClientRect();
      const point = (el: HTMLDivElement | null, side: "left" | "right") => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: (side === "right" ? r.right : r.left) - bounds.left, y: r.top + r.height / 2 - bounds.top };
      };
      const hubIn = point(hubRef.current, "left");
      const hubOut = point(hubRef.current, "right");
      const paths: string[] = [];
      resourceRefs.current.forEach((node) => {
        const from = point(node, "right");
        if (!from || !hubIn) return;
        const bend = Math.max(38, (hubIn.x - from.x) * .48);
        paths.push(`M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${hubIn.x - bend} ${hubIn.y}, ${hubIn.x} ${hubIn.y}`);
      });
      const agent = point(agentGroupRef.current, "left");
      if (hubOut && agent) {
        const bend = Math.max(38, (agent.x - hubOut.x) * .48);
        paths.push(`M ${hubOut.x} ${hubOut.y} C ${hubOut.x + bend} ${hubOut.y}, ${agent.x - bend} ${agent.y}, ${agent.x} ${agent.y}`);
      }
      setBeamPaths(paths);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    [...resourceRefs.current, hubRef.current, agentGroupRef.current].forEach(el => el && observer.observe(el));
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  return <div className="agent-beam agent-beam-flow" ref={containerRef} aria-label="QaBox QA resources connect through QaBox MCP to a selected AI agent">
    <svg className="agent-beam-lines" aria-hidden="true">
      <defs><linearGradient id="qabox-mcp-beam" x1="0" x2="1"><stop offset="0%" stopColor="#64748b" stopOpacity=".15"/><stop offset="52%" stopColor="#38bdf8" stopOpacity=".8"/><stop offset="100%" stopColor="#64748b" stopOpacity=".2"/></linearGradient></defs>
      {beamPaths.map((d, i) => <g key={i}><path className="agent-beam-track" d={d}/><path className="agent-beam-pulse" d={d} style={{ animationDelay: `${i * -.65}s` }}/></g>)}
    </svg>
    <div className="agent-beam-column agent-beam-resources">
      <div className="agent-beam-column-title">QABOX QA RESOURCES</div>
      {resources.map(({ name, detail, Icon }, i) => <div className="agent-beam-node agent-beam-resource" key={name} ref={el => { resourceRefs.current[i] = el; }}>
        <span className="agent-beam-resource-icon"><Icon size={17}/></span>
        <span className="agent-beam-label"><b>{name}</b><small>{detail}</small></span>
      </div>)}
    </div>
    <div className="agent-beam-hub" ref={hubRef}>
      <span className="agent-beam-hub-logo"><img src="/qabox-logo.png" alt="" /></span>
      <b>QaBox MCP</b>
      <small>TOOLS &amp; CONTEXT</small>
    </div>
    <div className="agent-beam-column agent-beam-agents">
      <div className="agent-beam-column-title">YOUR AI AGENT</div>
      <div className="agent-beam-agent-list" ref={agentGroupRef}>
        {agents.map(({ name, logo }) => <div className="agent-beam-agent-option" key={name}>
          <span className="agent-beam-logo"><img src={logo} alt="" /></span><b>{name}</b>
        </div>)}
        <span className="agent-beam-agent-note">Choose the agent you already use</span>
      </div>
    </div>
  </div>;
}

function HomePage() {
  return <PageFrame><main>
    <section className="hero container">
      <div className="hero-copy"><Eyebrow>VIBE CODING FOR QA</Eyebrow><h1>Turn application context<br/><span>into better tests.</span></h1><p className="hero-lead">Capture how your application behaves, organize the evidence, and give your QA team and AI agents a shared foundation for test design, automation, and failure investigation.</p>
        <div className="download-block" id="download"><div className="micro-label"><Download size={13}/> DOWNLOAD QABOX DESKTOP</div><div className="download-grid download-platforms">{downloadTargets.map(({ os, label, detail, ext, icon: PlatformIcon }) => <div className="download-card" key={os}><div><PlatformIcon size={17}/><span>{ext}</span></div><strong>{os}</strong><small>{label} · {detail}</small><em>Coming soon</em></div>)}</div></div>
        <div className="hero-actions"><ButtonLink href="/sign-up">Explore QaBox <ArrowUpRight size={16}/></ButtonLink><ButtonLink href="/#workflow" secondary>See how it works <ArrowDown size={15}/></ButtonLink></div>
        <div className="hero-proof"><span><CheckCircle2 size={14}/> Real page context</span><span><CheckCircle2 size={14}/> MCP-connected agents</span><span><CheckCircle2 size={14}/> Execution feedback</span></div>
        <div className="hero-note"><span/> Desktop app · Chrome Extension · Android USB · MCP</div>
      </div>
      <div className="hero-visual"><div className="visual-glow"/><div className="app-window">
        <div className="window-bar"><div className="window-dots"><i/><i/><i/></div><span>qabox · workspace overview</span><span className="window-status"><span/> PROJECT</span></div>
        <div className="window-body"><aside className="mock-sidebar"><div className="mock-logo"><img src="/qabox-logo.png"/> QaBox</div><div className="mock-nav active"><Layers3 size={14}/> Workspace</div><div className="mock-nav"><ScanSearch size={14}/> Application scans</div><div className="mock-nav"><FileCode2 size={14}/> Test cases</div><div className="mock-nav"><Terminal size={14}/> Test runs</div><div className="mock-nav"><Cpu size={14}/> AI Studio</div><div className="mock-project"><span>PROJECT CONTEXT</span><b>Customer Portal</b><small>Web · Android</small></div></aside>
          <div className="mock-content"><div className="mock-title"><div><small>PROJECT / APPLICATION KNOWLEDGE</small><h3>Scan Management</h3></div><span className="status-pill"><CheckCircle2 size={12}/> Synced</span></div><div className="mock-metrics"><div><small>Page snapshots</small><b>08</b><span>Captured context</span></div><div><small>Test cases</small><b>24</b><span>Project assets</span></div><div><small>AI connection</small><b>MCP</b><span>Local tools</span></div></div><div className="mock-code"><div className="code-head"><span><Code2 size={13}/> application-knowledge</span><span>PROJECT DATA</span></div><pre><span className="code-purple">pages</span>          <span className="code-green">08 snapshots</span>{"\n"}<span className="code-purple">components</span>     <span className="code-green">DOM + selectors</span>{"\n"}<span className="code-purple">behaviors</span>      <span className="code-green">Observed flows</span>{"\n"}<span className="code-purple">api_mapping</span>    <span className="code-green">Request metadata</span>{"\n"}<span className="code-purple">test_cases</span>     <span className="code-green">Linked QA assets</span></pre></div><div className="mock-bottom"><span><span/> Desktop Bridge · ready</span><span>QaBox MCP</span></div></div></div>
      </div>
      <div className="hero-caption">A practical workspace for the work between discovery, test design, and execution.</div></div>
    </section>
    <section className="platform-strip" aria-label="QaBox platform components"><div className="container platform-strip-inner"><span className="platform-strip-label">ONE CONNECTED WORKFLOW</span><div className="platform-items"><span><Globe2/> Browser Extension</span><i/><span><Monitor/> Desktop Workspace</span><i/><span><Smartphone/> Android Scanning</span><i/><span><Plug/> MCP Integration</span><i/><span><Activity/> Automation Reports</span></div></div></section>
    <WorkflowMarquee />
    <DesktopPrototype />
    <section className="section section-alt" id="problem"><div className="container split"><div><Eyebrow tone="muted">THE CONTEXT GAP</Eyebrow><h2>AI can write tests.<br/><span className="text-accent">But does it know your app?</span></h2><p className="section-copy">Without reliable application context, an AI agent may guess selectors, miss important states, or create scenarios disconnected from the product. QaBox gives the workflow a shared source of observed application knowledge.</p></div><div className="problem-card"><div className="card-label danger"><CircleAlert size={15}/> WHAT QA NEEDS:</div>{["Real page structure and selectors","Forms, validation, and UI states","Observed navigation and user flows","Test cases linked to scan context","Execution results and failure evidence"].map((x,i)=><div className="number-row" key={x}><span>0{i+1}</span>{x}</div>)}<div className="card-foot">LESS GUESSWORK. MORE GROUNDED QA.</div></div></div></section>
    <section className="section" id="solution"><div className="container"><SectionHeading tag="THE QABOX APPROACH" title={<>One connected source of <span className="text-accent">QA context.</span></>} text="QaBox links the tools around your testing process — capture what the application exposes, organize it in a project, and make that context available to your QA workflow." center />
      <div className="context-grid">{[
        ["Capture & explore","Use a single-page scan, manual recording, bounded Auto Crawl, or AI Auto Scan.","capture"],
        ["Prepare & import","Stage the Application Knowledge bundle, then choose its project and Scan folder.","organize"],
        ["Connect & generate","Give an MCP-compatible agent access to project knowledge and QA assets.","connect"],
        ["Execute & investigate","Review Reporter results and investigate failed scenarios with AI Bug Analysis.","improve"]
      ].map(([title,desc,kind],i)=><article className={`context-card context-${kind}`} key={title}>
        <div className="context-card-top"><span>0{i+1} / 04</span><i>{kind==="capture"?<ScanSearch size={16}/>:kind==="organize"?<Folder size={16}/>:kind==="connect"?<Plug size={16}/>:<Activity size={16}/>}</i></div>
        <div className={`context-visual visual-${kind}`} aria-hidden="true">
          {kind==="capture"&&<><span className="capture-window"><i/><i/><i/></span><b>DOM</b><b>Forms</b><b>Routes</b><b>States</b></>}
          {kind==="organize"&&<><span><Folder size={13}/> Application Knowledge</span><span><Folder size={13}/> Authentication</span><span><Folder size={13}/> Checkout</span></>}
          {kind==="connect"&&<><span className="connect-core"><img src="/qabox-logo.png" alt=""/></span><i/><b>AI agent</b><small>MCP</small></>}
          {kind==="improve"&&<><span className="result-row"><i/> Passed <b>12</b></span><span className="result-row failed"><i/> Failed <b>02</b></span><span className="result-bar"><i/></span></>}
        </div>
        <h3>{title}</h3><p>{desc}</p>
      </article>)}</div><div className="center-line"><span/> OBSERVED CONTEXT → QA WORKFLOW → EXECUTION FEEDBACK <span/></div>
    </div></section>
    <section className="section section-alt" id="workflow"><div className="container"><SectionHeading tag="HOW QABOX WORKS" title="From browser discovery to actionable QA feedback." text="The Extension performs browser capture and actions, Desktop stages and imports Application Knowledge, MCP exposes QA resources to the agent, and the test runner executes generated automation." center />
      <div className="steps">{[["Capture or explore","Choose Single Page Scan, Manual Record, bounded Auto Crawl, or AI Auto Scan. For AI Auto Scan, the Extension executes browser actions while Desktop Bridge receives browser tasks and MCP exposes tools to the agent."],["Prepare the knowledge bundle","The Extension packages captured pages and related Application Knowledge data. Desktop Bridge receives the bundle and stages it for import."],["Import into a project","In Desktop, select the destination Project and Scan folder. QaBox uploads the bundle files in sequence and uploads the manifest last to finalize the import."],["Design tests and generate automation","Manage Test Cases, Test Plans, and Test Runs. Connect an AI agent through MCP so it can use project context, scans, Application Knowledge, and QA assets to prepare automation."],["Run, report, and investigate","The configured test runner executes scripts and the Reporter sends results to QaBox. AI Bug Analysis examines failures and produces evidence-based findings for QA review."]].map(([title,desc],i)=><div className="step" key={title}><div className="step-index">0{i+1}</div><div className="step-copy"><span className="step-kicker">{["BROWSER DISCOVERY","KNOWLEDGE PACKAGING","PROJECT IMPORT","AI-ASSISTED TEST DESIGN","EXECUTION & FEEDBACK"][i]}</span><h3>{title}</h3><p>{desc}</p></div><div className={`step-visual step-visual-${i+1}`} aria-hidden="true">{i===0?<><span><Globe2 size={13}/> Page</span><ArrowRight size={12}/><span><ScanSearch size={13}/> Scan</span></>:i===1?<><span><FileCode2 size={13}/> DOM</span><span><Layers3 size={13}/> States</span></>:i===2?<><span><Folder size={13}/> Project</span><ArrowRight size={12}/><span><Layers3 size={13}/> Scan folder</span></>:i===3?<><span><Bot size={13}/> Agent</span><ArrowRight size={12}/><span><Code2 size={13}/> Script</span></>:<><span><Activity size={13}/> Run</span><ArrowRight size={12}/><span><CheckCircle2 size={13}/> Report</span></>}</div><ArrowRight className="step-arrow" size={18}/></div>)}</div>
      <div className="flow-line">{["CAPTURE","KNOWLEDGE","MANAGE","EXECUTE","IMPROVE"].map((x,i)=><span key={x}>{x}{i<4&&<ChevronRight size={14}/>}</span>)}</div>
    </div></section>
    <section className="section"><div className="container"><div className="demo-card"><div className="demo-top"><Eyebrow>APPLICATION KNOWLEDGE</Eyebrow><h2>Not just a screenshot. A structured view of the app.</h2><p>Application Knowledge groups the structured evidence captured during page scans and supported exploration. The Extension prepares the bundle; Desktop stages it before the user chooses the destination Project and Scan folder.</p></div><div className="knowledge-detail">
          <div className="knowledge-browser">
            <div className="knowledge-browser-bar"><span/><span/><span/><small>app.example.com / checkout</small></div>
            <div className="knowledge-browser-body"><div className="knowledge-page"><small>CHECKOUT</small><b>Complete your order</b><i/><i/><div><span>Contact details</span><span>Payment method</span></div><em>Place order</em></div>
              <div className="knowledge-dom"><small>INSPECTED ELEMENTS</small><span><b>▾</b> main.checkout</span><span>　<b>▾</b> form#payment</span><span className="selected">　　button.submit-order</span><span>　　input.email</span><span>　　select.country</span><div className="selector-note"><CheckCircle2 size={11}/> Selector evidence</div></div>
            </div>
          </div>
          <div className="knowledge-points">{[["DOM & selectors","Element identity, attributes, roles, and selector evidence."],["Forms & validation","Fields, constraints, validation rules, and visible messages."],["Components & states","Buttons, inputs, tables, dropdowns, modals, tabs, and dynamic states."],["Navigation & flows","Discovered routes, user flows, component relationships, and interaction outcomes."],["API observations","Sanitized request metadata and response keys observed during supported inspection."]].map(([title,desc],i)=><div className="knowledge-point" key={title}><span>0{i+1}</span><div><b>{title}</b><p>{desc}</p></div></div>)}</div>
        </div><p className="knowledge-note"><ShieldCheck size={14}/> Keep automated exploration within an explicitly selected application scope. Scan packages should contain sanitized observations—not credentials, sensitive field values, or raw request bodies.</p></div></div></section>
    <section className="section section-alt" id="features"><div className="container"><SectionHeading tag="PRODUCT CAPABILITIES" title="Built around the real QA workflow." text="The core parts of QaBox work together, from collecting application evidence to managing tests and reviewing execution." center />
      <div className="feature-grid">
        <article className="feature-card feature-large"><div className="cap-visual cap-browser">
          <div className="cap-browser-top"><span/><span/><span/><small>customer-portal.app / checkout</small><b><ScanSearch size={12}/> SCANNING</b></div>
          <div className="cap-browser-content"><div className="cap-page"><small>CHECKOUT FLOW</small><strong>Complete your order</strong><i/><i/><div><span>Contact details</span><span>Payment method</span></div><em>Place order</em></div><div className="cap-inspector"><small>APPLICATION KNOWLEDGE</small><span><b>▾</b> main.checkout</span><span>　<b>▾</b> form#payment</span><span className="active">　 button.submit-order</span><span>　 input.email</span><span>　 select.country</span><div><CheckCircle2 size={11}/> 24 elements captured</div></div></div>
          <div className="cap-mode-row"><span>Single Page</span><span>Manual Record</span><span>Auto Crawl</span><span className="mode-ai"><Sparkles size={10}/> AI Auto Scan</span></div>
        </div><div className="feature-icon"><ScanSearch/></div><Eyebrow>EXTENSION + DESKTOP BRIDGE</Eyebrow><h3>Capture the application, not just the page image.</h3><p>The Chrome Extension offers four capture paths: Single Page Scan, Manual Record for user journeys, bounded Auto Crawl within the same application, and AI Auto Scan. In AI Auto Scan, the Extension executes browser actions while Desktop Bridge receives tasks and the connected agent coordinates through MCP.</p><ul className="check-list"><li>DOM, component, form, and validation scanning</li><li>Manual workflow recording and bounded same-application Auto Crawl</li><li>AI Auto Scan with Extension-executed browser actions and MCP coordination</li><li>Application Knowledge bundle staged in Desktop and imported into a chosen Project and Scan folder</li></ul></article>
        <article className="feature-card"><div className="cap-visual cap-mobile">
          <div className="cap-phone"><div className="cap-phone-notch"/><div className="cap-phone-screen"><div className="cap-app-head"><span>‹</span><b>My Account</b><span>•••</span></div><div className="cap-user"><i>JD</i><span><b>Jane Doe</b><small>Premium member</small></span></div><div className="cap-mobile-tile"><span/><span/><span/></div><div className="cap-mobile-button">Continue</div><small className="cap-mobile-status"><CheckCircle2 size={9}/> UI hierarchy captured</small></div></div>
          <div className="cap-usb-line"><span/><i>USB</i><span/></div><div className="cap-device-chip"><Smartphone size={13}/><span><b>Android device</b><small>Connected · Ready to scan</small></span><CheckCircle2 size={13}/></div>
        </div><div className="feature-icon"><Smartphone size={22}/></div><Eyebrow>ANDROID USB SCANNING</Eyebrow><h3>Bring mobile app context into QA.</h3><p>Connect an Android device over USB and use the Desktop mobile scanning workflow to capture mobile application context alongside web project assets.</p><ul className="check-list"><li>USB-connected Android device workflow</li><li>Mobile scan artifacts in the project</li></ul></article>
        <article className="feature-card"><div className="cap-visual cap-tests">
          <div className="cap-real-toolbar"><div><small>TEST SUITES</small><b>Authentication</b></div><span><Plus size={10}/> Create Case</span></div>
          <div className="cap-real-search"><Search size={10}/> Search in Authentication...</div>
          <div className="cap-real-filter"><span><Filter size={9}/> Filters</span><i>Priority: All</i><i>Severity: All</i><i>Status: All</i></div>
          <div className="cap-real-table"><div className="cap-real-table-head"><span>ID</span><span>Test Title</span><span>Priority</span><span>Status</span><span>Type</span></div>
            <div><b>TC-001</b><span>Successful login</span><em>High</em><small>ACTIVE</small><small>MANUAL</small></div>
            <div><b>TC-002</b><span>Invalid password</span><em>High</em><small>ACTIVE</small><small>AUTO</small></div>
            <div><b>TC-003</b><span>Session timeout</span><em>Medium</em><small>ACTIVE</small><small>MANUAL</small></div>
            <div><b>TC-004</b><span>Required field validation</span><em>Medium</em><small>DRAFT</small><small>AUTO</small></div>
            <div><b>TC-005</b><span>Password visibility</span><em>Low</em><small>ACTIVE</small><small>MANUAL</small></div>
          </div>
        </div><div className="feature-icon"><Layers3/></div><Eyebrow>TEST MANAGEMENT</Eyebrow><h3>Keep scenarios connected to evidence.</h3><p>Manage the QA lifecycle across Test Cases, Test Plans, and Test Runs. Keep test scenarios connected to the project and scan context they validate.</p><ul className="check-list"><li>Step-by-step and Gherkin test cases</li><li>AI-assisted generation from DOM scan data</li><li>JSON import and Scan folder linking</li><li>Test Plans for grouping and planning cases</li><li>Test Runs for recording execution outcomes</li></ul></article>
        <article className="feature-card"><div className="cap-visual cap-agent">
          <div className="cap-ide-toolbar"><span><PanelLeft size={10}/> Explorer</span><span><Search size={10}/> Search</span><span><Workflow size={10}/> Source Control</span><b><Terminal size={10}/> Terminal</b></div>
          <div className="cap-ide-body"><div className="cap-ide-tree"><small>EXPLORER</small><b>⌄ QA PROJECT</b><span>⌄ src</span><span className="selected"><FileCode2 size={9}/> checkout.spec.ts</span><span><FileCode2 size={9}/> login.spec.ts</span><span>› tests</span><span>› fixtures</span><span><FileCode2 size={9}/> package.json</span></div>
            <div className="cap-ide-editor"><div className="cap-ide-tab"><FileCode2 size={9}/> checkout.spec.ts <i>×</i></div><div><span>1</span><code><b>import</b> {'{'} test, expect {'}'}</code></div><div><span>2</span><code><b>test</b>(<em>'checkout flow'</em>, <b>async</b> () =&gt; {'{'}</code></div><div><span>3</span><code>&nbsp; <b>await</b> page.goto(<em>'/checkout'</em>);</code></div><div><span>4</span><code>&nbsp; <b>await</b> expect(...).toBeVisible();</code></div><div><span>5</span><code>{'}'});</code></div></div>
          </div>
          <div className="cap-agent-session">
            <div className="cap-agent-session-head"><span><Bot size={10}/> OPENCODE AGENT</span><i><b/> MCP CONNECTED</i></div>
            <div className="cap-agent-prompt">Create checkout automation from Application Knowledge and linked test cases.</div>
            <div className="cap-agent-activity"><span><CheckCircle2 size={9}/> Read Application Knowledge</span><span><CheckCircle2 size={9}/> Retrieved 8 test cases</span><span><FileCode2 size={9}/> Drafted checkout.spec.ts</span></div>
            <div className="cap-agent-session-foot"><Terminal size={9}/> npm run test:checkout <b>4 passed · 6.8s</b></div>
          </div>
        </div><div className="feature-icon"><Cpu/></div><Eyebrow>AI STUDIO + MCP</Eyebrow><h3>Give agents tools and real project context.</h3><p>The local MCP server exposes supported QA resources and tools to compatible coding agents. For AI Auto Scan, MCP provides the agent-facing tools; Desktop Bridge coordinates browser-task handoff, and the Extension performs the actual browser actions.</p><ul className="check-list"><li>Project, scan, and Application Knowledge access</li><li>Test case creation and AI test generation</li><li>AI Auto Scan coordination through MCP, Desktop Bridge, and Extension</li><li>QA Engineer persona and workflow prompts</li></ul></article>
        <article className="feature-card feature-wide"><div className="cap-visual cap-report">
          <div className="cap-real-toolbar"><div><small>TEST RUNNER</small><b>Test Runs</b></div><span><Plus size={10}/> New Run</span></div>
          <div className="cap-run-search"><Search size={9}/> Filter by status or name... <i><Filter size={9}/> Filters</i><i>Newest First⌄</i></div>
          <div className="cap-run-cards">
            <div><small>TEST RUN</small><b>Checkout regression</b><span>Playwright · 14 tests</span><em className="good">PASSED</em><i>View results →</i></div>
            <div><small>TEST RUN</small><b>Authentication smoke</b><span>Cypress · 8 tests</span><em className="warning">FAILED</em><i>View results →</i></div>
          </div>
          <div className="cap-run-analysis"><Bug size={10}/><span><b>Bug Analysis</b><small>Investigate failed reports</small></span><ArrowUpRight size={10}/></div>
        </div><div className="feature-icon"><Terminal/></div><Eyebrow>AUTOMATION + REPORTING</Eyebrow><h3>Bring test execution back to the project.</h3><p>Run automation with your configured local test runner and use QaBox reporting workflows to associate results with test cases and review failures.</p><ul className="check-list"><li>Cypress adapter identifier: cypress-qabox-reporter; Playwright adapter identifier: playwright-qabox-reporter</li><li>Selenium + Pytest adapter identifier: pytest-qabox</li><li>Run results, logs, stack traces, screenshots/evidence, and supported report exports</li><li>AI Bug Analysis: root-cause investigation, reproduction guidance, severity suggestion, and technical report</li></ul></article>
      </div>
    </div></section>
    <section className="section bug-analysis-showcase" id="bug-analysis">
      <div className="container bug-analysis-layout">
        <div className="bug-analysis-copy">
          <Eyebrow>FAILURE INVESTIGATION</Eyebrow>
          <h2>Understand the failure.<br/><span className="text-accent">Know what to investigate next.</span></h2>
          <p className="section-copy">Bring failed test results, logs, stack traces, and available evidence into a structured analysis. Review root-cause hypotheses and reproduction guidance before deciding what needs to be fixed.</p>
          <div className="bug-analysis-points">
            <div><span><Search size={15}/></span><p><b>Trace the failure</b><small>Connect failed scenarios with logs and execution evidence.</small></p></div>
            <div><span><ListChecks size={15}/></span><p><b>Review actionable findings</b><small>Inspect reproduction steps and expected versus actual behavior.</small></p></div>
            <div><span><ShieldCheck size={15}/></span><p><b>Keep QA in control</b><small>Validate AI suggestions before sharing findings with developers.</small></p></div>
          </div>
        </div>
        <FailureInvestigationDemo/>
      </div>
    </section>
    <section className="section"><div className="container split align-center"><div><Eyebrow>AI-ASSISTED QA</Eyebrow><h2>Ground every test in <span className="text-accent">what you observed.</span></h2><p className="section-copy">An agent can use the selected project's Application Knowledge, scan records, Test Cases, and other supported QA resources as context for automation generation. Browser actions remain the Extension's responsibility; the agent reasons over the available evidence.</p><p className="micro-label accent-text">REAL SCAN EVIDENCE. REVIEWABLE TEST OUTPUT.</p></div><AiStudioInteractiveDemo/></div></section>
    <section className="section section-alt automation-section" id="automation-reporting"><div className="container">
      <div className="automation-simple-heading"><Eyebrow>AUTOMATION REPORTING</Eyebrow><h2>Works with the tools <span className="text-accent">you already use.</span></h2></div>
      <div className="automation-logo-grid">
        <div className="automation-logo-card"><img src="/integrations/cypress.svg" alt=""/><span>Cypress</span></div>
        <div className="automation-logo-card"><img src="/integrations/playwright.svg" alt=""/><span>Playwright</span></div>
        <div className="automation-logo-card selenium-pytest"><div><img src="/integrations/selenium.svg" alt=""/><span>+</span><img src="/integrations/pytest.svg" alt=""/></div><span>Selenium + Pytest</span></div>
      </div>
    </div></section>
    <section className="section"><div className="container split"><div><Eyebrow>PROJECTS & TEAM WORKSPACES</Eyebrow><h2>Keep QA work <span className="text-accent">organized together.</span></h2><p className="section-copy">QaBox uses workspaces to separate personal and team projects. Invite collaborators, manage roles, and keep project resources scoped to the workspace.</p></div><div className="team-workspace-visual"><div className="team-workspace-head"><span><Folder size={14}/> Product workspace</span><small>TEAM SPACE</small></div><div className="team-project-row"><span className="team-project-mark">Q</span><div><b>Customer Portal</b><small>Web application · 12 QA assets</small></div><MoreHorizontal size={16}/></div><div className="team-members-head">WORKSPACE MEMBERS <span>3 members</span></div><div className="team-member"><i className="member-avatar avatar-one">A</i><span><b>Alex Morgan</b><small>Workspace owner</small></span><em>OWNER</em></div><div className="team-member"><i className="member-avatar avatar-two">J</i><span><b>Jamie Lee</b><small>QA engineer</small></span><em>MEMBER</em></div><div className="team-member"><i className="member-avatar avatar-three">S</i><span><b>Sam Taylor</b><small>Product reviewer</small></span><em>VIEWER</em></div><div className="team-workspace-foot"><ShieldCheck size={13}/> Project access stays within its workspace.</div></div></div></section>
    <section className="section section-alt agent-connections-section"><div className="container agent-connections-layout"><div className="agent-connections-copy"><Eyebrow>AI AGENT CONNECTIONS</Eyebrow><h2>Bring the AI tools <span className="text-accent">you already use.</span></h2><p className="section-copy">Connect an MCP-compatible coding agent to the local QaBox MCP server. Give your agent access to project QA context and tools, while it stays in control of reasoning and script generation.</p><div className="agent-connections-footnote"><Plug size={14}/> One MCP connection. Your choice of agent.</div></div><AgentConnectionBeam/></div></section>
    <section className="closing-cta"><div className="container"><Eyebrow>BUILT BY QA, FOR QA</Eyebrow><h2>Better context for agents.<br/><span className="text-accent">More control for QA.</span></h2><p>QaBox helps QA engineers turn observed application behavior into organized test assets, AI-assisted automation, and reviewable execution feedback.</p><ButtonLink href="/sign-up">Explore QaBox <ArrowUpRight size={16}/></ButtonLink></div></section>
  </main></PageFrame>;
}
const proFeatures = ["Browser Extension + Desktop Bridge workflow","Web and Android scanning","Scan Management","Manual and AI-assisted test cases","JSON test case import","AI Studio and local MCP tools","Automation and Reporter workflow","Reports and bug analysis"];
const enterpriseFeatures = ["Team and multi-user workflows","Shared project context","Deployment and integration requirements","Support and onboarding"];
function PricingPage() {
  return <PageFrame active="pricing"><main className="page-main container"><div className="pricing-intro"><Eyebrow>ACCESS & AVAILABILITY</Eyebrow><h1>A clearer path to <span className="text-accent">your QA workspace.</span></h1><p>We are keeping access information straightforward while the product evolves. Talk to the team for the latest desktop availability, setup guidance, and commercial details.</p><div className="pricing-intro-meta"><span><CheckCircle2 size={13}/> No outdated price claims</span><span><Mail size={13}/> Direct team contact</span></div></div>
    <div className="pricing-grid"><article className="price-card featured"><div className="price-badges"><span className="badge badge-accent">DESKTOP WORKSPACE</span></div><small>QaBox Desktop</small><div className="price"><strong>Get access</strong></div><p className="enterprise-copy">Use web and Android scanning, test case management, AI Studio, MCP tools, automation, Reporter, and bug analysis in the QaBox workflow.</p><ButtonLink href="mailto:hello@qabox.id?subject=QaBox%20Desktop%20Access">Request access <ArrowUpRight size={16}/></ButtonLink><h4>Product workflow</h4><ul className="check-list">{proFeatures.map(x=><li key={x}>{x}</li>)}</ul></article>
      <article className="price-card"><div className="price-badges"><span className="badge">PRODUCT QUESTIONS</span></div><small>Talk to QaBox</small><div className="price"><strong>Contact us</strong></div><p className="enterprise-copy">Ask about current availability, supported workflows, setup, or team requirements. We will share the latest information instead of showing outdated pricing.</p><ButtonLink href="mailto:hello@qabox.id?subject=QaBox%20Product%20Inquiry" secondary>Contact QaBox <ArrowUpRight size={16}/></ButtonLink><h4>Helpful topics</h4><ul className="check-list">{enterpriseFeatures.map(x=><li key={x}>{x}</li>)}</ul></article></div>
    <p className="pricing-footnote">Availability and included capabilities may change between releases. The QaBox team can confirm the current build and supported setup before you get started.</p>
    <div className="trust-row"><span><CheckCircle2/> Desktop-first QA workflow</span><span><ShieldCheck/> Local MCP tooling</span><span><Zap/> Built for QA teams</span></div>
  </main></PageFrame>;
}

const docsNav = [
  ["Getting started", [["introduction","Introduction"],["quick-start","Quick start"]]],
  ["Capture", [["extension-scan","Browser Extension"],["desktop-bridge","Desktop Bridge"],["mobile-scan","Android USB scanning"],["scan-management","Scan Management"]]],
  ["QA workflow", [["test-management","Test Cases, Plans & Runs"],["ai-studio","AI Studio"],["automation","Automation"],["reporter","Reporter and reports"]]],
  ["Integrations", [["mcp-connection","MCP connection"],["ai-agents","AI agent clients"]]],
  ["Roadmap", [["roadmap","Planned improvements"]]],
  ["Help", [["faq","Frequently asked questions"]]]
];
function DocsPage() {
  const [active,setActive] = useState("introduction");
  const [menu,setMenu] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if (visible) setActive(visible.target.id); }, { rootMargin: "-100px 0px -65% 0px" });
    document.querySelectorAll(".docs-content section[id]").forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  }, []);
  const jump = (id:string) => { setActive(id); setMenu(false); document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}); };
  return <PageFrame active="docs"><main className="docs-layout container"><aside id="docs-sidebar" className={menu?"docs-sidebar open":"docs-sidebar"}><div className="docs-side-title">DOCUMENTATION</div>{docsNav.map(([group,items])=><div className="docs-nav-group" key={group as string}><h4>{group as string}</h4>{(items as string[][]).map(([id,label])=><button key={id} className={active===id?"selected":""} aria-current={active===id?"location":undefined} onClick={()=>jump(id)}>{label}</button>)}</div>)}</aside><div className="docs-content"><div className="docs-topline"><a href="/">QaBox</a><ChevronRight size={13}/> Documentation</div><div className="docs-heading"><Eyebrow>QABOX DOCUMENTATION</Eyebrow><h1>A connected workspace for the QA lifecycle.</h1><p>Learn how QaBox captures web and mobile context, manages test cases, connects AI agents through MCP, and brings automation results back into Desktop.</p><button className="docs-mobile-toggle" aria-expanded={menu} aria-controls="docs-sidebar" onClick={()=>setMenu(!menu)}><Menu size={15}/> Browse documentation <ChevronDown size={14}/></button></div>
      <section id="introduction"><h2>Introduction</h2><p>QaBox is a desktop-first QA workspace connecting application context, test design, AI-assisted automation, and execution feedback. It combines a browser Extension, Desktop Bridge, Android USB scanning, test case management, AI Studio, a local MCP server, automation, and Reporter workflows.</p><ul><li>Capture web page structure using the QaBox browser Extension</li><li>Transfer captured data to Desktop through Desktop Bridge</li><li>Scan Android applications using a USB-connected device</li><li>Create test cases manually, with AI assistance, or through JSON import</li><li>Connect AI coding agents to QaBox MCP tools</li><li>Generate automation, review execution results, and analyze failures</li></ul><div className="docs-callout tip"><Sparkles size={16}/> The browser workflow includes user-directed scans and bounded exploration modes. AI Auto Scan uses the Extension for browser actions, Desktop Bridge for task handoff, and MCP for agent access.</div></section>
      <section id="quick-start"><h2>Quick start</h2><ol className="number-list"><li><b>Open QaBox Desktop</b><p>Sign in and open the project you want to work on.</p></li><li><b>Capture or explore</b><p>Use Single Page Scan, Manual Record, bounded Auto Crawl, or AI Auto Scan in the Extension.</p></li><li><b>Stage the Application Knowledge bundle</b><p>Send the completed bundle through Desktop Bridge. QaBox Desktop stages the files for import.</p></li><li><b>Choose the destination</b><p>Select the target Project and Scan folder in Desktop, then complete the import.</p></li><li><b>Prepare QA assets</b><p>Manage Test Cases, Test Plans, and Test Runs. Connect an MCP-compatible agent to use project and Application Knowledge context.</p></li><li><b>Generate, execute, and investigate</b><p>Generate automation, run it with your test runner, receive results through Reporter, and investigate failures with AI Bug Analysis.</p></li></ol></section>
      <section id="extension-scan"><h2>Browser Extension scanning</h2><p>The Extension supports four workflows: Single Page Scan for focused capture, Manual Record for recording a user journey, bounded Auto Crawl within the same application, and AI Auto Scan. In AI Auto Scan, the agent reasons through MCP, Desktop Bridge handles browser-task handoff, and the Extension performs browser actions.</p><ul><li>Choose Single Page Scan, Manual Record, bounded Auto Crawl, or AI Auto Scan</li><li>Keep recording and crawl modes within the intended application scope</li><li>Review the captured page and interaction data</li><li>Send the completed Application Knowledge bundle to Desktop through Desktop Bridge</li></ul><p>The Extension packages the captured Application Knowledge data for Desktop Bridge. Desktop stages the bundle, then imports it after the user selects a destination Project and Scan folder.</p></section>
      <section id="desktop-bridge"><h2>Desktop Bridge</h2><p>Desktop Bridge is the local handoff between the Extension and QaBox Desktop. It receives browser tasks for AI Auto Scan and transfers completed Application Knowledge bundles for staging and import.</p><div className="docs-flow"><span>Browser page</span><ArrowRight/><span>QaBox Extension</span><ArrowRight/><span>Desktop Bridge</span><ArrowRight/><span>Scan Management</span></div><p>For import, Desktop stages the received bundle first. Select the destination Project and Scan folder, then let Desktop upload the bundle files and finalize the import with the manifest. If the handoff fails, check that Desktop is running and the Extension is connected to the expected local Bridge.</p></section>
      <section id="mobile-scan"><h2>Android USB scanning</h2><p>QaBox Desktop includes a mobile scanning workflow for Android devices connected over USB. Connect the device, make sure Android debugging access is available, and use the mobile scanner in Desktop to capture application context.</p><p>This is separate from the browser Extension workflow: web capture uses Desktop Bridge, while Android capture uses the connected-device workflow.</p></section>
      <section id="scan-management"><h2>Scan Management</h2><p>Scan Management organizes imported Application Knowledge under the selected Project and Scan folder. The Desktop import flow stages the Extension bundle, uploads its files in sequence, and uploads the manifest last to finalize the import. Android USB scans follow the separate mobile scanning workflow.</p><ul><li>Review received scan records</li><li>Keep captured application context associated with the project</li><li>Use scan data as context for test design and AI-assisted automation</li></ul></section>
      <section id="test-management"><h2>Test Cases, Test Plans, and Test Runs</h2><p>QaBox separates test design from test execution so teams can maintain reusable scenarios and track each run independently.</p><h3>Test Cases</h3><p>Test Cases are organized inside Test Suites within a project. A case describes a scenario and its expected behavior. The workspace supports manual authoring, AI-assisted generation using available project and Application Knowledge context, and supported JSON import.</p><ul><li>Use suites to group related scenarios, such as Authentication or Checkout</li><li>Review the title, steps, expected result, priority, severity, status, and automation type where available</li><li>Search and filter cases before adding them to a plan</li><li>Review imported or AI-generated cases for accuracy before execution</li></ul><h3>Test Plans</h3><p>A Test Plan is a reusable collection of selected Test Cases. Create or edit a plan, add a name and description, then select cases from the project catalog. The plan detail view shows its included cases and available run history.</p><h3>Test Runs</h3><p>A Test Run records one execution cycle. Create a run with a title, framework, execution mode, and environment. A manual run can be associated with a Test Plan; automated runs receive results from a configured runner and Reporter integration. Open a run to inspect its summary, individual results, statuses, durations, and available failure details.</p><div className="docs-callout tip"><Sparkles size={16}/> A Test Plan defines what should be tested; a Test Run records what happened during a particular execution.</div></section>
      <section id="ai-studio"><h2>AI Studio</h2><p>AI Studio combines a project code workspace with an integrated terminal for working on automation files. The workspace includes a file explorer, editor tabs, code editing, and terminal output. A compatible coding agent such as OpenCode can use the QaBox MCP server to retrieve supported project context while preparing automation.</p><ol className="number-list"><li><b>Open the intended project workspace</b><p>Check that the automation files and test environment belong to the correct project.</p></li><li><b>Connect the agent to QaBox MCP</b><p>Create an MCP token in the Desktop Integration area and configure the local MCP server in the AI client.</p></li><li><b>Give the agent a focused task</b><p>For example, ask it to create Playwright automation for a checkout flow using the relevant Application Knowledge and Test Cases.</p></li><li><b>Review generated files</b><p>Inspect selectors, test data, assertions, and setup/teardown logic before running the tests.</p></li><li><b>Execute and review</b><p>Run the suite in the configured environment and inspect the output and reported results.</p></li></ol><p>AI Studio previews and agent conversations do not guarantee that code has been executed successfully. Validate the generated automation in the target environment.</p></section>
      <section id="mcp-connection"><h2>MCP connection</h2><p>QaBox provides a local Model Context Protocol (MCP) server that exposes supported QA resources and tools to compatible AI clients. MCP is the agent interface—not the browser automation engine. For AI Auto Scan, the agent reasons through MCP, Desktop Bridge handles browser-task handoff, and the Extension performs browser actions.</p><h3>Connect an AI client</h3><ol className="number-list"><li><b>Open Integration in QaBox Desktop</b><p>Go to the MCP Server integration area.</p></li><li><b>Create an MCP token</b><p>Give the token a recognizable name and expiry. Copy it when created and store it securely; treat it like a credential. MCP tokens can provide access across the projects available to the account.</p></li><li><b>Configure the MCP server in your client</b><p>Use the STDIO configuration generated by QaBox. Set the command to the absolute path of the QaBox MCP server executable and provide the QaBox API URL and token through the required environment variables.</p></li><li><b>Restart or reload the client</b><p>Confirm the QaBox MCP server appears as connected before asking the agent to use project resources.</p></li></ol><p>For OpenCode, the configuration is stored in <code>~/.config/opencode/opencode.json</code>. Replace the executable path and API URL with the values for your installation. Never paste a real token into shared documentation, screenshots, source control, or prompts.</p><p>The server exposes supported project, scan, Application Knowledge, and QA workflow resources/tools. Exact tool availability depends on the installed MCP build.</p></section>
      <section id="ai-agents"><h2>AI agent clients</h2><p>QaBox Desktop currently documents MCP connection workflows for compatible coding clients, including:</p><div className="agent-doc-list">{[["OpenCode","STDIO configuration supported"],["Claude Code","MCP-compatible client"]].map(([a,b])=><div key={a}><b>{a}</b><span>{b}</span></div>)}</div><p>Other MCP-compatible clients may work, but setup and compatibility should be verified against the client version and the installed QaBox MCP server. Do not assume that every client has a dedicated, tested setup flow.</p></section>
      <section id="automation"><h2>Automation workflow</h2><p>QaBox brings project context, Application Knowledge, and Test Cases together to help an AI coding agent prepare automation scripts. The agent uses supported MCP resources and tools to understand the application and test intent; the test runner remains responsible for executing the generated code.</p><ol className="number-list"><li><b>Select the project and relevant scans</b><p>Use Application Knowledge that matches the application and environment being tested.</p></li><li><b>Choose the test scenarios</b><p>Review the Test Cases and expected behavior that should be automated.</p></li><li><b>Connect the AI agent</b><p>Verify the QaBox MCP connection and ask for a focused automation task.</p></li><li><b>Generate and review the script</b><p>Check selectors, assertions, fixtures, test data, and cleanup logic. Keep credentials and sensitive values out of committed test files.</p></li><li><b>Run the automation</b><p>Execute it with the framework configured in the project, then inspect the runner output and QaBox Test Run.</p></li><li><b>Send results to QaBox</b><p>Configure the matching Reporter integration to create a run and send individual test results.</p></li></ol><p>Current Reporter implementations in the QaBox integration repository cover Cypress, Playwright, and Selenium with Pytest. Framework support and package release availability are separate: confirm the current package distribution and compatibility before installing in a production project.</p><p>PRD/source-document integration is planned, and assisted locator healing remains experimental. Neither should be treated as a guaranteed automation-generation capability.</p></section>
      <section id="reporter"><h2>Reporter, execution results, and Bug Analysis</h2><p>Reporter integrations connect an external test runner to QaBox. A reporter creates an automation run, sends a result for each test, and completes the run with execution statistics. Depending on the framework and configuration, supported evidence such as screenshots, attachments, error messages, and stack traces can also be sent.</p><h3>Implemented Reporter integrations</h3><div className="agent-doc-list"><div><b>Cypress</b><span><code>cypress-qabox-reporter</code> · npm package source</span></div><div><b>Playwright</b><span><code>playwright-qabox-reporter</code> · npm package source</span></div><div><b>Selenium + Pytest</b><span><code>pytest-qabox</code> · Python package source</span></div></div><p>The reporter implementations and integration guides are maintained in the QaBox reporter repository. Package names in the repository do not by themselves confirm that a public npm or PyPI release is available. Check the current release/distribution instructions; a local package path may be required for unreleased builds.</p><h3>Typical reporting flow</h3><ol className="number-list"><li><b>Configure the reporter</b><p>Set the QaBox API URL, project identifier, and project API key using the framework's supported configuration or environment variables. Keep tokens out of source control.</p></li><li><b>Link scripts to Test Cases</b><p>Use the framework's supported case-code annotation, title convention, marker, or decorator so results can be associated with the intended Test Case.</p></li><li><b>Run the test suite</b><p>Execute Cypress, Playwright, or Selenium with Pytest in the configured environment.</p></li><li><b>Review the Test Run</b><p>Inspect run statistics, individual test statuses, durations, errors, and any uploaded evidence.</p></li></ol><h3>AI Bug Analysis</h3><p>AI Bug Analysis can review failed results, logs, stack traces, broken scenarios, and screenshots or other evidence. Its report may include an executive summary, failure distribution, key findings, possible bugs, root-cause hypotheses, problematic flows, potential fixes, reproduction steps, expected versus actual behavior, severity suggestions, and technical analysis.</p><p>Review the analysis, open the relevant bug details, and preview, save, export, or share the report using the actions available in the installed Desktop build. The developer should validate the findings, implement and deploy a fix, and QA should rerun the automation to verify the outcome. AI findings are hypotheses and recommendations—not confirmed defects or a substitute for reproduction and human review.</p></section>
      <section id="roadmap"><h2>Planned improvements</h2><p>These capabilities are still evolving and availability can vary by build. Treat the following as planned or experimental rather than guaranteed functionality:</p><ul><li>Expanded AI Auto Scan coverage and additional supported browser actions</li><li>Broader frontend and API observation during exploration</li><li>PRD/source-document integration into automation generation</li><li>Assisted locator healing remains experimental and requires QA review</li></ul><div className="docs-callout info">AI Auto Scan is a coordinated workflow: the agent reasons through MCP, Desktop Bridge handles browser-task handoff, and the Extension performs browser actions. Expanded coverage and deeper integrations may arrive in later builds.</div></section>
      <section id="faq"><h2>Frequently asked questions</h2><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={16}/></summary><p>{a}</p></details>)}</div></section>
      <section id="privacy"><h2>Privacy &amp; data handling overview</h2><p>This section is a product-level overview, not a complete privacy policy. QaBox includes local desktop and MCP workflows, and data handling can depend on the feature, connected service, and AI provider configuration. Avoid including credentials or sensitive production data in scans, prompts, or test fixtures. For questions about data handling or to request the current privacy documentation, contact <a href="mailto:hello@qabox.id">hello@qabox.id</a>.</p></section>
      <section id="terms"><h2>Terms of use summary</h2><p>This is a short usage summary, not a complete terms-of-service agreement. Use QaBox only with applications and environments you are authorized to test. Review generated scripts before execution and protect credentials, tokens, and other sensitive test data.</p><p>For the applicable terms or questions about permitted use, contact <a href="mailto:hello@qabox.id">hello@qabox.id</a>.</p></section>
    </div></main></PageFrame>;
}

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const isRegister = mode === "register";
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (isRegister && password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/v1/auth/register" : "/api/v1/auth/login";
      const response = await fetch(`${API_BASE}${endpoint}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(isRegister ? {name,email,password} : {email,password}) });
      const result = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result?.message || result?.error || `Request failed (${response.status})`);
      let token = getToken(result as AuthResult);
      let user = getUser(result as AuthResult);
      if (isRegister && !token) {
        const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
        const loginResult = await loginResponse.json().catch(()=>({}));
        if (loginResponse.ok) { token = getToken(loginResult as AuthResult); user = getUser(loginResult as AuthResult); }
      }
      if (!token) throw new Error(isRegister ? "Account created. Please sign in to continue." : "Login failed — no token returned.");
      localStorage.setItem("qabox_token",token);
      localStorage.setItem("qabox_user",JSON.stringify(user));
      window.history.pushState({}, "", "/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }
  return <div className="auth-shell"><div className="auth-orb"/><a className="auth-back" href="/"><ArrowDown size={15}/> Back to website</a><div className="auth-card-wrap"><div className="auth-brand"><Brand/></div><div className="auth-heading"><Eyebrow>{isRegister ? "GET STARTED" : "SIGN IN"}</Eyebrow><h1>{isRegister ? "Create an account" : "Welcome back"}</h1><p>{isRegister ? "Create your account to access your QaBox workspace" : "Sign in to your QaBox account"}</p></div><form className="auth-card" onSubmit={submit}>
    {isRegister && <label>FULL NAME<input required value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" autoComplete="name"/></label>}
    <label>EMAIL ADDRESS<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" autoComplete="email"/></label>
    <label>PASSWORD<div className="password-wrap"><input required type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={isRegister?"Create a password":"Enter your password"} autoComplete={isRegister?"new-password":"current-password"}/><button type="button" aria-label={show?"Hide password":"Show password"} aria-pressed={show} onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div></label>
    {isRegister && <label>CONFIRM PASSWORD<input required type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm your password" autoComplete="new-password"/></label>}
    {error && <div className="form-error"><CircleAlert size={15}/>{error}</div>}
    <button className="button auth-submit" type="submit" disabled={loading}>{loading ? "PLEASE WAIT…" : isRegister ? "CREATE ACCOUNT" : "SIGN IN"} <ArrowRight size={16}/></button>
    <div className="auth-switch">{isRegister ? "Already have an account?" : "Don't have an account?"} <a href={isRegister?"/sign-in":"/sign-up"}>{isRegister?"Sign in":"Create account"}</a></div>
  </form><p className="auth-caption">VIBE CODING FOR QA</p></div>

  </div>;
}

function DashboardPage({ user, signOut }: { user: User | null; signOut: () => void }) {
  const [showDesktop,setShowDesktop] = useState(true);
  const token = localStorage.getItem("qabox_token") || "";
  return <><header className="site-header"><div className="nav-wrap"><Brand/><div className="nav-actions"><span className="nav-user">{user?.name || user?.email || "QaBox user"}</span><button className="button button-secondary" onClick={signOut}>Sign out</button></div></div></header><main className="dashboard container"><Eyebrow>DASHBOARD</Eyebrow><h1>Welcome to <span className="text-accent">QaBox.</span></h1><p>Your QA workspace is ready. Download the desktop app to get started.</p><div className="dashboard-cards">{[["Scan pages","Capture DOM structure from any live app"],["AI agents","Connect your AI model via MCP integration"],["Test scripts","Generate automation in your preferred framework"]].map(([title,desc])=><div className="dashboard-card" key={title}><span className="badge badge-accent">READY</span><h3>{title}</h3><p>{desc}</p></div>)}</div><div className="dashboard-next"><small>GET STARTED</small><h2>Continue in QaBox Desktop</h2><p>Open your desktop workspace to scan pages, manage test cases, and generate automation.</p><a className="button" href={`qabox://open?token=${encodeURIComponent(token)}`}>Open QaBox Desktop <ExternalLink size={15}/></a></div></main><Footer/>
    {showDesktop && <div className="modal-backdrop" onClick={()=>setShowDesktop(false)}><div className="desktop-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowDesktop(false)}><X size={17}/></button><div className="modal-brand"><img src="/qabox-logo.png"/> QaBox Desktop</div><Eyebrow>YOU'RE IN</Eyebrow><h2>Open QaBox Desktop App</h2><p>Your account is ready. Open the desktop app to continue in your local QA workspace.</p><a className="button" href={`qabox://open?token=${encodeURIComponent(token)}`}>Open desktop app <ExternalLink size={15}/></a><button className="text-button" onClick={()=>setShowDesktop(false)}>Continue in browser</button></div></div>}
  </>;
}

export default function App() {
  const [path,setPath] = useState(window.location.pathname);
  const [user,setUser] = useState<User|null>(readUser);
  useEffect(()=>{const update=()=>setPath(window.location.pathname);window.addEventListener("popstate",update);return()=>window.removeEventListener("popstate",update);},[]);
  const signOut=()=>{localStorage.removeItem("qabox_token");localStorage.removeItem("qabox_user");setUser(null);window.history.pushState({},"","/");setPath("/");};
  useEffect(()=>{if(path==="/dashboard"&&!localStorage.getItem("qabox_token")){window.history.replaceState({},"","/sign-in");setPath("/sign-in");}else if(path==="/dashboard")setUser(readUser());},[path]);
  const page = useMemo(()=>{
    if(path==="/pricing") return <PricingPage/>;
    if(path==="/docs") return <DocsPage/>;
    if(path==="/sign-in") return <AuthPage key="login" mode="login"/>;
    if(path==="/sign-up") return <AuthPage key="register" mode="register"/>;
    if(path==="/dashboard") return <DashboardPage user={user} signOut={signOut}/>;
    return <HomePage/>;
  },[path,user]);
  return page;
}
