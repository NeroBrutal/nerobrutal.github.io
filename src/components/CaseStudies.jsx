import { motion } from "framer-motion";
import data from "../data/data.json";
import BrowserFrame from "./BrowserFrame";

// Small, honest architecture diagrams — boxes and arrows showing the actual
// data flow each case study describes, not decoration.
function Node({ x, y, w, h, lines, emphasis }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        className={emphasis ? "fill-accent/10 stroke-accent/50" : "fill-surface stroke-border-bright"}
        strokeWidth={1}
      />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="middle">
        {lines.map((line, i) => (
          <tspan
            key={line}
            x={x + w / 2}
            dy={i === 0 ? -((lines.length - 1) * 7) : 14}
            className={emphasis ? "fill-accent" : "fill-text/80"}
            style={{ fontSize: 10.5 }}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-border-bright"
      strokeWidth={1.25}
      markerEnd="url(#arrowhead)"
    />
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-border-bright" />
      </marker>
    </defs>
  );
}

function OrchestrationDiagram() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <ArrowDefs />
      <Node x={20} y={20} w={110} h={34} lines={["OpenAI"]} />
      <Node x={20} y={93} w={110} h={34} lines={["Anthropic"]} />
      <Node x={20} y={166} w={110} h={34} lines={["Google Gemini"]} />

      <Node x={200} y={78} w={150} h={64} lines={["Orchestration Layer", "switching · fallback", "tool calls"]} emphasis />

      <Node x={420} y={24} w={140} h={44} lines={["RAG Knowledge Base", "auto re-indexed"]} />
      <Node x={420} y={152} w={140} h={44} lines={["Redis Cache", "pub/sub streaming"]} />

      <Node x={420} y={88} w={140} h={44} lines={["Agent", "→ government user"]} emphasis />

      <Arrow x1={130} y1={37} x2={198} y2={95} />
      <Arrow x1={130} y1={110} x2={198} y2={110} />
      <Arrow x1={130} y1={183} x2={198} y2={125} />

      <Arrow x1={350} y1={100} x2={418} y2={60} />
      <Arrow x1={350} y1={118} x2={418} y2={172} />
      <Arrow x1={350} y1={110} x2={418} y2={110} />
    </svg>
  );
}

function CommerceDiagram() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <ArrowDefs />
      <Node x={20} y={16} w={120} h={34} lines={["Customer chat"]} />
      <Node x={20} y={93} w={120} h={34} lines={["Voice calls"]} />
      <Node x={20} y={170} w={120} h={34} lines={["Inbound email"]} />

      <Node x={210} y={78} w={150} h={64} lines={["AI + MCP Layer", "helpdesk · voice", "email pipeline"]} emphasis />

      <Node x={420} y={88} w={140} h={44} lines={["Odoo ERP", "operational backbone"]} emphasis />

      <Node x={420} y={16} w={140} h={44} lines={["OdooGPT"]} />
      <Node x={420} y={160} w={140} h={44} lines={["Order sync", "for the voice agent"]} />

      <Arrow x1={140} y1={33} x2={208} y2={95} />
      <Arrow x1={140} y1={110} x2={208} y2={110} />
      <Arrow x1={140} y1={187} x2={208} y2={125} />

      <Arrow x1={360} y1={100} x2={418} y2={105} />
      <Arrow x1={490} y1={88} x2={490} y2={60} />
      <Arrow x1={490} y1={132} x2={490} y2={160} />
    </svg>
  );
}

function PlatformDiagram() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <ArrowDefs />
      <Node x={20} y={20} w={120} h={44} lines={["Company websites", "Astro SSR"]} />
      <Node x={20} y={88} w={120} h={44} lines={["Staff dashboard", "Keycloak login"]} />
      <Node x={20} y={156} w={120} h={44} lines={["Odoo webhooks", "signed"]} />

      <Node x={210} y={70} w={150} h={80} lines={["NestJS API", "40 modules", "590+ operations"]} emphasis />

      <Node x={430} y={16} w={150} h={44} lines={["PostgreSQL 17", "Row-Level Security"]} emphasis />
      <Node x={430} y={88} w={150} h={44} lines={["Outbox → BullMQ", "worker"]} />
      <Node x={430} y={160} w={150} h={44} lines={["Payments · couriers", "Odoo ERP · messaging"]} />

      <Arrow x1={140} y1={42} x2={208} y2={90} />
      <Arrow x1={140} y1={110} x2={208} y2={110} />
      <Arrow x1={140} y1={178} x2={208} y2={130} />

      <Arrow x1={360} y1={90} x2={428} y2={42} />
      <Arrow x1={360} y1={110} x2={428} y2={110} />
      <Arrow x1={505} y1={132} x2={505} y2={158} />
    </svg>
  );
}

