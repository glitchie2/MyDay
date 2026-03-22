import { useState, useEffect } from "react";

const STORAGE_KEY = "daily-schedule-v1";

const schedule = [
  {
    period: "MORNING", emoji: "🌅", time: "First 60 min", color: "#C8962A",
    purpose: "Anchor before the world rushes in",
    items: [
      { id: "m1", task: "Same wake time", note: "Even weekends. Consistency = safety signal." },
      { id: "m2", task: "No phone — 30 min", note: "Touch base with yourself first." },
      { id: "m3", task: "Body grounding", note: "Stretch, breathe, or slow walk." },
      { id: "m4", task: "Warm drink, no multitasking", note: "A micro-practice of presence." },
      { id: "m5", task: "One journal sentence", note: "How do I feel right now?" },
      { id: "m6", task: "Sunlight in first hour", note: "Anchors rhythm. Affects serotonin." },
    ]
  },
  {
    period: "WORK BLOCK", emoji: "🎯", time: "3–4 hours", color: "#4A90A4",
    purpose: "Build evidence of capability",
    items: [
      { id: "w1", task: "Set ONE clear intention", note: "What does done look like today?" },
      { id: "w2", task: "45 min focus / 10 min break", note: "Each cycle = evidence you can." },
      { id: "w3", task: "Body breaks only", note: "Walk, stretch. No scrolling." },
      { id: "w4", task: "One task at a time", note: "Lists trigger overwhelm. One is enough." },
    ]
  },
  {
    period: "MIDDAY", emoji: "☀️", time: "30–45 min", color: "#B05C5C",
    purpose: "Don't let this become a black hole",
    items: [
      { id: "n1", task: "Eat without a screen", note: "Sensory presence. Easy mindfulness." },
      { id: "n2", task: "Short walk outside", note: "Light + movement + being among humans." },
      { id: "n3", task: "Low-effort tasks only", note: "Admin, reading. Save hard thinking." },
    ]
  },
  {
    period: "AFTERNOON", emoji: "🌤", time: "2–3 hours", color: "#7A5FA8",
    purpose: "Work with your energy, not against it",
    items: [
      { id: "a1", task: "No caffeine to fight the dip", note: "Use it for lighter tasks instead." },
      { id: "a2", task: "Second work block", note: "Emails, organizing, reading." },
      { id: "a3", task: "Hard stop — same time daily", note: "Boundaries with work = self-respect." },
    ]
  },
  {
    period: "EVENING", emoji: "🌙", time: "Until sleep", color: "#3D8A5E",
    purpose: "Bridge back to yourself",
    items: [
      { id: "e1", task: "Small social contact", note: "A message or brief call. Isolation feeds itself." },
      { id: "e2", task: "20 min walk if no morning move", note: "Mood + sleep improve within 2 weeks." },
      { id: "e3", task: "One thing purely for pleasure", note: "Not earned — deserved." },
      { id: "e4", task: "Wind-down routine", note: "30–45 min before sleep. No work, dim lights." },
      { id: "e5", task: "Same sleep time", note: "Nervous system needs a runway, not a crash." },
    ]
  }
];

