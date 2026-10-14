import React from "react";

/**
 * TarotHero (light / plain white version)
 * Left : about tarot + call to action (fades up on load)
 * Right: animated tarot cards. They fly out of a stacked deck into a fan,
 *        float, and flip over one after another. Sparkles twinkle and a
 *        small star orbits around them. Pure SVG + CSS, no image files.
 *
 * Optional: pass `imageSrc` to show your own image instead of the cards.
 */

// ── Icons ────────────────────────────────────────────────────────────────────
const MoonIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M40 8a24 24 0 1 0 16 40A20 20 0 0 1 40 8z" fill="currentColor" fillOpacity="0.18" />
    <circle cx="48" cy="18" r="1.5" fill="currentColor" />
    <circle cx="54" cy="30" r="1" fill="currentColor" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M32 6l7.5 17.5L58 25l-14 12.5L48 56 32 46 16 56l4-18.5L6 25l18.5-1.5z"
      fill="currentColor"
      fillOpacity="0.18"
      strokeLinejoin="round"
    />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="32" cy="32" r="11" fill="currentColor" fillOpacity="0.18" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      return (
        <line
          key={i}
          x1={32 + Math.cos(a) * 16}
          y1={32 + Math.sin(a) * 16}
          x2={32 + Math.cos(a) * 24}
          y2={32 + Math.sin(a) * 24}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

// 4-point sparkle used for the twinkling decorations
const Sparkle = ({ className = "", style }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
    <path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12 6.2-.8 11.2-5.8 12-12z" />
  </svg>
);

// ── One tarot card: back + front, flips in 3D ────────────────────────────────
const CARD_SIZE = "w-40 h-64 sm:w-44 sm:h-72";

const TarotCard = ({ numeral, name, Icon, flipDelay = "0s" }) => (
  <div className={`${CARD_SIZE} relative`} style={{ perspective: "1000px" }}>
    <div
      className="tarot-flip relative h-full w-full"
      style={{ transformStyle: "preserve-3d", animationDelay: flipDelay }}
    >
      {/* FRONT */}
      <div
        className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-xl shadow-purple-900/25"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="relative h-full w-full rounded-[13px] bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-between py-4 text-amber-300">
          <span className="text-xs tracking-[0.3em] font-semibold">{numeral}</span>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-amber-400/15 blur-xl" />
            <Icon />
          </div>
          <span className="text-sm tracking-widest uppercase font-semibold">{name}</span>
          <div className="pointer-events-none absolute inset-2 rounded-lg border border-amber-400/30" />
        </div>
      </div>

      {/* BACK */}
      <div
        className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-xl shadow-purple-900/25"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <div className="relative h-full w-full rounded-[13px] bg-gradient-to-br from-purple-800 via-indigo-900 to-purple-950 flex items-center justify-center text-amber-300">
          <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-90" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="28" strokeDasharray="2 4" />
            <path d="M50 18l6 18 19 1-15 12 5 19-15-11-15 11 5-19-15-12 19-1z" fill="currentColor" fillOpacity="0.2" />
          </svg>
          <div className="pointer-events-none absolute inset-2 rounded-lg border border-amber-400/30" />
        </div>
      </div>
    </div>
  </div>
);

// ── Twinkling sparkles (fixed positions, so nothing jumps on re-render) ──────
const SPARKLES = [
  { top: "6%",  left: "14%", size: "w-4 h-4", color: "text-amber-400",  delay: "0s" },
  { top: "14%", left: "82%", size: "w-3 h-3", color: "text-purple-400", delay: "0.7s" },
  { top: "34%", left: "94%", size: "w-5 h-5", color: "text-amber-300",  delay: "1.3s" },
  { top: "58%", left: "2%",  size: "w-3 h-3", color: "text-pink-400",   delay: "0.4s" },
  { top: "80%", left: "86%", size: "w-4 h-4", color: "text-purple-300", delay: "1.8s" },
  { top: "90%", left: "26%", size: "w-3 h-3", color: "text-amber-400",  delay: "1s" },
  { top: "10%", left: "48%", size: "w-3 h-3", color: "text-pink-300",   delay: "2.2s" },
  { top: "48%", left: "8%",  size: "w-4 h-4", color: "text-purple-400", delay: "2.6s" },
];

export default function TarotHero({
  eyebrow = "Tarot Reading",
  title = "Find clarity through the cards",
  highlight = "clarity",
  description = [
    "Tarot is a 78-card deck used for reflection and guidance. Each card carries imagery and meaning, and a reading uses them to help you look at a question from new angles.",
    "A session is a conversation, not a prediction. The cards give you a starting point to talk through love, work, decisions or a period of change.",
  ],
  points = ["Love & relationships", "Career & money", "Personal growth"],
  primaryLabel = "Request a reading",
  primaryHref = "#tarot-request",
  secondaryLabel = "Meet the reader",
  secondaryHref = "#tarot-reader",
  imageSrc = null,
}) {
  const [before, after] = title.split(highlight);

  return (
    <section className="relative overflow-hidden bg-white text-slate-900">
      {/* Keyframes live here so no tailwind.config change is needed */}
      <style>{`
        @keyframes tarot-fade-up { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes tarot-float   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes tarot-twinkle { 0%,100% { opacity: .2; transform: scale(.6) rotate(0) } 50% { opacity: 1; transform: scale(1.25) rotate(45deg) } }
        @keyframes tarot-spin    { to { transform: rotate(360deg) } }
        @keyframes tarot-flip    { 0%,8% { transform: rotateY(180deg) } 22%,62% { transform: rotateY(0deg) } 76%,100% { transform: rotateY(180deg) } }
        @keyframes tarot-glow    { 0%,100% { opacity: .5; transform: scale(1) } 50% { opacity: .9; transform: scale(1.12) } }

        /* deck fans out on load */
        @keyframes fan-left   { from { transform: translate(0,0) rotate(0) }       to { transform: translate(-6.5rem, 1.5rem) rotate(-12deg) } }
        @keyframes fan-right  { from { transform: translate(0,0) rotate(0) }       to { transform: translate(6.5rem, 1.5rem) rotate(12deg) } }
        @keyframes fan-center { from { transform: translate(0,2rem) scale(.9) }    to { transform: translate(0,-1rem) scale(1) } }

        .tarot-fade-up { opacity: 0; animation: tarot-fade-up .8s ease-out forwards }
        .tarot-float   { animation: tarot-float 6s ease-in-out infinite }
        .tarot-twinkle { animation: tarot-twinkle 3.2s ease-in-out infinite }
        .tarot-orbit   { animation: tarot-spin 16s linear infinite }
        .tarot-ring    { animation: tarot-spin 70s linear infinite }
        .tarot-flip    { animation: tarot-flip 10s ease-in-out infinite }
        .tarot-glow    { animation: tarot-glow 5s ease-in-out infinite }
        .tarot-fan-left   { animation: fan-left 1.3s cubic-bezier(.2,.8,.2,1) .3s both }
        .tarot-fan-right  { animation: fan-right 1.3s cubic-bezier(.2,.8,.2,1) .3s both }
        .tarot-fan-center { animation: fan-center 1.3s cubic-bezier(.2,.8,.2,1) .1s both }

        @media (prefers-reduced-motion: reduce) {
          .tarot-fade-up { opacity: 1; animation: none }
          .tarot-float, .tarot-twinkle, .tarot-orbit, .tarot-ring, .tarot-flip, .tarot-glow { animation: none }
          .tarot-fan-left   { animation: none; transform: translate(-6.5rem, 1.5rem) rotate(-12deg) }
          .tarot-fan-right  { animation: none; transform: translate(6.5rem, 1.5rem) rotate(12deg) }
          .tarot-fan-center { animation: none; transform: translateY(-1rem) }
          .tarot-flip { transform: rotateY(0deg) }
        }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24 grid items-center gap-12 lg:grid-cols-2">
        {/* ── LEFT: about tarot ── */}
        <div>
          <span
            className="tarot-fade-up inline-block mb-4 rounded-full border border-purple-200 bg-purple-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-purple-700"
            style={{ animationDelay: "0.05s" }}
          >
            ✦ {eyebrow}
          </span>

          <h1
            className="tarot-fade-up text-4xl sm:text-5xl font-bold leading-tight text-slate-900"
            style={{ animationDelay: "0.2s" }}
          >
            {before}
            <span className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent">
              {highlight}
            </span>
            {after}
          </h1>

          <div
            className="tarot-fade-up mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: "0.4s" }}
          >
            {description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ul className="tarot-fade-up mt-6 flex flex-wrap gap-2" style={{ animationDelay: "0.6s" }}>
            {points.map((p) => (
              <li
                key={p}
                className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800"
              >
                {p}
              </li>
            ))}
          </ul>

          {/* <div className="tarot-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.8s" }}> */}
            {/* <a
              href={primaryHref}
              className="rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-700/25 transition hover:bg-purple-800 hover:-translate-y-0.5 active:scale-95"
            >
              {primaryLabel}
            </a>
            <a
              href={secondaryHref}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:text-purple-700 active:scale-95"
            >
              {secondaryLabel}
            </a> */}
          {/* </div> */}
        </div>

        {/* ── RIGHT: animation ── */}
        <div className="relative flex items-center justify-center min-h-[24rem] lg:min-h-[32rem]">
          {/* Soft pulsing colour glow behind the cards */}
          <div className="tarot-glow absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-purple-200 via-fuchsia-100 to-amber-100 blur-3xl" />

          {/* Sparkles */}
          {SPARKLES.map((s, i) => (
            <Sparkle
              key={i}
              className={`tarot-twinkle absolute ${s.size} ${s.color}`}
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            />
          ))}

          {/* Slow rotating dotted ring */}
          <svg
            viewBox="0 0 400 400"
            className="tarot-ring absolute w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] text-purple-300"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="200" cy="200" r="190" strokeDasharray="2 10" strokeWidth="2" />
            <circle cx="200" cy="200" r="150" strokeWidth="1" strokeOpacity="0.6" />
          </svg>

          {/* Small star orbiting the cards */}
          <div className="tarot-orbit absolute w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem]">
            <Sparkle className="absolute -top-2 left-1/2 -ml-3 w-6 h-6 text-amber-500 drop-shadow" />
          </div>

          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Tarot"
              className="tarot-float relative z-10 w-64 sm:w-80 rounded-2xl shadow-2xl shadow-purple-900/30 object-cover"
            />
          ) : (
            /* All three cards start stacked in the same grid cell, then fan out */
            <div className="relative z-10 grid place-items-center">
              <div className="col-start-1 row-start-1 tarot-fan-left">
                <div className="tarot-float" style={{ animationDelay: "0.8s" }}>
                  <TarotCard numeral="XVIII" name="The Moon" Icon={MoonIcon} flipDelay="2s" />
                </div>
              </div>
              <div className="col-start-1 row-start-1 tarot-fan-right">
                <div className="tarot-float" style={{ animationDelay: "1.6s" }}>
                  <TarotCard numeral="XIX" name="The Sun" Icon={SunIcon} flipDelay="3.5s" />
                </div>
              </div>
              <div className="col-start-1 row-start-1 z-10 tarot-fan-center">
                <div className="tarot-float">
                  <TarotCard numeral="XVII" name="The Star" Icon={StarIcon} flipDelay="0.5s" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}