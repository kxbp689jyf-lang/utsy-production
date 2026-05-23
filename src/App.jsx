import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Play, ChevronLeft, ChevronRight, Send, Sparkles, ArrowDown, RefreshCw } from "lucide-react";

// =============================================================================
// УЦЫ.ПРОДАКШН
// =============================================================================

const FONT_DISPLAY = { fontFamily: "'Archivo Black', 'Arial Black', sans-serif" };
const FONT_SANS = { fontFamily: "'Space Grotesk', system-ui, sans-serif" };
const FONT_MONO = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

const fadeUp = {
  hidden: { y: 60, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const charReveal = {
  hidden: { y: "110%" },
  visible: (i = 0) => ({
    y: 0,
    transition: { duration: 0.9, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

// =============================================================================
// PARALLAX HOVER CARD
// =============================================================================
function ParallaxCard({ children, className = "", intensity = 14 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });
  const translateX = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const translateY = useSpring(useTransform(y, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      <motion.div
        style={{ x: translateX, y: translateY, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// ROTATING 3D TEXT — для пустого пространства в герое
// =============================================================================
function Rotating3DText() {
  const PHRASES = [
    "ЛУЧШИЕ УСЛОВИЯ НА РЫНКЕ",
    "ТОЧЕЧНЫЙ КРЕАТИВ",
    "ПРОФЕССИОНАЛЬНАЯ КОМАНДА",
    "СИЛЬНЫЙ ВИЗУАЛ",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % PHRASES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{ perspective: 1400 }}
      className="pointer-events-none absolute inset-x-0 bottom-[36%] z-[5] flex items-start justify-center px-6 md:bottom-auto md:top-[58%] md:px-12"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, rotateX: -90, y: 80, scale: 0.85 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotateX: 90, y: -80, scale: 0.85 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d", transformOrigin: "top center" }}
          className="relative w-full max-w-[1100px] text-center"
        >
          {/* Counter label */}
          <div
            style={FONT_MONO}
            className="mb-5 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.5em] text-lime-300/80 md:text-xs"
          >
            <span className="h-px w-10 bg-lime-300/60" />
            {String(idx + 1).padStart(2, "0")} / 04
            <span className="h-px w-10 bg-lime-300/60" />
          </div>
          {/* Main 3D text with attached glow */}
          <div className="relative">
            {/* Glow directly behind the text */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-lime-300/25 blur-3xl"
            />
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotateX: [3, -3, 3],
              rotateY: [-2, 2, -2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...FONT_DISPLAY, transformStyle: "preserve-3d" }}
            className="text-3xl font-black leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {PHRASES[idx].split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.2 + i * 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block", transformStyle: "preserve-3d" }}
                className="mr-4"
              >
                {word.split("").map((ch, j) => (
                  <span
                    key={j}
                    className={(i + j) % 4 === 0 ? "text-lime-300" : ""}
                  >
                    {ch}
                  </span>
                ))}
              </motion.span>
            ))}
          </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// HERO WAVES — animated background filling empty hero space
// =============================================================================
function HeroWaves() {
  const wavePaths = [
    "M0,180 C240,120 480,260 720,200 C960,140 1200,260 1440,180",
    "M0,220 C200,280 500,120 760,220 C1020,320 1240,160 1440,240",
    "M0,260 C280,200 520,340 800,260 C1080,180 1240,320 1440,260",
    "M0,640 C240,580 480,720 720,660 C960,600 1200,720 1440,640",
    "M0,680 C200,740 500,580 760,680 C1020,780 1240,620 1440,700",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {/* SVG waves */}
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#bef264" stopOpacity="0" />
            <stop offset="50%" stopColor="#bef264" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
          </linearGradient>
        </defs>
        {wavePaths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth={1.2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 0.6, 0.4, 0.6],
              y: [0, -10, 0, 10, 0],
            }}
            transition={{
              pathLength: { duration: 2.5, delay: i * 0.3, ease: "easeOut" },
              opacity: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 12 + i * 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </svg>

      {/* Floating glow dots — distributed across full height */}
      {[
        { x: "15%", y: "18%", size: 6, delay: 0 },
        { x: "82%", y: "15%", size: 4, delay: 1.2 },
        { x: "68%", y: "28%", size: 8, delay: 0.6 },
        { x: "28%", y: "38%", size: 5, delay: 1.8 },
        { x: "90%", y: "48%", size: 6, delay: 2.4 },
        { x: "8%", y: "55%", size: 4, delay: 0.3 },
        { x: "45%", y: "78%", size: 7, delay: 1.5 },
        { x: "75%", y: "85%", size: 5, delay: 0.9 },
        { x: "20%", y: "88%", size: 6, delay: 2.1 },
        { x: "92%", y: "75%", size: 4, delay: 3.0 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0.4, 0.8],
            scale: [0, 1, 0.7, 1],
            y: [0, -20, 0, 20, 0],
          }}
          transition={{
            duration: 7 + i,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            boxShadow: `0 0 ${dot.size * 3}px #bef264`,
          }}
          className="absolute rounded-full bg-lime-300"
        />
      ))}

      {/* Vertical accent lines, drifting */}
      {[20, 50, 78].map((leftPct, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: ["0%", "40%", "20%", "35%"],
            opacity: [0, 0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 9 + i * 1.5,
            delay: 0.5 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ left: `${leftPct}%`, top: "12%" }}
          className="absolute w-px bg-gradient-to-b from-lime-300/0 via-lime-300/60 to-lime-300/0"
        />
      ))}
    </div>
  );
}

// =============================================================================
// HERO
// =============================================================================
function Hero({ onCTA }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.85]);

  const TITLE_LINES = [
    { text: "ВЕРТИКАЛЬНЫЙ КОНТЕНТ,", accent: false },
    { text: "КОТОРЫЙ", accent: true },
    { text: "ВЫГЛЯДИТ КАК КИНО", accent: false },
    { text: "СОБИРАЕТ МИЛЛИОНЫ", accent: false },
  ];

  return (
    <section ref={ref} className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/95"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <HeroWaves />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <div style={FONT_DISPLAY} className="text-lg font-black tracking-tighter text-white md:text-xl">
          УЦЫ<span className="text-lime-300">.</span>ПРОДАКШН
        </div>
        <nav style={FONT_MONO} className="hidden gap-8 text-sm font-medium uppercase tracking-widest text-white/80 md:flex">
          <a href="#services" className="transition hover:text-lime-300">Услуги</a>
          <a href="#brief" className="transition hover:text-lime-300">Бриф</a>
        </nav>
        <button
          onClick={onCTA}
          style={FONT_MONO}
          className="hidden rounded-full border border-white/40 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-black md:block"
        >
          Связаться
        </button>
      </header>

      <Rotating3DText />

      <div className="relative z-10 flex h-[calc(100vh-96px)] min-h-[604px] flex-col justify-between px-6 pb-12 md:px-12">
        <div className="mt-2 max-w-[1400px] md:mt-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={FONT_MONO}
            className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-lime-300 md:mb-6 md:text-xs"
          >
            <Sparkles className="h-3 w-3" />
            ПРОДАКШН КОРОТКОГО КОНТЕНТА / МОСКВА
          </motion.p>

          <h1
            style={FONT_DISPLAY}
            className="text-[8.5vw] font-black leading-[0.9] tracking-[-0.04em] text-white md:text-[6.5vw] xl:text-[5.5vw]"
          >
            {TITLE_LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  variants={charReveal}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {line.text}
                  {line.accent && <span className="text-lime-300">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:items-end md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-md text-sm text-white/70 md:text-base"
          >
            Полный цикл производства вертикального контента для брендов и экспертов. Стратегия → производство → постпроизводство → результат.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={onCTA}
            style={FONT_MONO}
            className="group relative overflow-hidden rounded-full bg-lime-300 px-7 py-4 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 md:px-8 md:py-5"
          >
            <span className="relative z-10 flex items-center gap-3">
              Заполнить бриф
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </div>
      </div>

    </section>
  );
}

// =============================================================================
// MARQUEE
// =============================================================================
function Marquee() {
  const ITEMS = [
    "ЛУЧШИЕ УСЛОВИЯ НА РЫНКЕ",
    "ТОЧЕЧНЫЙ КРЕАТИВ",
    "ГАРАНТИЯ РЕЗУЛЬТАТА",
    "ВЫСОКОКАЧЕСТВЕННОЕ ПРОИЗВОДСТВО",
  ];

  return (
    <div className="relative overflow-hidden border-y-4 border-black bg-lime-300 py-6">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={FONT_DISPLAY}
        className="flex whitespace-nowrap text-5xl font-black tracking-tighter text-black md:text-7xl"
      >
        {Array(6)
          .fill(ITEMS)
          .flat()
          .map((t, i) => (
            <span key={i} className="mx-8 flex items-center gap-8">
              {t}
              <span className="text-white">◆</span>
            </span>
          ))}
      </motion.div>
    </div>
  );
}

// =============================================================================
// SERVICES — flip cards with parallax
// =============================================================================
const SERVICES = [
  {
    num: "01",
    title: "Тестовый старт",
    desc: "5 готовых вертикальных роликов и креативная концепция за безопасную стоимость. Идеальный формат, чтобы оценить наш продакшен в деле.",
    stat: "35 000 ₽",
    statLabel: "фиксированная стоимость",
    color: "bg-lime-300",
    back: [
      { type: "p", text: "Тестовый формат сотрудничества, который покажет нашу студию в реальном деле." },
      { type: "h", text: "В пакет включено:" },
      { type: "li", text: "Разработка креативной концепции специально под ваш бизнес." },
      { type: "li", text: "Производство 5 готовых вертикальных роликов." },
      { type: "p", text: "Прозрачные условия: вы платите фиксированную сумму без скрытых платежей. Единственное исключение — платная локация (она оплачивается отдельно, если для съёмок не подходит ваше помещение)." },
      { type: "p", text: "Ваша выгода: это лучшая возможность оценить качество нашего продакшена и комфорт в общении, прежде чем переходить к масштабным проектам." },
    ],
  },
  {
    num: "02",
    title: "Комплексный продакшн",
    desc: "Комплексный контент на месяц вперёд за одну смену.",
    stat: "от 80 000 ₽",
    oldPrice: "140 000 ₽",
    statLabel: "стоимость первой смены",
    color: "bg-white",
    back: [
      { type: "p", text: "Комплексный формат сотрудничества для уверенного визуального и стратегического позиционирования вашего бизнеса." },
      { type: "h", text: "В пакет включено:" },
      { type: "li", text: "Разработка выверенного экспертного формата и сильного креатива специально под вашу нишу." },
      { type: "li", text: "Производство контента на целый месяц вперёд с акцентом на высокое качество визуальной подачи — работаем полностью «под ключ»." },
      { type: "p", text: "Прозрачные условия: мы бережём ваш ресурс и не отвлекаем от бизнес-процессов. От вас потребуется всего 1 съёмочный день — всю остальную работу студия берёт на себя." },
      { type: "p", text: "Ваша выгода: это проверенный формат, который обеспечивает максимальные охваты и работает на сильную репутацию вашего бренда без потери вашего личного времени." },
    ],
  },
  {
    num: "03",
    title: "Custom-производство",
    desc: "Организация и съёмка по сценариям клиента. Ноль хаоса, чёткий процесс.",
    stat: "от 45 000 ₽",
    statLabel: "стоимость",
    color: "bg-orange-400",
    back: [
      { type: "p", text: "Идеальный формат для тех, у кого уже есть готовые идеи. Вы занимаетесь стратегией, а мы берём на себя качественное производство." },
      { type: "h", text: "В пакет включено:" },
      { type: "li", text: "Производство контента и организация съёмок строго под ваши креативы и сценарии." },
      { type: "li", text: "Работа слаженной постоянной команды, которая обеспечивает высокий уровень визуала и комфортную атмосферу на площадке." },
      { type: "p", text: "Прозрачные условия: вы получаете стоимость ниже рынка исключительно за счёт грамотного менеджмента и оптимизации процессов. Мы принципиально не оцениваем размер кошелька клиента, а предлагаем честную и понятную цену, основанную на реальной себестоимости работы." },
      { type: "p", text: "Ваша выгода: вы не переплачиваете за услуги и получаете контент отличного качества, доверяя техническую и визуальную реализацию своего маркетинга надёжным исполнителям." },
    ],
  },
];

// =============================================================================
// SCROLLABLE TEXT — renders blocks (p / h / li) with side scroll buttons
// =============================================================================
function AnimatedBullet({ delay = 0 }) {
  return (
    <span className="relative mt-[7px] flex h-3 w-3 shrink-0 items-center justify-center">
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-2.5 w-2.5 rounded-full bg-lime-300"
        />
        <span className="relative h-2 w-2 rounded-full bg-lime-300" />
      </motion.span>
    </span>
  );
}

function ScrollableText({ content }) {
  const scrollRef = useRef(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const checkPosition = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 2);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
  };

  useEffect(() => {
    checkPosition();
  }, [content]);

  const scrollBy = (dir, e) => {
    e.stopPropagation();
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ top: dir * 80, behavior: "smooth" });
  };

  // backward compat: support plain string
  const blocks = Array.isArray(content)
    ? content
    : String(content).split("\n\n").map((t) => ({ type: "p", text: t }));

  let liIndex = 0;

  return (
    <div className="flex flex-1 gap-3 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={checkPosition}
        onClick={(e) => e.stopPropagation()}
        className="flex-1 space-y-3 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {blocks.map((b, i) => {
          if (b.type === "h") {
            return (
              <div
                key={i}
                style={FONT_MONO}
                className="pt-1 text-[11px] uppercase tracking-[0.25em] text-lime-300"
              >
                {b.text}
              </div>
            );
          }
          if (b.type === "li") {
            const delay = liIndex * 0.15;
            liIndex += 1;
            return (
              <div key={i} className="flex items-start gap-3 pl-1">
                <AnimatedBullet delay={delay} />
                <p className="text-sm leading-relaxed text-white/85 md:text-[15px]">{b.text}</p>
              </div>
            );
          }
          return (
            <p
              key={i}
              className="text-sm leading-relaxed text-white/80 md:text-[15px]"
            >
              {b.text}
            </p>
          );
        })}
      </div>

      {/* Side scroll controls */}
      <div className="flex flex-col items-center justify-center gap-2">
        <button
          onClick={(e) => scrollBy(-1, e)}
          disabled={atTop}
          aria-label="Scroll up"
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
            atTop
              ? "border-white/15 text-white/20"
              : "border-lime-300 text-lime-300 hover:bg-lime-300 hover:text-black"
          }`}
        >
          <ArrowDown className="h-4 w-4 rotate-180" />
        </button>
        <div className="h-12 w-px bg-white/15" />
        <button
          onClick={(e) => scrollBy(1, e)}
          disabled={atBottom}
          aria-label="Scroll down"
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
            atBottom
              ? "border-white/15 text-white/20"
              : "border-lime-300 text-lime-300 hover:bg-lime-300 hover:text-black"
          }`}
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FlipCard({ service }) {
  const [flipped, setFlipped] = useState(false);

  // Parallax tilt (pointer-driven)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onParallaxMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onParallaxLeave = () => { px.set(0); py.set(0); };

  return (
    <div
      style={{ perspective: 2000, height: "420px", width: "100%" }}
      onMouseMove={onParallaxMove}
      onMouseLeave={onParallaxLeave}
    >
      {/* Outer wrapper applies parallax tilt to the WHOLE card (front & back) */}
      <motion.div
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          height: "100%",
          width: "100%",
        }}
        className="cursor-pointer"
      >
        {/* Inner wrapper handles the flip animation */}
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            height: "100%",
            width: "100%",
          }}
        >
          {/* FRONT */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: flipped ? "none" : "auto",
            }}
            className="absolute inset-0"
          >
            <div
              onClick={() => setFlipped(true)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-white/10 ${service.color} p-7 md:p-10 cursor-pointer`}
            >
              {/* Discount corner badge */}
              {service.oldPrice && (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 12 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute -right-4 -top-4 z-10 flex h-24 w-24 items-center justify-center md:-right-2 md:-top-2 md:h-28 md:w-28"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-2 rounded-full bg-black"
                  />
                  {/* Core badge */}
                  <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-black text-center md:h-24 md:w-24">
                    <span style={FONT_DISPLAY} className="text-2xl font-black leading-none tracking-tighter text-lime-300 md:text-3xl">
                      −33%
                    </span>
                    <span style={FONT_MONO} className="mt-1 text-[8px] uppercase tracking-widest text-white/70 md:text-[9px]">
                      Скидка
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="mb-8 flex items-start justify-between">
                <span style={FONT_MONO} className="text-sm font-bold text-black/60">{service.num} / 03</span>
                <span style={FONT_MONO} className={`text-[10px] uppercase tracking-widest text-black/50 ${service.oldPrice ? "opacity-0" : ""}`}>
                  ↻ Нажми
                </span>
              </div>

              <h3 style={FONT_DISPLAY} className="mb-4 text-3xl font-black leading-[0.95] tracking-tight text-black md:text-4xl">
                {service.title}
              </h3>

              <p className="mb-auto max-w-md text-base text-black/70 md:text-lg">{service.desc}</p>

              <div className="mt-6 flex items-end justify-between border-t-2 border-black/20 pt-5">
                <div>
                  {service.oldPrice && (
                    <div style={FONT_DISPLAY} className="mb-1 text-base font-black tracking-tighter text-black/40 line-through md:text-lg">
                      {service.oldPrice}
                    </div>
                  )}
                  <div style={FONT_DISPLAY} className="text-3xl font-black tracking-tighter text-black md:text-4xl">
                    {service.stat}
                  </div>
                  <div style={FONT_MONO} className="mt-1 text-xs uppercase tracking-widest text-black/60">
                    {service.statLabel}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:rotate-180 md:h-14 md:w-14">
                  <RefreshCw className="h-5 w-5" />
                </div>
              </div>
            </div>
        </div>

        {/* BACK */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
          className="absolute inset-0"
        >
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-lime-300/40 bg-black p-7 md:p-10">
            <div className="mb-4 flex items-start justify-between">
              <span style={FONT_MONO} className="text-sm font-bold text-lime-300">{service.num} / 03</span>
              <button
                onClick={() => setFlipped(false)}
                style={FONT_MONO}
                className="text-[10px] uppercase tracking-widest text-white/50 transition hover:text-lime-300"
              >
                ↻ Назад
              </button>
            </div>

            <h3 style={FONT_DISPLAY} className="mb-4 text-2xl font-black leading-[0.95] tracking-tight text-lime-300 md:text-3xl">
              {service.title}
            </h3>

            <ScrollableText content={service.back} />

            <div className="mt-5 flex items-end justify-between border-t-2 border-white/20 pt-5">
              <div style={FONT_DISPLAY} className="text-2xl font-black tracking-tighter text-lime-300 md:text-3xl">
                {service.stat}
              </div>
              <button
                onClick={() => setFlipped(false)}
                aria-label="Перевернуть карточку"
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-lime-300 bg-transparent text-lime-300 transition hover:bg-lime-300 hover:text-black md:h-14 md:w-14"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="relative bg-black px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p style={FONT_MONO} className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-lime-300">
              <Sparkles className="h-3 w-3" />
              Что мы делаем
            </p>
            <h2 style={FONT_DISPLAY} className="text-6xl font-black leading-[0.9] tracking-tighter text-white md:text-8xl">
              Услуги<span className="text-lime-300">.</span>
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} custom={1} className="max-w-md text-white/60">
            Три пакета — от точечных съёмок до полной системы контента для масштабирования бизнеса.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <FlipCard service={s} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// PORTFOLIO ROULETTE
// =============================================================================
const WORKS = [
  { brand: "Beauty Lab", problem: "Низкий охват у нового салона", solution: "Серия экспертных reels", result: "2.4M", metric: "просмотров за месяц", thumb: "https://images.unsplash.com/photo-1522335789203-aaa687acefe9?w=600&q=80" },
  { brand: "FitPro", problem: "Конверсия в заявку < 1%", solution: "Контент-воронка из 30 видео", result: "8.2%", metric: "конверсия в лид", thumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
  { brand: "DevAgency", problem: "Бренд неизвестен в B2B", solution: "Экспертный контент CEO", result: "850K", metric: "охват / 6 недель", thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80" },
  { brand: "Coffee Bar", problem: "Сезонный спад продаж", solution: "Креативные ролики локации", result: "+312%", metric: "посещаемость", thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80" },
  { brand: "EduTech", problem: "Холодный трафик дорогой", solution: "Reels-машина 60 видео/мес", result: "₽14", metric: "цена лида", thumb: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  { brand: "Luxury Auto", problem: "Премиум-аудитория не в TikTok", solution: "Визуальный экспертный контент", result: "1.1M", metric: "органический охват", thumb: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80" },
  { brand: "Restaurant Mio", problem: "Пустые будни", solution: "UGC + креативные reels", result: "+78%", metric: "будние брони", thumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
];

function PortfolioRoulette() {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector("[data-card]");
    if (!card) return;
    const cardW = card.getBoundingClientRect().width + 24;
    trackRef.current.scrollBy({ left: cardW * dir, behavior: "smooth" });
    setIndex((p) => Math.max(0, Math.min(WORKS.length - 1, p + dir)));
  };

  return (
    <section id="works" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto mb-16 max-w-[1600px] px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center"
        >
          <motion.h2
            variants={fadeUp}
            style={FONT_DISPLAY}
            className="text-6xl font-black leading-[0.9] tracking-tighter text-black md:text-8xl"
          >
            Портфолио<span className="text-lime-500">.</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            style={FONT_MONO}
            className="mt-6 text-xs uppercase tracking-[0.3em] text-black/50 md:text-sm"
          >
            Большая часть работ под NDA
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="mt-10 flex items-center gap-4">
            <span style={FONT_MONO} className="text-sm text-black/60">
              {String(index + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => scroll(-1)}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-black transition hover:bg-black hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-black transition hover:bg-black hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-12 md:px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {WORKS.map((w, i) => (
          <motion.div
            data-card
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative shrink-0 snap-start"
          >
            <ParallaxCard intensity={8} className="w-[260px] md:w-[340px]">
              <div
                className="relative overflow-hidden rounded-3xl border-2 border-black bg-black"
                style={{ aspectRatio: "9/16" }}
              >
                <img src={w.thumb} alt={w.brand} className="absolute inset-0 h-full w-full object-cover" />

                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-lime-300 text-black md:h-14 md:w-14">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </div>

                <div style={FONT_MONO} className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                  {w.brand}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 md:p-6">
                  <div style={FONT_DISPLAY} className="text-5xl font-black leading-none tracking-tighter text-lime-300 md:text-6xl">
                    {w.result}
                  </div>
                  <div style={FONT_MONO} className="mt-1 text-[10px] uppercase tracking-widest text-white/80 md:text-xs">
                    {w.metric}
                  </div>
                </div>

                <AnimatePresence>
                  {hoveredIdx === i && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex flex-col justify-end bg-black/95 p-5 md:p-6"
                    >
                      <div className="space-y-4 text-white">
                        <div>
                          <div style={FONT_MONO} className="mb-1 text-[10px] uppercase tracking-widest text-lime-300">Проблема</div>
                          <div className="text-sm font-medium md:text-base">{w.problem}</div>
                        </div>
                        <div>
                          <div style={FONT_MONO} className="mb-1 text-[10px] uppercase tracking-widest text-lime-300">Решение</div>
                          <div className="text-sm font-medium md:text-base">{w.solution}</div>
                        </div>
                        <div className="border-t border-white/20 pt-4">
                          <div style={FONT_DISPLAY} className="text-4xl font-black leading-none tracking-tighter text-lime-300">{w.result}</div>
                          <div style={FONT_MONO} className="mt-1 text-[10px] uppercase tracking-widest text-white/60">{w.metric}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ParallaxCard>
          </motion.div>
        ))}

        <div className="flex w-[260px] shrink-0 items-center justify-center md:w-[340px]">
          <a
            href="#brief"
            className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/30 px-6 text-center transition hover:border-black hover:bg-lime-300"
          >
            <div style={FONT_DISPLAY} className="text-4xl font-black tracking-tighter text-black">+50</div>
            <div style={FONT_MONO} className="mt-2 text-xs uppercase tracking-widest text-black/60">кейсов в портфолио</div>
            <div style={FONT_MONO} className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-black">
              Запросить полное <ArrowRight className="h-3 w-3" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// BRIEF + FOOTER
// =============================================================================
function BriefSection({ formRef }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", task: "" });

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={formRef} id="brief" className="relative bg-lime-300 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          <motion.p variants={fadeUp} style={FONT_MONO} className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-black">
            <Sparkles className="h-3 w-3" />
            Бриф / Заявка
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            style={FONT_DISPLAY}
            className="mb-12 text-6xl font-black leading-[0.85] tracking-tighter text-black md:text-9xl"
          >
            Поехали<span className="text-white">.</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={submit}
                  className="space-y-8"
                >
                  {[
                    { label: "Как вас зовут?", key: "name", type: "text", placeholder: "Имя" },
                    { label: "Контакт (TG / WhatsApp / email)", key: "contact", type: "text", placeholder: "@username" },
                    { label: "Кратко о задаче", key: "task", type: "textarea", placeholder: "Что нужно снять?" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={FONT_MONO} className="mb-3 block text-xs uppercase tracking-widest text-black/70">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          required
                          rows={3}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={FONT_DISPLAY}
                          className="w-full resize-none border-b-2 border-black/30 bg-transparent pb-2 text-2xl font-bold tracking-tight text-black placeholder-black/30 outline-none transition focus:border-black md:text-4xl"
                        />
                      ) : (
                        <input
                          required
                          type={field.type}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={FONT_DISPLAY}
                          className="w-full border-b-2 border-black/30 bg-transparent pb-2 text-2xl font-bold tracking-tight text-black placeholder-black/30 outline-none transition focus:border-black md:text-4xl"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    style={FONT_MONO}
                    className="group flex items-center gap-4 rounded-full bg-black px-8 py-5 text-sm font-bold uppercase tracking-widest text-lime-300 transition-transform hover:scale-105"
                  >
                    Отправить бриф
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border-2 border-black bg-black p-12 text-lime-300"
                >
                  <div style={FONT_DISPLAY} className="text-5xl font-black tracking-tighter md:text-7xl">
                    Принято.
                  </div>
                  <p className="mt-4 max-w-md text-white/70">
                    Свяжемся в течение 2 часов в рабочее время. Подготовьте референсы — они ускорят процесс.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-2 md:pl-12">
            <div className="space-y-10">
              <div>
                <div style={FONT_MONO} className="mb-3 text-xs uppercase tracking-widest text-black/60">
                  Прямой контакт
                </div>
                <a href="https://t.me/utsy" style={FONT_DISPLAY} className="block text-3xl font-black tracking-tighter text-black transition hover:text-white md:text-4xl">
                  @utsy
                </a>
                <a href="mailto:hi@utsy.pro" style={FONT_DISPLAY} className="mt-2 block text-2xl font-black tracking-tighter text-black transition hover:text-white md:text-3xl">
                  hi@utsy.pro
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t-2 border-black pt-8 md:flex-row md:items-center md:justify-between">
          <div style={FONT_DISPLAY} className="text-2xl font-black tracking-tighter text-black">
            УЦЫ.ПРОДАКШН © 2026
          </div>
          <div style={FONT_MONO} className="flex gap-6 text-xs uppercase tracking-widest text-black/60">
            <a href="#" className="transition hover:text-black">Telegram</a>
            <a href="#" className="transition hover:text-black">Instagram</a>
            <a href="#" className="transition hover:text-black">YouTube</a>
            <a href="#" className="transition hover:text-black">Privacy</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// ROOT
// =============================================================================
export default function App() {
  const briefRef = useRef(null);
  const scrollToBrief = () => briefRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      [style*="scrollbarWidth"]::-webkit-scrollbar { display: none; }
      html { scroll-behavior: smooth; }
    `;
    document.head.appendChild(style);

    return () => {
      try { document.head.removeChild(link); } catch (e) {}
      try { document.head.removeChild(style); } catch (e) {}
    };
  }, []);

  return (
    <div style={FONT_SANS} className="min-h-screen bg-black text-white antialiased">
      <Hero onCTA={scrollToBrief} />
      <Services />
      <BriefSection formRef={briefRef} />
    </div>
  );
}