function WebDiagram() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <ArrowDefs />
      <Node x={20} y={88} w={110} h={44} lines={["Visitor", "phone · search · AI"]} />

      <Node x={170} y={78} w={130} h={64} lines={["Cloudflare edge", "cache · HTTPS", "AVIF / WebP"]} emphasis />

      <Node x={340} y={78} w={120} h={64} lines={["Astro SSR", "stale-while-", "revalidate cache"]} emphasis />

      <Node x={490} y={30} w={100} h={44} lines={["Store API", "catalog · prices"]} />
      <Node x={490} y={146} w={100} h={44} lines={["Content store", "editable copy"]} />

      <Arrow x1={130} y1={110} x2={168} y2={110} />
      <Arrow x1={300} y1={110} x2={338} y2={110} />
      <Arrow x1={460} y1={96} x2={488} y2={60} />
      <Arrow x1={460} y1={124} x2={488} y2={160} />
    </svg>
  );
}

function InfraDiagram() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <ArrowDefs />
      <Node x={10} y={20} w={110} h={44} lines={["Merge", "→ GitHub Actions"]} />
      <Node x={10} y={88} w={110} h={44} lines={["Build · Trivy scan", "→ ghcr.io"]} />
      <Node x={10} y={156} w={110} h={44} lines={["Visitors", "→ Cloudflare"]} />

      <Node x={170} y={60} w={170} h={100} lines={["Apps server", "Caddy · HTTPS", "API · worker · Keycloak", "dashboard · 6 websites", "13 Docker services"]} emphasis />

      <Node x={400} y={60} w={180} h={64} lines={["Data server", "PostgreSQL 17 · Redis 7", "private network only"]} emphasis />
      <Node x={400} y={160} w={180} h={44} lines={["Cloudflare R2", "encrypted nightly backups"]} />

      <Arrow x1={65} y1={64} x2={65} y2={86} />
      <Arrow x1={120} y1={110} x2={168} y2={100} />
      <Arrow x1={120} y1={178} x2={168} y2={140} />

      <Arrow x1={340} y1={92} x2={398} y2={92} />
      <Arrow x1={490} y1={124} x2={490} y2={158} />
    </svg>
  );
}

const DIAGRAMS = {
  orchestration: OrchestrationDiagram,
  platform: PlatformDiagram,
  infra: InfraDiagram,
  commerce: CommerceDiagram,
  web: WebDiagram,
};

const CaseStudy = ({ study, index }) => {
  const Diagram = DIAGRAMS[study.diagram];

  return (
    <motion.article
      id={study.slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-panel p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
        <h3 className="text-xl sm:text-2xl font-display font-semibold text-text">
          <span className="font-mono text-accent/60 mr-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          {study.title}
        </h3>
        <p className="font-mono text-xs sm:text-sm text-muted whitespace-nowrap">
          {study.org} · {study.timeframe}
        </p>
      </div>

      <div className="max-w-prose">
        <p className="text-sm sm:text-base text-text/90 leading-relaxed mb-6">
          <span className="text-accent font-semibold">The problem. </span>
          {study.problem}
        </p>
      </div>

      {Diagram && (
        <div className="my-8 rounded-xl border border-border bg-bg/40 p-4 sm:p-6">
          <Diagram />
        </div>
      )}

      {study.images && (
        <div className={`my-8 grid gap-6 ${study.images.length > 1 ? "md:grid-cols-2" : ""}`}>
          {study.images.map((img) => (
            <figure key={img.src}>
              <BrowserFrame src={img.src} alt={img.alt} width={1200} height={600} />
              <figcaption className="mt-2 text-xs text-muted leading-relaxed">{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="max-w-prose space-y-3 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-2">Approach</p>
        {study.approach.map((p) => (
          <p key={p} className="text-sm text-muted leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Key decisions</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {study.decisions.map((d) => (
            <div key={d.title} className="border-l-2 border-accent/40 pl-4">
              <p className="text-sm font-semibold text-text mb-1">{d.title}</p>
              <p className="text-xs text-muted leading-relaxed">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-prose border-t border-border pt-6">
        <p className="text-sm text-text/90 leading-relaxed">
          <span className="text-accent font-semibold">Outcome. </span>
          {study.outcome}
        </p>
        {study.links && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

const CaseStudies = () => {
  const studies = data.case_studies;

  return (
    <section id="case-studies" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-24">
      <div className="text-center mb-14">
        <span className="eyebrow">How the work actually went</span>
        <h1 className="section-title">Case Studies</h1>
      </div>

      <div className="flex flex-col gap-10">
        {studies.map((study, i) => (
          <CaseStudy key={study.slug} study={study} index={i} />
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
