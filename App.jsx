import React, { useState } from "react";
import { motion } from "framer-motion";

const MODES = {
  auto: { label: "自動", color1: "#86efac", color2: "#16a34a" },
  secretary: { label: "秘書", color1: "#7dd3fc", color2: "#0284c7" },
  partner: { label: "相棒", color1: "#d8b4fe", color2: "#9333ea" },
  alpha: { label: "α視点", color1: "#fde68a", color2: "#f59e0b" },
};

function chooseMode(text) {
  if (/整理|予定|期限|手順|やること|計画/.test(text)) return "secretary";
  if (/3か月|半年|1年|数年|延長線|先/.test(text)) return "alpha";
  return "partner";
}

function createReply(text, requestedMode) {
  const mode = requestedMode === "auto" ? chooseMode(text) : requestedMode;
  const idea = text.trim();

  if (!idea) {
    return { mode, text: "考えていることを入力してください。そこから一段先へ進めます。" };
  }

  if (mode === "secretary") {
    return {
      mode,
      text: `「${idea}」を整理します。\n\n1. 今日決めること\n2. 情報待ちにすること\n3. 小さく試すこと\n\nまず何を1つ確定させますか？`,
    };
  }

  if (mode === "alpha") {
    return {
      mode,
      text: `「${idea}」を未来予測ではなく、現在からの延長線で見ます。\n\n3か月後に定着する部分は？\n1年後に評価が変わる部分は？\n数年後に別の用途が主役になる可能性は？`,
    };
  }

  return {
    mode,
    text: `「${idea}」を否定せずに加速します。\n\n・この考えを3倍の速度で進めたら、どこが最初に詰まる？\n・別々に見える出来事と、どこでつながる？\n・この結論で見えなくなる景色は？`,
  };
}

export default function App() {
  const [mode, setMode] = useState("auto");
  const [idea, setIdea] = useState("");
  const [reply, setReply] = useState({
    mode: "partner",
    text: "こんにちは。思考加速アバターαです。考えを投げてください。",
  });

  const active = MODES[mode === "auto" ? reply.mode : mode];

  const think = () => {
    setReply(createReply(idea, mode));
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.kicker}>秘書 ＋ 相棒 ＋ α視点</div>
            <h1 style={styles.title}>思考加速アバター α</h1>
            <p style={styles.subtitle}>YESマンではなく、今の考えを一段先へ進めます。</p>
          </div>
          <div style={styles.badge}>最終判断は人間</div>
        </header>

        <div style={styles.grid}>
          <section style={styles.card}>
            <motion.div
              animate={{ y: [0, -10, 0], scaleX: [1, 0.96, 1.03, 1] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              style={{
                ...styles.slime,
                background: `radial-gradient(circle at 35% 25%, ${active.color1}, ${active.color2})`,
                boxShadow: `0 0 45px ${active.color2}88`,
              }}
            >
              <div style={styles.highlight} />
              <div style={{ ...styles.eye, left: 50 }}><span style={styles.spark} /></div>
              <div style={{ ...styles.eye, right: 50 }}><span style={styles.spark} /></div>
              <div style={styles.mouth} />
            </motion.div>

            <div style={styles.modeLabel}>{active.label}モード</div>
            <div style={styles.modeGrid}>
              {Object.entries(MODES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  style={{
                    ...styles.modeButton,
                    ...(mode === key ? styles.modeButtonActive : {}),
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section style={styles.rightColumn}>
            <div style={styles.card}>
              <label style={styles.label}>今ある考えを投げる</label>
              <textarea
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="考えていることを書いてください"
                style={styles.textarea}
              />
              <button onClick={think} style={styles.primaryButton}>一段先へ進める</button>
            </div>

            <motion.div
              key={reply.text}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.reply}
            >
              <div style={styles.replyTitle}>アバターからの返球</div>
              <div style={styles.replyText}>{reply.text}</div>
            </motion.div>
          </section>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "32px 20px",
    background: "radial-gradient(circle at top, #172554, #020617 55%)",
    color: "#f8fafc",
    fontFamily: 'Inter, "Yu Gothic UI", "Meiryo", sans-serif',
    boxSizing: "border-box",
  },
  container: { width: "min(1050px, 100%)", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 28 },
  kicker: { color: "#67e8f9", fontSize: 14, fontWeight: 700 },
  title: { margin: "8px 0", fontSize: "clamp(30px, 5vw, 48px)" },
  subtitle: { margin: 0, color: "#94a3b8" },
  badge: { padding: "10px 14px", borderRadius: 14, background: "#0f172a", border: "1px solid #334155", color: "#a7f3d0" },
  grid: { display: "grid", gridTemplateColumns: "minmax(260px, 330px) minmax(0, 1fr)", gap: 22 },
  card: { background: "rgba(15, 23, 42, 0.92)", border: "1px solid #334155", borderRadius: 24, padding: 22, boxShadow: "0 20px 55px rgba(0,0,0,.28)" },
  slime: { width: 220, height: 190, margin: "18px auto 30px", borderRadius: "52% 52% 43% 43%", border: "4px solid rgba(255,255,255,.55)", position: "relative", overflow: "hidden" },
  highlight: { position: "absolute", width: 80, height: 42, left: 30, top: 18, borderRadius: "50%", background: "rgba(255,255,255,.28)", transform: "rotate(-12deg)" },
  eye: { position: "absolute", top: 72, width: 30, height: 42, borderRadius: "50%", background: "#0f172a" },
  spark: { display: "block", width: 10, height: 10, margin: "8px 0 0 7px", borderRadius: "50%", background: "white" },
  mouth: { position: "absolute", left: "50%", top: 125, width: 45, height: 22, transform: "translateX(-50%)", borderBottom: "5px solid #0f172a", borderRadius: "0 0 50% 50%" },
  modeLabel: { textAlign: "center", fontWeight: 800, fontSize: 20, marginBottom: 14 },
  modeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 },
  modeButton: { border: "1px solid #475569", borderRadius: 12, padding: "10px 8px", background: "#1e293b", color: "#e2e8f0", cursor: "pointer", fontWeight: 700 },
  modeButtonActive: { background: "#22d3ee", color: "#082f49", borderColor: "#67e8f9" },
  rightColumn: { display: "grid", gap: 18 },
  label: { display: "block", fontSize: 19, fontWeight: 800, marginBottom: 12 },
  textarea: { width: "100%", minHeight: 135, resize: "vertical", boxSizing: "border-box", background: "#020617", color: "#f8fafc", border: "1px solid #475569", borderRadius: 14, padding: 14, fontSize: 16, lineHeight: 1.7, outline: "none" },
  primaryButton: { marginTop: 12, border: 0, borderRadius: 12, padding: "12px 18px", background: "#22d3ee", color: "#083344", fontWeight: 900, cursor: "pointer" },
  reply: { background: "rgba(15, 23, 42, 0.92)", border: "1px solid #334155", borderRadius: 24, padding: 22 },
  replyTitle: { color: "#fcd34d", fontWeight: 900, marginBottom: 12 },
  replyText: { whiteSpace: "pre-wrap", lineHeight: 1.9, color: "#e2e8f0" },
};
