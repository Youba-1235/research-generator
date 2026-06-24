import { useState, useRef } from "react";

const STEPS = ["بيانات البحث", "النتائج", "تصدير PDF"];

const specializations = [
  "القانون والعلوم السياسية",
  "الاقتصاد والتسيير",
  "العلوم الاجتماعية والإنسانية",
  "الطب والصحة العامة",
  "العلوم التقنية والهندسة",
  "التربية وعلم النفس",
  "الأدب واللغويات",
  "التاريخ والجغرافيا",
  "الإعلام والاتصال",
  "أخرى",
];

const levels = ["بكالوريوس", "ماستر / ماجستير", "دكتوراه", "بحث أكاديمي"];

// ✅ مفتاح API من متغيرات البيئة (آمن على Vercel)
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0" }}>
      <div style={{
        width: 48, height: 48, border: "3px solid #e2e8f0",
        borderTop: "3px solid #1e3a5f", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#64748b", fontSize: 15 }}>جارٍ توليد البحث بالذكاء الاصطناعي...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span style={{
      background: "#e8f0fb", color: "#1e3a5f", fontSize: 12,
      padding: "3px 10px", borderRadius: 20, fontWeight: 600
    }}>{text}</span>
  );
}

function Section({ icon, title, children, accent }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `1.5px solid ${accent || "#e2e8f0"}`,
      padding: "22px 26px", marginBottom: 18
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    specialization: "", level: "", topic: "", keywords: "", withRefs: true,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const printRef = useRef();

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.specialization && form.level && form.topic.trim().length > 5;

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `أنت مساعد أكاديمي متخصص في صياغة عناوين وخطط البحث العلمي.

المطلوب: قم بتوليد مقترح بحثي كامل للمعطيات التالية:
- التخصص: ${form.specialization}
- المستوى الدراسي: ${form.level}
- الموضوع العام: ${form.topic}
${form.keywords ? `- الكلمات المفتاحية: ${form.keywords}` : ""}

أجب فقط بـ JSON صحيح بدون أي نص خارجه، بهذا الهيكل بالضبط:
{
  "title": "عنوان البحث المقترح",
  "subtitle": "عنوان فرعي اختياري",
  "problematic": "إشكالية البحث في فقرة متكاملة (4-6 جمل)",
  "questions": ["السؤال الرئيسي", "تساؤل فرعي 1", "تساؤل فرعي 2"],
  "hypotheses": ["الفرضية الرئيسية", "فرضية فرعية 1"],
  "plan": [
    { "chapter": "الفصل الأول: ...", "sections": ["المبحث الأول: ...", "المبحث الثاني: ...", "المبحث الثالث: ..."] },
    { "chapter": "الفصل الثاني: ...", "sections": ["المبحث الأول: ...", "المبحث الثاني: ...", "المبحث الثالث: ..."] },
    { "chapter": "الفصل الثالث: ...", "sections": ["المبحث الأول: ...", "المبحث الثاني: ...", "المبحث الثالث: ..."] }
  ],
  "methodology": "المنهج العلمي المقترح وأسباب اختياره",
  ${form.withRefs ? `"references": ["مرجع 1", "مرجع 2", "مرجع 3", "مرجع 4", "مرجع 5", "مرجع 6"]` : `"references": []`}
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const raw = data.content.map(i => i.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setStep(1);
    } catch (e) {
      setError("حدث خطأ أثناء التوليد. تأكد من مفتاح API وأعد المحاولة.");
    }
    setLoading(false);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', Arial, sans-serif", background: "#f0f4fa", minHeight: "100vh", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5986 100%)", padding: "32px 24px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(30,58,95,0.18)" }}>
        <div style={{ fontSize: 38, marginBottom: 8 }}>🎓</div>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 24, fontWeight: 800 }}>مولّد عناوين وخطط البحث العلمي</h1>
        <p style={{ color: "#a8c4e0", margin: "8px 0 0", fontSize: 14 }}>بالذكاء الاصطناعي — للطلاب والباحثين الأكاديميين</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 22 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= i ? "#f0a500" : "rgba(255,255,255,0.15)", color: step >= i ? "#1e3a5f" : "#a8c4e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
              <span style={{ color: step >= i ? "#fff" : "#a8c4e0", fontSize: 13, fontWeight: step === i ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 2, background: "rgba(255,255,255,0.2)" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "32px auto", padding: "0 16px" }}>

        {/* STEP 0: Form */}
        {step === 0 && (
          <div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 2px 16px rgba(30,58,95,0.07)" }}>
              <h2 style={{ margin: "0 0 22px", fontSize: 18, color: "#1e3a5f", fontWeight: 700 }}>بيانات البحث</h2>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 7, fontSize: 14 }}>التخصص العلمي <span style={{ color: "#e53e3e" }}>*</span></label>
                <select value={form.specialization} onChange={e => handleChange("specialization", e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#1e3a5f", background: "#f8fafc", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  <option value="">— اختر التخصص —</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 7, fontSize: 14 }}>المستوى الدراسي <span style={{ color: "#e53e3e" }}>*</span></label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {levels.map(l => (
                    <button key={l} onClick={() => handleChange("level", l)}
                      style={{ padding: "9px 18px", borderRadius: 24, fontSize: 13, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.2s", borderColor: form.level === l ? "#1e3a5f" : "#d1d5db", background: form.level === l ? "#1e3a5f" : "#fff", color: form.level === l ? "#fff" : "#4b5563", fontFamily: "inherit" }}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 7, fontSize: 14 }}>الموضوع العام للبحث <span style={{ color: "#e53e3e" }}>*</span></label>
                <textarea rows={3} placeholder="مثال: أثر وسائل التواصل الاجتماعي على التحصيل الدراسي لدى طلاب الجامعة..." value={form.topic} onChange={e => handleChange("topic", e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#1e3a5f", background: "#f8fafc", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontWeight: 600, color: "#374151", marginBottom: 7, fontSize: 14 }}>كلمات مفتاحية (اختياري)</label>
                <input placeholder="مثال: ذكاء اصطناعي، تعلم آلي، بيانات ضخمة..." value={form.keywords} onChange={e => handleChange("keywords", e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 14, color: "#1e3a5f", background: "#f8fafc", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
              </div>

              <div style={{ marginBottom: 26, display: "flex", alignItems: "center", gap: 12 }}>
                <div onClick={() => handleChange("withRefs", !form.withRefs)}
                  style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: form.withRefs ? "#1e3a5f" : "#d1d5db", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, right: form.withRefs ? 3 : "auto", left: form.withRefs ? "auto" : 3, transition: "all 0.2s" }} />
                </div>
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>تضمين قائمة مراجع مقترحة</span>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 14, marginBottom: 16 }}>⚠️ {error}</div>
              )}

              <button onClick={generate} disabled={!isValid || loading}
                style={{ width: "100%", padding: "14px", borderRadius: 12, background: isValid ? "linear-gradient(135deg, #1e3a5f, #2d5986)" : "#e2e8f0", color: isValid ? "#fff" : "#9ca3af", border: "none", fontSize: 16, fontWeight: 700, cursor: isValid ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: isValid ? "0 4px 16px rgba(30,58,95,0.25)" : "none" }}>
                {loading ? "جارٍ التوليد..." : "✨ توليد مقترح البحث"}
              </button>
            </div>
            {loading && <Spinner />}
          </div>
        )}

        {/* STEP 1: Results */}
        {step === 1 && result && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "#1e3a5f", fontWeight: 800 }}>مقترح البحث</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setStep(0); setResult(null); }}
                  style={{ padding: "9px 18px", borderRadius: 10, background: "#fff", border: "1.5px solid #d1d5db", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← تعديل</button>
                <button onClick={handlePrint}
                  style={{ padding: "9px 18px", borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📄 طباعة / PDF</button>
              </div>
            </div>

            <div ref={printRef} id="print-area">
              <Section icon="📌" title="عنوان البحث" accent="#1e3a5f">
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e3a5f", lineHeight: 1.7 }}>{result.title}</p>
                {result.subtitle && <p style={{ margin: "8px 0 0", fontSize: 14, color: "#6b7280" }}>{result.subtitle}</p>}
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <Badge text={form.specialization} /><Badge text={form.level} />
                </div>
              </Section>

              <Section icon="❓" title="إشكالية البحث" accent="#f0a500">
                <p style={{ margin: 0, lineHeight: 1.9, color: "#374151", fontSize: 15 }}>{result.problematic}</p>
              </Section>

              <Section icon="🔍" title="تساؤلات البحث">
                {result.questions.map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "#e8f0fb", color: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                    <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{q}</p>
                  </div>
                ))}
              </Section>

              {result.hypotheses?.length > 0 && (
                <Section icon="💡" title="فرضيات البحث">
                  {result.hypotheses.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "#f0a500", fontWeight: 700, fontSize: 16 }}>◆</span>
                      <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{h}</p>
                    </div>
                  ))}
                </Section>
              )}

              <Section icon="🔬" title="المنهج العلمي المقترح">
                <p style={{ margin: 0, lineHeight: 1.9, color: "#374151", fontSize: 14 }}>{result.methodology}</p>
              </Section>

              <Section icon="📋" title="الخطة العلمية المقترحة" accent="#10b981">
                {result.plan.map((ch, ci) => (
                  <div key={ci} style={{ marginBottom: 18 }}>
                    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 16px", marginBottom: 10 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#065f46", fontSize: 15 }}>{ch.chapter}</p>
                    </div>
                    {ch.sections.map((sec, si) => (
                      <div key={si} style={{ display: "flex", gap: 10, marginRight: 16, marginBottom: 8 }}>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>›</span>
                        <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{sec}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>

              {result.references?.length > 0 && (
                <Section icon="📚" title="قائمة المراجع المقترحة">
                  {result.references.map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <span style={{ minWidth: 22, color: "#6b7280", fontSize: 13, fontWeight: 700 }}>[{i + 1}]</span>
                      <p style={{ margin: 0, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{r}</p>
                    </div>
                  ))}
                </Section>
              )}
            </div>
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 10 }}>هذا المقترح توليدي بالذكاء الاصطناعي — يُستخدم كمرجع للانطلاق فقط</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body > *:not(#root) { display: none !important; }
          header, button { display: none !important; }
          #print-area { display: block !important; direction: rtl; }
        }
      `}</style>
    </div>
  );
}