const themes = {
  dark: {
    bg: "#0a0a0c",
    bgCard: "#111113",
    border: "#1e1e1e",
    borderStrong: "#2a2a2e",
    text: "#d8d4cc",
    textHeading: "#f0ebe0",
    textMuted: "#555",
    textDimmer: "#3a3a3a",
    textDone: "#444",
    noteText: "#3e3e3e",
    tabInactive: "#555",
    tabBorderInactive: "#222",
    navBg: "#0a0a0c",
    navBorder: "#1a1a1a",
  },
  light: {
    bg: "#f5f2ec",
    bgCard: "#ffffff",
    border: "#e0dbd0",
    borderStrong: "#ccc6ba",
    text: "#2a2520",
    textHeading: "#1a1510",
    textMuted: "#8a8070",
    textDimmer: "#aaa090",
    textDone: "#b0a898",
    noteText: "#9a9080",
    tabInactive: "#8a8070",
    tabBorderInactive: "#ddd8cc",
    navBg: "#f5f2ec",
    navBorder: "#ddd8cc",
  }
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

export default function MobileDailySchedule() {
  const [checked, setChecked] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Detect system color scheme + listen for changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { date, data } = JSON.parse(raw);
        if (date === getTodayKey()) setChecked(data);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), data: checked }));
    } catch {}
  }, [checked, loaded]);

  const t = isDark ? themes.dark : themes.light;
  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const totalItems = schedule.reduce((acc, s) => acc + s.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);
  const current = schedule[activeSection];

  return (
    <div style={{
      maxWidth: "430px", margin: "0 auto", minHeight: "100vh",
      background: t.bg, fontFamily: "'Georgia', serif", color: t.text,
      display: "flex", flexDirection: "column",
      transition: "background 0.35s ease, color 0.35s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        .mono { font-family: 'DM Mono', monospace; }
        .serif { font-family: 'Playfair Display', serif; }
        .tab-btn { transition: all 0.2s ease; }
        .tab-btn:active { transform: scale(0.95); }
        .item-card { transition: opacity 0.2s ease, transform 0.15s ease; }
        .item-card:active { transform: scale(0.98); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.25s ease forwards; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Top bar */}
      <div style={{ padding: "20px 20px 0", background: t.bg, zIndex: 10, transition: "background 0.35s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div className="mono" style={{ fontSize: "9px", letterSpacing: "2px", color: t.textDimmer, marginBottom: "4px", transition: "color 0.35s ease" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase()}
            </div>
            <h1 className="serif" style={{ fontSize: "22px", fontWeight: 400, color: t.textHeading, lineHeight: 1.1, transition: "color 0.35s ease" }}>
              Your Day
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: "22px", color: current.color, lineHeight: 1, transition: "color 0.35s ease" }}>
              {progress}%
            </div>
            <div className="mono" style={{ fontSize: "9px", color: t.textMuted, marginTop: "2px", transition: "color 0.35s ease" }}>
              {checkedCount}/{totalItems} done
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: "2px", background: t.border, borderRadius: "2px", marginBottom: "20px", transition: "background 0.35s ease" }}>
          <div style={{
            height: "100%", width: `${progress}%`, background: current.color,
            borderRadius: "2px", transition: "width 0.4s ease, background 0.35s ease",
          }} />
        </div>

        {/* Scrollable section tabs */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px" }}>
          {schedule.map((s, i) => {
            const sectionChecked = s.items.filter(it => checked[it.id]).length;
            const allDone = sectionChecked === s.items.length;
            const isActive = activeSection === i;
            return (
              <button key={s.period} className="tab-btn" onClick={() => setActiveSection(i)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: "20px",
                border: `1.5px solid ${isActive ? s.color : t.tabBorderInactive}`,
                background: isActive ? `${s.color}18` : "transparent",
                color: isActive ? s.color : t.tabInactive,
                fontSize: "11px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px",
                transition: "all 0.2s ease",
              }}>
                <span style={{ fontSize: "13px" }}>{s.emoji}</span>
                <span>{s.period}</span>
                {allDone
                  ? <span style={{ color: s.color, fontSize: "10px" }}>✓</span>
                  : sectionChecked > 0 && <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
                }
              </button>
            );
          })}
        </div>
      </div>

      {/* Section content */}
      <div key={activeSection} className="slide-in" style={{ flex: 1, padding: "8px 20px 120px", overflowY: "auto" }}>

        {/* Section header */}
        <div style={{ padding: "16px 0 20px", borderBottom: `1px solid ${current.color}33`, marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "28px" }}>{current.emoji}</span>
            <div>
              <div className="serif" style={{ fontSize: "20px", color: t.textHeading, fontWeight: 400, transition: "color 0.35s ease" }}>
                {current.period.charAt(0) + current.period.slice(1).toLowerCase()}
              </div>
              <div className="mono" style={{ fontSize: "10px", color: current.color }}>{current.time}</div>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: t.textMuted, fontStyle: "italic", paddingLeft: "38px", transition: "color 0.35s ease" }}>
            {current.purpose}
          </p>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {current.items.map((item) => {
            const done = checked[item.id];
            return (
              <div key={item.id} className="item-card" onClick={() => toggle(item.id)} style={{
                display: "flex", gap: "14px", padding: "16px", borderRadius: "4px",
                background: t.bgCard,
                border: `1px solid ${done ? current.color + "44" : t.border}`,
                cursor: "pointer", opacity: done ? 0.45 : 1, userSelect: "none",
                transition: "background 0.35s ease, border-color 0.2s ease, opacity 0.2s ease",
              }}>
                {/* Checkbox */}
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%",
                  border: `1.5px solid ${done ? current.color : t.borderStrong}`,
                  background: done ? `${current.color}22` : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "1px", transition: "all 0.15s ease",
                }}>
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5L4.5 8L9 3" stroke={current.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="serif" style={{
                    fontSize: "16px", color: done ? t.textDone : t.text,
                    textDecoration: done ? "line-through" : "none",
                    marginBottom: "5px", lineHeight: 1.3,
                    transition: "color 0.35s ease",
                  }}>
                    {item.task}
                  </div>
                  <div style={{ fontSize: "12px", color: t.noteText, fontStyle: "italic", lineHeight: 1.4, transition: "color 0.35s ease" }}>
                    {item.note}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section completion */}
        {current.items.every(it => checked[it.id]) && (
          <div style={{
            marginTop: "20px", padding: "16px", borderRadius: "4px",
            background: `${current.color}11`, border: `1px solid ${current.color}33`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "22px", marginBottom: "6px" }}>✦</div>
            <div className="serif" style={{ fontSize: "14px", color: current.color, fontStyle: "italic" }}>
              {activeSection < schedule.length - 1
                ? `${current.period.charAt(0) + current.period.slice(1).toLowerCase()} complete. Move to ${schedule[activeSection + 1].period.charAt(0) + schedule[activeSection + 1].period.slice(1).toLowerCase()}.`
                : "Full day complete. You showed up for yourself today."}
            </div>
            {activeSection < schedule.length - 1 && (
              <button onClick={() => setActiveSection(activeSection + 1)} style={{
                marginTop: "12px", padding: "10px 20px",
                background: current.color, color: isDark ? "#0a0a0c" : "#ffffff",
                border: "none", borderRadius: "20px", fontSize: "12px",
                fontFamily: "'DM Mono', monospace", cursor: "pointer", letterSpacing: "0.5px",
              }}>
                Next: {schedule[activeSection + 1].emoji} {schedule[activeSection + 1].period}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "430px",
        background: t.navBg, borderTop: `1px solid ${t.navBorder}`,
        padding: "12px 20px 24px",
        display: "flex", justifyContent: "space-between", zIndex: 20,
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}>
        {schedule.map((s, i) => (
          <button key={s.period} className="tab-btn" onClick={() => setActiveSection(i)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "4px", padding: "4px 8px",
          }}>
            <span style={{ fontSize: "20px", opacity: activeSection === i ? 1 : 0.35, transition: "opacity 0.2s ease" }}>{s.emoji}</span>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: activeSection === i ? s.color : "transparent",
              transition: "background 0.2s ease",
            }} />
          </button>
        ))}
      </div>
    </div>
  );
}
