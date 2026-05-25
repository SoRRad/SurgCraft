import Link from "next/link"
import {
  BookOpen,
  ExternalLink,
  FileText,
  GraduationCap,
  PlayCircle,
  ScrollText,
  ShieldAlert,
} from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { MayoMark } from "@/components/shell/MayoMark"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "External, faculty-approved references for hand surgery learners. Mayo Clinic first, then guidelines, journals, and video resources.",
}

type Resource = {
  title: string
  url: string
  description: string
  source: string
}

type Section = {
  id: string
  label: string
  icon: typeof BookOpen
  helper: string
  items: Resource[]
}

const SECTIONS: Section[] = [
  {
    id: "mayo",
    label: "Mayo Clinic",
    icon: BookOpen,
    helper:
      "Public Mayo Clinic resources. Faculty internal materials are added after sign-off and tracked in CONTENT_REVIEW.md.",
    items: [
      {
        title: "Mayo Clinic — For Medical Professionals",
        url: "https://www.mayoclinic.org/medical-professionals",
        description: "Mayo's clinician-facing portal: guidelines, referrals, education.",
        source: "mayoclinic.org",
      },
      {
        title: "Mayo Clinic Proceedings",
        url: "https://www.mayoclinicproceedings.org/",
        description: "Peer-reviewed clinical research journal, free to readers.",
        source: "mayoclinicproceedings.org",
      },
      {
        title: "Mayo Clinic Orthopedic Surgery",
        url: "https://www.mayoclinic.org/departments-centers/orthopedic-surgery/sections/overview/ovc-20126733",
        description: "Department overview, faculty list, and education pathways.",
        source: "mayoclinic.org",
      },
      {
        title: "Mayo Clinic Plastic Surgery",
        url: "https://www.mayoclinic.org/departments-centers/plastic-surgery/sections/overview/ovc-20452851",
        description: "Plastic surgery department portal, including hand and microsurgery.",
        source: "mayoclinic.org",
      },
      {
        title: "Mayo Clinic AskMayoExpert (institutional access)",
        url: "https://askmayoexpert.mayoclinic.org/",
        description:
          "Mayo's clinician decision-support knowledge base. Access typically requires Mayo credentials.",
        source: "Mayo internal",
      },
    ],
  },
  {
    id: "guidelines",
    label: "Clinical practice guidelines",
    icon: ScrollText,
    helper: "Open guidelines from national specialty societies, cited and paraphrased — never reproduced verbatim.",
    items: [
      {
        title: "AAOS — Treatment of Distal Radius Fractures (Clinical Practice Guideline)",
        url: "https://www.aaos.org/quality/quality-programs/upper-extremity-programs/distal-radius-fractures/",
        description: "AAOS CPG with evidence summaries and recommendation grades.",
        source: "aaos.org",
      },
      {
        title: "AAOS — Diagnosis and Treatment of Carpal Tunnel Syndrome (CPG)",
        url: "https://www.aaos.org/quality/quality-programs/upper-extremity-programs/carpal-tunnel-syndrome/",
        description: "Diagnostic criteria and treatment recommendations for CTS.",
        source: "aaos.org",
      },
      {
        title: "ASSH — American Society for Surgery of the Hand",
        url: "https://www.assh.org/",
        description: "Specialty society for hand surgery; guidelines, position papers, and patient education.",
        source: "assh.org",
      },
      {
        title: "Surgical Infection Society — Skin and Soft-Tissue Infection Guidelines",
        url: "https://www.sisna.org/guidelines/",
        description: "Evidence-based recommendations for SSI management, including hand infections.",
        source: "sisna.org",
      },
    ],
  },
  {
    id: "journals",
    label: "Journals",
    icon: FileText,
    helper: "Primary literature. Cite and paraphrase, never copy verbatim.",
    items: [
      {
        title: "Journal of Hand Surgery (American Volume)",
        url: "https://www.jhandsurg.org/",
        description: "Official ASSH journal; primary research and clinical reviews.",
        source: "jhandsurg.org",
      },
      {
        title: "Journal of Bone and Joint Surgery (JBJS)",
        url: "https://journals.lww.com/jbjsjournal",
        description: "Premier orthopaedic surgery journal.",
        source: "jbjs.org",
      },
      {
        title: "Plastic and Reconstructive Surgery (PRS)",
        url: "https://journals.lww.com/plasreconsurg",
        description: "Official journal of the American Society of Plastic Surgeons.",
        source: "prs.org",
      },
      {
        title: "Hand (official journal of the American Association for Hand Surgery)",
        url: "https://journals.sagepub.com/home/han",
        description: "Hand-focused journal covering reconstructive and microsurgical topics.",
        source: "sagepub.com",
      },
    ],
  },
  {
    id: "videos",
    label: "Videos & courses",
    icon: PlayCircle,
    helper: "Video resources for technique and exam review. External links only — nothing embedded in-app.",
    items: [
      {
        title: "VuMedi (peer-reviewed surgical video network)",
        url: "https://www.vumedi.com/",
        description: "Surgeon-uploaded technique videos, free with verified clinician account.",
        source: "vumedi.com",
      },
      {
        title: "ASSH Hand-e Learning Center",
        url: "https://www.assh.org/hande/",
        description: "ASSH's curated learning platform with cases, modules, and webinars.",
        source: "assh.org",
      },
      {
        title: "AAOS OrthoPortal — Resident Education",
        url: "https://www.aaos.org/education/resident-education/",
        description: "Resident-level orthopaedic curriculum and assessments.",
        source: "aaos.org",
      },
    ],
  },
  {
    id: "study",
    label: "Exam & study aids",
    icon: GraduationCap,
    helper: "In-service / ABSITE / ABOS / ABPS exam prep. Confirm currency with your program before use.",
    items: [
      {
        title: "Wolfe — Green's Operative Hand Surgery",
        url: "https://www.elsevier.com/books/greens-operative-hand-surgery/wolfe/978-0-323-69793-4",
        description: "Reference textbook for hand surgery training. Cite chapters; never reproduce content.",
        source: "elsevier.com",
      },
      {
        title: "OrthoBullets — Hand & Wrist",
        url: "https://www.orthobullets.com/hand",
        description: "Free educational outlines and question bank for orthopaedic learners.",
        source: "orthobullets.com",
      },
      {
        title: "ABPS — American Board of Plastic Surgery",
        url: "https://www.abplasticsurgery.org/",
        description: "Plastic surgery certification body. Examination content and policies.",
        source: "abplasticsurgery.org",
      },
      {
        title: "ABOS — American Board of Orthopaedic Surgery",
        url: "https://www.abos.org/",
        description: "Orthopaedic certification body. Examination content and policies.",
        source: "abos.org",
      },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <header className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Reference
            </p>
            <h1 className="mt-1.5 font-fraunces text-h1 text-ink heading-readable">
              Resources
            </h1>
            <p className="mt-3 text-body text-ink-muted prose-readable">
              External, faculty-approved references. Mayo Clinic resources first; then national guidelines, peer-reviewed journals, and video / exam-prep links. Open in a new tab; ORION does not embed or scrape third-party content.
            </p>
          </header>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rule bg-bg-elevated p-4">
            <MayoMark size={20} />
            <div>
              <p className="text-small font-medium text-ink">Mayo Clinic affiliation</p>
              <p className="text-small text-ink-muted">
                ORION is being developed for a Mayo Clinic pilot. Materials with the Mayo source label are public Mayo resources today; faculty-curated internal content is added after sign-off (see{" "}
                <Link href="/admin/review" className="text-electric hover:underline">faculty review portal</Link>).
              </p>
            </div>
          </div>

          <nav aria-label="Sections" className="mb-6 flex flex-wrap gap-1.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 rounded-lg border border-rule bg-bg-elevated px-3 py-1.5 text-small text-ink-muted transition-colors duration-150 ease-standard hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                <Icon size={13} className="text-ink-faint" />
                {label}
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <div className="mb-3">
                  <h2
                    id={`${section.id}-heading`}
                    className="flex items-center gap-2 font-fraunces text-h3 text-ink"
                  >
                    <section.icon size={16} className="text-electric" />
                    {section.label}
                  </h2>
                  <p className="mt-1 text-small text-ink-muted">{section.helper}</p>
                </div>

                <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {section.items.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-full flex-col rounded-xl border border-rule bg-bg-elevated p-4 transition-shadow duration-200 ease-standard hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                      >
                        <div className="mb-1.5 flex items-start justify-between gap-2">
                          <h3 className="text-small font-semibold text-ink">{r.title}</h3>
                          <ExternalLink size={13} className="mt-1 flex-shrink-0 text-ink-faint transition-colors duration-150 group-hover:text-electric" />
                        </div>
                        <p className="text-small leading-relaxed text-ink-muted">{r.description}</p>
                        <p className="mt-2 text-micro text-ink-faint">{r.source}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <footer className="mt-12 rounded-xl border border-rule bg-bg-elevated p-4 text-small text-ink-muted">
            <p className="mb-1 flex items-center gap-2 font-medium text-ink">
              <ShieldAlert size={14} className="text-warn" />
              How we cite
            </p>
            <p>
              External resources are listed for navigation only. ORION does not copy textbook or journal content verbatim. Faculty additions and review status are tracked in{" "}
              <Link href="/admin/review" className="text-electric hover:underline">CONTENT_REVIEW.md</Link>.
            </p>
          </footer>
        </div>
      </div>
    </ChatLayout>
  )
}
