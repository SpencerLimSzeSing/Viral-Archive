import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const CONTACT_EMAIL = 'louisemeow67@gmail.com';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = CONTACT_EMAIL;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-800 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Archive</span>
        </button>

        <h1 className="mt-5 font-display text-3xl font-bold text-zinc-50 sm:text-4xl">
          About VIRAL ARCHIVE
        </h1>
        <p className="mt-2 text-base text-zinc-400">
          The original video. The story behind it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <BookOpen className="h-6 w-6 text-emerald-400" aria-hidden="true" />
          <h2 className="mt-3 font-display text-xl font-bold text-zinc-50">
            Why this archive exists
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">
            Viral clips travel across group chats and short-form feeds faster than context does.
            Original uploaders get cropped out, dates are lost, and bystanders are misidentified.
            VIRAL ARCHIVE catalogs notable internet moments — starting with Malaysia — by linking
            to the original post and documenting what actually happened.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-950/30 bg-[#DEC03B] p-6">
          <ShieldCheck className="h-6 w-6 text-zinc-950" aria-hidden="true" />
          <h2 className="mt-3 font-display text-xl font-bold text-zinc-950">
            Respecting platforms & creators
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-900">
            VIRAL ARCHIVE does not download, mirror, or host video files, and never scrapes
            TikTok, Instagram, or Facebook. Entries store metadata and cultural context only,
            using official platform embeds on click or direct links back to the original creator.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="font-display text-xl font-bold text-zinc-50">
          Editorial Standards
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-300">
          <li>
            <span className="font-semibold text-zinc-100">No invented lore:</span> Context
            notes stick strictly to documented origins, platform links, and observable moments
            without fabricated backstory.
          </li>
          <li>
            <span className="font-semibold text-zinc-100">Zero autoplay with sound:</span>{' '}
            Original video embeds load only when you choose to play or inspect a clip.
          </li>
        </ul>
        <div className="mt-5 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-950 bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
          >
            <span>Explore the Archive</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section
        id="feedback"
        aria-labelledby="feedback-heading"
        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-950 text-emerald-300">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="feedback-heading"
              className="font-display text-xl font-bold text-zinc-50"
            >
              Feedback & Contact
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
              Spotted a bug, invalid link, wrong info, missing context, or anything else? Email me
              directly:
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('VIRAL ARCHIVE Feedback')}`}
                className="font-mono text-sm font-medium text-zinc-100 underline decoration-zinc-600 underline-offset-4 hover:decoration-[#EAB308]"
              >
                {CONTACT_EMAIL}
              </a>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopyEmail()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-400"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('VIRAL ARCHIVE Feedback')}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-950 bg-[#FACC15] px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Email Me</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
