"use client";
import { useState } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "بيانات المشروع", icon: "🏗️" },
  { id: 2, label: "فريق الدراسة", icon: "👥" },
  { id: 3, label: "التكاليف", icon: "💰" },
  { id: 4, label: "تحليل الوظائف", icon: "⚙️" },
  { id: 5, label: "الأفكار", icon: "💡" },
  { id: 6, label: "المقترحات", icon: "📋" },
  { id: 7, label: "التقرير", icon: "📄" },
];

const RATINGS = {
  A: { label: "A – ممتاز", color: "#16a34a", bg: "#dcfce7" },
  B: { label: "B – جيد جداً", color: "#2563eb", bg: "#dbeafe" },
  C: { label: "C – جيد", color: "#d97706", bg: "#fef3c7" },
  D: { label: "D – مستبعد", color: "#dc2626", bg: "#fee2e2" },
};

const INIT = {
  projectName: "", projectNo: "", authority: "", designConsultant: "",
  veConsultant: "", designPhase: "", workshopStart: "", workshopEnd: "",
  projectDesc: "", location: "", objectives: "",
  team: [{ name: "", org: "", role: "", spec: "", phone: "", email: "" }],
  baseCost: "", baseCostVat: "", costAvoidance: "",
  totalIdeas: "", developedIdeas: "", designConsiderations: "", rejectedIdeas: "",
  perfAttribs: Array(6).fill(null).map(() => ({ name: "", level: 7 })),
  functions: [{ element: "", func: "", type: "أساسية" }],
  priorityFunctions: "",
  ideas: [{ desc: "", rating: "A" }],
  proposals: [],
  refDocs: ["", "", "", ""],
};

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const s = {
  input: {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #cbd5e1", fontSize: 13, outline: "none",
    direction: "rtl", fontFamily: "Cairo,sans-serif",
    background: "#f8fafc", boxSizing: "border-box",
  },
  label: { display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 13 },
};

function Inp({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div style={{ marginBottom: 13 }}>
      {label && <label style={s.label}>{label}{required && <span style={{ color: "#dc2626" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={s.input}
        onFocus={e => (e.target.style.borderColor = "#0d3d62")}
        onBlur={e => (e.target.style.borderColor = "#cbd5e1")} />
    </div>
  );
}

function TA({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 13 }}>
      {label && <label style={s.label}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ ...s.input, resize: "vertical" }}
        onFocus={e => (e.target.style.borderColor = "#0d3d62")}
        onBlur={e => (e.target.style.borderColor = "#cbd5e1")} />
    </div>
  );
}

function Sec({ children }) {
  return (
    <div style={{ borderRight: "4px solid #0d3d62", paddingRight: 12,
      marginBottom: 18, marginTop: 8, color: "#0d3d62", fontWeight: 800, fontSize: 16 }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 22,
      boxShadow: "0 2px 16px #0d3d620d", border: "1px solid #e2e8f0",
      marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}

function Navs({ onBack, onNext, nextLabel = "التالي →", disabled = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
      {onBack
        ? <button onClick={onBack} style={{ padding: "10px 24px", borderRadius: 9,
            border: "1.5px solid #0d3d62", background: "#fff", color: "#0d3d62",
            fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← السابق</button>
        : <div />}
      <button onClick={onNext} disabled={disabled}
        style={{ padding: "11px 30px", borderRadius: 9, border: "none",
          background: disabled ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#0ea5e9)",
          color: "#fff", fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 14, boxShadow: "0 3px 12px #0d3d6225" }}>
        {nextLabel}
      </button>
    </div>
  );
}

function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>{children}</div>;
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function Step1({ d, set, onNext }) {
  const u = k => v => set(x => ({ ...x, [k]: v }));
  return (
    <Card>
      <Sec>بيانات المشروع الأساسية</Sec>
      <Grid2>
        <Inp label="اسم المشروع" value={d.projectName} onChange={u("projectName")} placeholder="مشروع إنشاء..." required />
        <Inp label="رقم المشروع" value={d.projectNo} onChange={u("projectNo")} placeholder="PRJ-2025-001" />
        <Inp label="الجهة الحكومية" value={d.authority} onChange={u("authority")} placeholder="جامعة أم القرى" required />
        <Inp label="استشاري التصميم" value={d.designConsultant} onChange={u("designConsultant")} placeholder="شركة..." />
        <Inp label="استشاري الهندسة القيمية" value={d.veConsultant} onChange={u("veConsultant")} placeholder="اسم الاستشاري" required />
        <Inp label="مرحلة التصميم" value={d.designPhase} onChange={u("designPhase")} placeholder="التصميم التفصيلي" />
        <Inp label="تاريخ بداية الورشة" value={d.workshopStart} onChange={u("workshopStart")} type="date" />
        <Inp label="تاريخ نهاية الورشة" value={d.workshopEnd} onChange={u("workshopEnd")} type="date" />
      </Grid2>
      <TA label="وصف المشروع ونطاق العمل" value={d.projectDesc} onChange={u("projectDesc")} rows={4}
        placeholder="يتضمن المشروع إنشاء وتنفيذ..." />
      <TA label="موقع المشروع" value={d.location} onChange={u("location")} rows={2} placeholder="المنطقة، المدينة..." />
      <TA label="أهداف دراسة الهندسة القيمية" value={d.objectives} onChange={u("objectives")} rows={3}
        placeholder="تحسين القيمة - ترشيد الإنفاق - رفع كفاءة الأداء..." />
      <Sec>الوثائق المرجعية</Sec>
      {d.refDocs.map((doc, i) => (
        <Inp key={i} label={`مستند ${i + 1}`} value={doc} placeholder="اسم المستند الفني..."
          onChange={v => { const a = [...d.refDocs]; a[i] = v; set(x => ({ ...x, refDocs: a })); }} />
      ))}
      <Navs onNext={onNext} disabled={!d.projectName || !d.authority || !d.veConsultant} />
    </Card>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function Step2({ d, set, onBack, onNext }) {
  const add = () => set(x => ({ ...x, team: [...x.team, { name: "", org: "", role: "", spec: "", phone: "", email: "" }] }));
  const upd = (i, k, v) => set(x => { const t = [...x.team]; t[i] = { ...t[i], [k]: v }; return { ...x, team: t }; });
  const del = i => set(x => ({ ...x, team: x.team.filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <Sec>فريق الهندسة القيمية</Sec>
      {d.team.map((m, i) => (
        <div key={i} style={{ background: "#f0f7ff", borderRadius: 10, padding: 14,
          marginBottom: 12, border: "1px solid #bfdbfe", position: "relative" }}>
          <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 8, fontSize: 13 }}>عضو #{i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 14px" }}>
            <Inp label="الاسم" value={m.name} onChange={v => upd(i, "name", v)} placeholder="الاسم الكامل" />
            <Inp label="الجهة" value={m.org} onChange={v => upd(i, "org", v)} placeholder="اسم الجهة" />
            <Inp label="الوظيفة" value={m.role} onChange={v => upd(i, "role", v)} placeholder="المسمى الوظيفي" />
            <Inp label="التخصص" value={m.spec} onChange={v => upd(i, "spec", v)} placeholder="هندسة مدنية..." />
            <Inp label="الهاتف" value={m.phone} onChange={v => upd(i, "phone", v)} placeholder="05xxxxxxxx" />
            <Inp label="البريد الإلكتروني" value={m.email} onChange={v => upd(i, "email", v)} placeholder="name@org.sa" />
          </div>
          <button onClick={() => del(i)} style={{ position: "absolute", top: 10, left: 12,
            background: "#fee2e2", border: "none", borderRadius: 6, padding: "3px 10px",
            color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>حذف</button>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", padding: 10, borderRadius: 9,
        border: "2px dashed #0ea5e9", background: "#f0f9ff", color: "#0ea5e9",
        fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ إضافة عضو</button>
      <Navs onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function Step3({ d, set, onBack, onNext }) {
  const u = k => v => set(x => ({ ...x, [k]: v }));
  const base = parseFloat((d.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((d.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";
  return (
    <Card>
      <Sec>التكاليف والإحصائيات</Sec>
      <Grid2>
        <Inp label="التكلفة الأساسية (بدون ضريبة) ريال" value={d.baseCost} onChange={u("baseCost")} placeholder="33,891,457" required />
        <Inp label="التكلفة الأساسية (مع الضريبة) ريال" value={d.baseCostVat} onChange={u("baseCostVat")} placeholder="39,872,306" />
        <Inp label="تفادي التكاليف المحتمل ريال" value={d.costAvoidance} onChange={u("costAvoidance")} placeholder="5,000,000" />
        <div style={{ marginBottom: 13 }}>
          <label style={s.label}>نسبة تفادي التكاليف (محسوبة تلقائياً)</label>
          <div style={{ padding: "9px 12px", borderRadius: 8, background: "#f0fdf4",
            border: "1.5px solid #86efac", fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{pct}%</div>
        </div>
        <Inp label="العدد الكلي للأفكار" value={d.totalIdeas} onChange={u("totalIdeas")} type="number" placeholder="15" />
        <Inp label="الأفكار المطورة" value={d.developedIdeas} onChange={u("developedIdeas")} type="number" placeholder="8" />
        <Inp label="الاعتبارات التصميمية" value={d.designConsiderations} onChange={u("designConsiderations")} type="number" placeholder="3" />
        <Inp label="الأفكار المستبعدة" value={d.rejectedIdeas} onChange={u("rejectedIdeas")} type="number" placeholder="4" />
      </Grid2>
      <Sec>سمات الأداء ونموذج الجودة</Sec>
      <Grid2>
        {["أ","ب","ج","د","هـ","و"].map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Inp label={`سمة الأداء (${l})`}
                value={d.perfAttribs?.[i]?.name || ""}
                onChange={v => { const a = [...(d.perfAttribs || [])]; a[i] = { ...a[i], name: v }; set(x => ({ ...x, perfAttribs: a })); }}
                placeholder="سهولة الصيانة..." />
            </div>
            <div style={{ width: 72, marginBottom: 13 }}>
              <label style={{ ...s.label, fontSize: 11 }}>المستوى</label>
              <input type="number" min={1} max={10} value={d.perfAttribs?.[i]?.level || ""}
                onChange={e => { const a = [...(d.perfAttribs || [])]; a[i] = { ...a[i], level: e.target.value }; set(x => ({ ...x, perfAttribs: a })); }}
                style={{ ...s.input, textAlign: "center", padding: "9px 4px" }} />
            </div>
          </div>
        ))}
      </Grid2>
      <Navs onBack={onBack} onNext={onNext} disabled={!d.baseCost} />
    </Card>
  );
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function Step4({ d, set, onBack, onNext }) {
  const add = () => set(x => ({ ...x, functions: [...(x.functions || []), { element: "", func: "", type: "أساسية" }] }));
  const upd = (i, k, v) => set(x => { const f = [...(x.functions || [])]; f[i] = { ...f[i], [k]: v }; return { ...x, functions: f }; });
  const del = i => set(x => ({ ...x, functions: (x.functions || []).filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <Sec>تحليل الوظائف - قائمة التحديد العشوائي</Sec>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0d3d62", color: "#fff" }}>
              <th style={{ padding: "9px 10px" }}>#</th>
              <th style={{ padding: "9px 10px" }}>عنصر المشروع</th>
              <th style={{ padding: "9px 10px" }}>الوظيفة (فعل + اسم)</th>
              <th style={{ padding: "9px 10px" }}>تصنيف الوظيفة</th>
              <th style={{ padding: "9px 10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {(d.functions || []).map((f, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                <td style={{ padding: "4px 6px" }}>
                  <input value={f.element} onChange={e => upd(i, "element", e.target.value)}
                    style={{ ...s.input, padding: "6px 8px" }} placeholder="قناة تصريف..." />
                </td>
                <td style={{ padding: "4px 6px" }}>
                  <input value={f.func} onChange={e => upd(i, "func", e.target.value)}
                    style={{ ...s.input, padding: "6px 8px" }} placeholder="تصريف المياه..." />
                </td>
                <td style={{ padding: "4px 6px" }}>
                  <select value={f.type} onChange={e => upd(i, "type", e.target.value)}
                    style={{ ...s.input, padding: "6px 8px" }}>
                    <option>أساسية</option><option>ثانوية</option><option>غير مطلوبة</option>
                  </select>
                </td>
                <td style={{ padding: "4px 6px", textAlign: "center" }}>
                  <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none",
                    borderRadius: 5, padding: "4px 10px", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={add} style={{ width: "100%", padding: 10, borderRadius: 9,
        border: "2px dashed #0ea5e9", background: "#f0f9ff", color: "#0ea5e9",
        fontWeight: 700, cursor: "pointer", fontSize: 13, marginTop: 12 }}>+ إضافة وظيفة</button>
      <TA label="الوظائف ذات الأولوية (سطر لكل وظيفة)"
        value={d.priorityFunctions || ""}
        onChange={v => set(x => ({ ...x, priorityFunctions: v }))}
        rows={3} placeholder={"تصريف مياه الأمطار\nحماية المنشآت"} />
      <Navs onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 5 ───────────────────────────────────────────────────────────────────
function Step5({ d, set, onBack, onNext }) {
  const add = () => set(x => ({ ...x, ideas: [...(x.ideas || []), { desc: "", rating: "A" }] }));
  const upd = (i, k, v) => set(x => { const a = [...(x.ideas || [])]; a[i] = { ...a[i], [k]: v }; return { ...x, ideas: a }; });
  const del = i => set(x => ({ ...x, ideas: (x.ideas || []).filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <Sec>قائمة الأفكار والتقييم</Sec>
      <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 9, padding: 10, marginBottom: 16, fontSize: 12 }}>
        <strong>A</strong> = ممتاز | <strong>B</strong> = جيد جداً | <strong>C</strong> = جيد | <strong>D</strong> = مستبعد
      </div>
      {(d.ideas || []).map((idea, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8,
          background: "#f8fafc", borderRadius: 9, padding: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "#0d3d62",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 12, marginTop: 4, flexShrink: 0 }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <textarea value={idea.desc} onChange={e => upd(i, "desc", e.target.value)}
              placeholder="وصف الفكرة المقترحة..." rows={2}
              style={{ ...s.input, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 100 }}>
            {Object.entries(RATINGS).map(([k, v]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 4,
                cursor: "pointer", padding: "3px 7px", borderRadius: 5, fontSize: 11,
                background: idea.rating === k ? v.bg : "transparent",
                border: `1.5px solid ${idea.rating === k ? v.color : "#e2e8f0"}` }}>
                <input type="radio" name={`r-${i}`} value={k} checked={idea.rating === k}
                  onChange={() => upd(i, "rating", k)} style={{ accentColor: v.color }} />
                <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span>
              </label>
            ))}
          </div>
          <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none",
            borderRadius: 5, padding: "5px 9px", color: "#dc2626", cursor: "pointer",
            fontWeight: 800, marginTop: 3, flexShrink: 0 }}>×</button>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", padding: 10, borderRadius: 9,
        border: "2px dashed #0ea5e9", background: "#f0f9ff", color: "#0ea5e9",
        fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ إضافة فكرة</button>
      <Navs onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 6 ───────────────────────────────────────────────────────────────────
function Step6({ d, set, onBack, onNext }) {
  const add = () => set(x => ({
    ...x, proposals: [...(x.proposals || []), {
      title: "", current: "", proposed: "", pros: "", cons: "",
      financialImpact: "", impactType: "تفادي", adjustFactor: "1.0", adjustReason: "", notes: "",
    }]
  }));
  const upd = (i, k, v) => set(x => { const a = [...(x.proposals || [])]; a[i] = { ...a[i], [k]: v }; return { ...x, proposals: a }; });
  const del = i => set(x => ({ ...x, proposals: (x.proposals || []).filter((_, idx) => idx !== i) }));
  return (
    <div>
      <Card>
        <Sec>المقترحات التطويرية</Sec>
        <p style={{ color: "#64748b", fontSize: 13 }}>أدخل تفاصيل كل مقترح تم تطويره من الأفكار المقبولة (تقييم A أو B أو C)</p>
      </Card>
      {(d.proposals || []).map((p, i) => (
        <Card key={i} style={{ borderRight: "4px solid #0ea5e9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0d3d62" }}>المقترح رقم {i + 1}</div>
            <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none",
              borderRadius: 7, padding: "4px 12px", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>حذف</button>
          </div>
          <Inp label="عنوان المقترح" value={p.title} onChange={v => upd(i, "title", v)} placeholder="استخدام مواد بناء محلية..." required />
          <Grid2>
            <TA label="الوضع الراهن" value={p.current} onChange={v => upd(i, "current", v)} rows={3} placeholder="يعتمد التصميم الحالي على..." />
            <TA label="المقترح التطويري" value={p.proposed} onChange={v => upd(i, "proposed", v)} rows={3} placeholder="يقترح الفريق..." />
            <TA label="المزايا والإيجابيات" value={p.pros} onChange={v => upd(i, "pros", v)} rows={3} placeholder={"تخفيض التكلفة\nتسريع التنفيذ"} />
            <TA label="السلبيات والتحديات" value={p.cons} onChange={v => upd(i, "cons", v)} rows={3} placeholder="قد يتطلب مراجعة المواصفات..." />
            <Inp label="الأثر المالي المحتمل (ريال)" value={p.financialImpact} onChange={v => upd(i, "financialImpact", v)} placeholder="3,500,000" />
            <div style={{ marginBottom: 13 }}>
              <label style={s.label}>تصنيف الأثر المالي</label>
              <select value={p.impactType} onChange={e => upd(i, "impactType", e.target.value)}
                style={{ ...s.input }}>
                <option value="تفادي">تفادي في التكلفة</option>
                <option value="إضافي">تكلفة إضافية</option>
              </select>
            </div>
            <Inp label="معامل التعديل" value={p.adjustFactor} onChange={v => upd(i, "adjustFactor", v)} placeholder="0.85" />
            <Inp label="مبرر معامل التعديل" value={p.adjustReason} onChange={v => upd(i, "adjustReason", v)} placeholder="تداخل مع مقترح آخر..." />
          </Grid2>
          <TA label="ملاحظات إضافية" value={p.notes} onChange={v => upd(i, "notes", v)} rows={2} placeholder="..." />
        </Card>
      ))}
      <button onClick={add} style={{ width: "100%", padding: 12, borderRadius: 9,
        border: "2px dashed #0d3d62", background: "#f0f7ff", color: "#0d3d62",
        fontWeight: 800, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>+ إضافة مقترح تطويري</button>
      <Navs onBack={onBack} onNext={onNext} nextLabel="توليد التقرير 🚀" />
    </div>
  );
}

// ─── WORD EXPORT ──────────────────────────────────────────────────────────────
async function exportWord(data, reportText) {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, PageNumber, Header, Footer } = await import("docx");
  const { saveAs } = await import("file-saver");

  const br = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const brs = { top: br, bottom: br, left: br, right: br };
  const hbr = { style: BorderStyle.SINGLE, size: 1, color: "1E5F8C" };
  const hbrs = { top: hbr, bottom: hbr, left: hbr, right: hbr };

  const base = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";

  const P = (text, opts = {}) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text: String(text || ""), font: "Arial", size: 22, ...opts })],
    spacing: { after: 100 },
  });
  const H1 = (text) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text, font: "Arial", size: 30, bold: true, color: "0D3D62" })],
    spacing: { before: 320, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "0EA5E9", space: 4 } },
  });
  const H2 = (text) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text, font: "Arial", size: 24, bold: true, color: "1E3A5F" })],
    spacing: { before: 200, after: 100 },
  });
  const mkTable = (headers, rows, widths) => new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((h, j) => new TableCell({
        borders: hbrs, width: { size: widths[j], type: WidthType.DXA },
        shading: { fill: "0D3D62", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 80, right: 80 },
        children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: "FFFFFF" })] })]
      })) }),
      ...rows.map((row, ri) => new TableRow({ children: row.map((cell, j) => new TableCell({
        borders: brs, width: { size: widths[j], type: WidthType.DXA },
        shading: { fill: ri % 2 === 0 ? "F8FAFC" : "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: String(cell || "—"), font: "Arial", size: 20 })] })]
      })) }))
    ]
  });

  const sp = () => new Paragraph({ children: [], spacing: { after: 200 } });

  const children = [
    // Cover
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "تقرير دراسة الهندسة القيمية", font: "Arial", size: 44, bold: true, color: "0D3D62" })],
      spacing: { before: 0, after: 180 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: data.projectName || "", font: "Arial", size: 32, bold: true, color: "0EA5E9" })],
      spacing: { after: 100 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `الجهة: ${data.authority || ""}`, font: "Arial", size: 24 })],
      spacing: { after: 60 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `استشاري الهندسة القيمية: ${data.veConsultant || ""}`, font: "Arial", size: 24 })],
      spacing: { after: 60 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "رقم الوثيقة: EPM-KEV-TP-000002", font: "Arial", size: 20, color: "64748B" })],
      spacing: { after: 400 } }),

    H1("إحصائيات الدراسة"),
    mkTable(["البيان","القيمة"], [
      ["التكلفة الأساسية (بدون ضريبة)", `${data.baseCost||"—"} ريال`],
      ["التكلفة الأساسية (مع الضريبة)", `${data.baseCostVat||"—"} ريال`],
      ["تفادي التكاليف المحتمل", `${data.costAvoidance||"—"} ريال`],
      ["نسبة تفادي التكاليف", `${pct} %`],
      ["العدد الكلي للأفكار", `${data.totalIdeas||"—"} فكرة`],
      ["الأفكار المطورة", `${data.developedIdeas||"—"} فكرة`],
      ["الاعتبارات التصميمية", `${data.designConsiderations||"—"} فكرة`],
      ["الأفكار المستبعدة", `${data.rejectedIdeas||"—"} فكرة`],
    ], [5013,4013]),
    sp(),

    H1("1. الملخص التنفيذي"),
    P(data.projectDesc || "", { size: 22 }),
    H2("أهداف الدراسة"),
    ...(data.objectives||"").split("\n").filter(Boolean).map(l => P(`• ${l}`, { size: 22 })),
    sp(),

    H1("2. فريق الهندسة القيمية"),
    mkTable(["#","الاسم","الجهة","الوظيفة","التخصص","الهاتف"],
      data.team.filter(m=>m.name).map((m,i)=>[i+1,m.name,m.org,m.role,m.spec,m.phone]),
      [400,1900,1700,1500,1526,2000]),
    sp(),

    H1("3. نظرة عامة عن المشروع"),
    H2("3.1 مقدمة"),
    P(data.projectDesc||"", { size: 22 }),
    H2("3.2 الموقع ونطاق العمل"),
    P(data.location||"", { size: 22 }),
    H2("3.3 الوثائق المرجعية"),
    mkTable(["#","المستند"],
      data.refDocs.filter(Boolean).map((d2,i)=>[i+1,d2]),
      [500,8526]),
    sp(),

    H1("4. سمات الأداء ونموذج الجودة"),
    mkTable(["سمة الأداء","المستوى المستهدف (1-10)"],
      (data.perfAttribs||[]).filter(a=>a.name).map(a=>[a.name,a.level]),
      [6000,3026]),
    sp(),

    H1("5. تحليل الوظائف"),
    mkTable(["#","عنصر المشروع","الوظيفة","تصنيف الوظيفة"],
      (data.functions||[]).filter(f=>f.element||f.func).map((f,i)=>[i+1,f.element,f.func,f.type]),
      [400,2600,3626,2400]),
    sp(),
    H2("الوظائف ذات الأولوية"),
    ...(data.priorityFunctions||"").split("\n").filter(Boolean).map(l=>P(`• ${l}`,{size:22})),
    sp(),

    H1("6. قائمة الأفكار"),
    mkTable(["#","وصف الفكرة","التقييم","القرار"],
      (data.ideas||[]).filter(x=>x.desc).map((x,i)=>[i+1,x.desc,x.rating,x.rating==="D"?"مستبعد":"يُطوَّر"]),
      [400,6626,1000,1000]),
    sp(),

    H1("7. المقترحات التطويرية"),
    ...(data.proposals||[]).flatMap((p,i)=>[
      H2(`المقترح ${i+1}: ${p.title}`),
      mkTable(["البند","التفاصيل"],[
        ["الوضع الراهن",p.current],
        ["المقترح التطويري",p.proposed],
        ["المزايا",p.pros],
        ["التحديات",p.cons],
        ["الأثر المالي",`${p.financialImpact||"—"} ريال`],
        ["تصنيف الأثر",p.impactType],
        ["معامل التعديل",p.adjustFactor],
        ["مبرر المعامل",p.adjustReason],
        ["الأثر المعدّل",`${(parseFloat((p.financialImpact||"0").replace(/,/g,""))||0)*( parseFloat(p.adjustFactor||"1")||1)} ريال`],
        ["ملاحظات",p.notes],
      ].filter(r=>r[1]),[3000,6026]),
      sp(),
    ]),

    H1("8. ملخص الأثر المالي للمقترحات"),
    mkTable(["#","عنوان المقترح","تصنيف الأثر","الأثر المحتمل","معامل التعديل","الأثر المعدّل"],
      (data.proposals||[]).filter(p=>p.title).map((p,i)=>{
        const imp=parseFloat((p.financialImpact||"0").replace(/,/g,""))||0;
        const adj=parseFloat(p.adjustFactor||"1")||1;
        return [i+1,p.title,p.impactType,`${p.financialImpact||"—"} ريال`,p.adjustFactor,`${(imp*adj).toLocaleString("ar-SA",{maximumFractionDigits:0})} ريال`];
      }),[400,2400,1200,1600,1026,1900]),
    sp(),

    H1("9. التقرير التحليلي المفصّل"),
    ...(reportText||"").split("\n").filter(Boolean).map(line=>{
      if(line.startsWith("# ")) return H1(line.replace(/^# /,""));
      if(line.startsWith("## ")) return H2(line.replace(/^## /,""));
      if(line.startsWith("- ")||line.startsWith("• ")) return P(`• ${line.replace(/^[-•] /,"")}`,{size:22});
      if(line.startsWith("|")) return null;
      return P(line,{size:22});
    }).filter(Boolean),
  ];

  const doc = new Document({
    sections: [{
      properties: { page: { size:{width:11906,height:16838}, margin:{top:1440,right:1440,bottom:1440,left:1440} } },
      headers: { default: new Header({ children: [new Paragraph({
        bidirectional: true, alignment: AlignmentType.RIGHT,
        children: [new TextRun({text:`تقرير الهندسة القيمية | ${data.projectName||""}  |  EPM-KEV-TP-000002`,font:"Arial",size:18,color:"0D3D62"})],
        border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"0EA5E9",space:4}},
      })]})},
      footers: { default: new Footer({ children: [new Paragraph({
        bidirectional: true, alignment: AlignmentType.CENTER,
        children: [
          new TextRun({text:"الصفحة ",font:"Arial",size:18,color:"94A3B8"}),
          new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:18,color:"0D3D62"}),
          new TextRun({text:" | هيئة كفاءة الإنفاق والمشروعات الحكومية",font:"Arial",size:18,color:"94A3B8"}),
        ],
      })]})},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `تقرير_الهندسة_القيمية_${data.projectName||"مشروع"}.docx`);
}

// ─── STEP 7 ───────────────────────────────────────────────────────────────────
function Step7({ d, onBack }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const base = parseFloat((d.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((d.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";

  const generate = async () => {
    setLoading(true); setError(""); setReport("");
    const prompt = `أنت محلل خبير في الهندسة القيمية معتمد من EXPRO. اكتب تقريراً تحليلياً مفصلاً بالعربية الفصحى الرصينة.

البيانات:
المشروع: ${d.projectName} | الجهة: ${d.authority} | الاستشاري: ${d.veConsultant}
مرحلة التصميم: ${d.designPhase||"التصميم التفصيلي"} | الورشة: ${d.workshopStart||"—"} إلى ${d.workshopEnd||"—"}
الوصف: ${d.projectDesc||"—"} | الموقع: ${d.location||"—"}
الأهداف: ${d.objectives||"—"}
التكلفة: ${d.baseCost||"—"} ريال (مع ضريبة: ${d.baseCostVat||"—"}) | تفادي التكاليف: ${d.costAvoidance||"—"} ريال (${pct}%)
الأفكار: ${d.totalIdeas||0} إجمالي | ${d.developedIdeas||0} مطورة | ${d.rejectedIdeas||0} مستبعدة
سمات الأداء: ${(d.perfAttribs||[]).filter(a=>a.name).map(a=>`${a.name}:${a.level}/10`).join("، ")||"—"}
الوظائف ذات الأولوية: ${d.priorityFunctions||"—"}
الأفكار: ${(d.ideas||[]).map((x,i)=>`${i+1}.[${x.rating}]${x.desc}`).join(" | ")||"—"}
المقترحات: ${(d.proposals||[]).map((p,i)=>`${i+1}.${p.title}|الوضع:${p.current}|المقترح:${p.proposed}|المزايا:${p.pros}|التحديات:${p.cons}|الأثر:${p.financialImpact} ريال(${p.impactType})|معامل:${p.adjustFactor}`).join(" || ")||"—"}

اكتب تقريراً شاملاً يشمل الأقسام التالية:

# الملخص التنفيذي
## ملخص دراسة الهندسة القيمية
## أبرز نتائج الدراسة

# منهجية الدراسة وخطة العمل

# تحليل المعلومات والنماذج

# تحليل الوظائف

# مرحلة طرح الأفكار

# مرحلة التطوير والمقترحات
${(d.proposals||[]).map((p,i)=>`## المقترح ${i+1}: ${p.title}\n(تحليل تفصيلي احترافي)`).join("\n")}

# الخلاصة والتوصيات

استخدم مصطلحات: تفادي التكاليف، كفاءة الأداء، سمات الجودة، مخطط فاست، كفاءة الإنفاق الحكومي.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const result = await res.json();
      if (result.content?.[0]?.text) {
        setReport(result.content[0].text);
      } else {
        setError(result.error || "حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
      }
    } catch (e) { setError("خطأ في الاتصال: " + e.message); }
    finally { setLoading(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await exportWord(d, report); }
    catch (e) { setError("خطأ في التصدير: " + e.message); }
    finally { setExporting(false); }
  };

  const renderReport = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h2 key={i} style={{ color: "#0d3d62", borderBottom: "2px solid #0ea5e9", paddingBottom: 4, marginTop: 22, fontWeight: 800, fontSize: 16 }}>{line.replace(/^# /, "")}</h2>;
      if (line.startsWith("## ")) return <h3 key={i} style={{ color: "#1e3a5f", marginTop: 14, fontWeight: 700, fontSize: 14 }}>{line.replace(/^## /, "")}</h3>;
      if (line.startsWith("- ") || line.startsWith("• ")) return <div key={i} style={{ paddingRight: 14, margin: "2px 0", color: "#374151", fontSize: 13 }}>• {line.replace(/^[-•] /, "")}</div>;
      if (line.trim() === "") return <div key={i} style={{ height: 5 }} />;
      if (line.startsWith("|")) return null;
      return <p key={i} style={{ margin: "2px 0", color: "#374151", fontSize: 13, lineHeight: 1.7 }}>{line}</p>;
    });

  return (
    <div>
      <Card>
        <Sec>توليد التقرير الاحترافي</Sec>
        <div style={{ background: "linear-gradient(135deg,#0d3d62,#0ea5e9)", borderRadius: 12,
          padding: 16, color: "#fff", marginBottom: 16, fontSize: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>ملخص البيانات المدخلة</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["📁","المشروع",d.projectName],["🏛️","الجهة",d.authority],["👤","الاستشاري",d.veConsultant],
              ["💰","التكلفة",`${d.baseCost||"—"} ريال`],["✅","تفادي التكاليف",`${pct}%`],
              ["💡","أفكار",`${(d.ideas||[]).length} | مقترحات: ${(d.proposals||[]).length}`],
            ].map(([ic,k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,0.15)", borderRadius:7, padding:"5px 10px" }}>
                {ic} <strong>{k}:</strong> {v||"—"}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={generate} disabled={loading}
            style={{ flex: 1, minWidth: 180, padding: 13, borderRadius: 10, border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg,#16a34a,#0ea5e9)",
              color: "#fff", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontSize: 14 }}>
            {loading ? "⏳ جارٍ التوليد..." : report ? "🔄 إعادة التوليد" : "🚀 توليد التقرير الاحترافي"}
          </button>
          {report && (
            <>
              <button onClick={() => setEditing(e => !e)}
                style={{ padding: "13px 20px", borderRadius: 10,
                  border: "1.5px solid #0d3d62", background: editing ? "#0d3d62" : "#fff",
                  color: editing ? "#fff" : "#0d3d62", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
                {editing ? "👁️ معاينة" : "✏️ تحرير"}
              </button>
              <button onClick={handleExport} disabled={exporting}
                style={{ padding: "13px 20px", borderRadius: 10, border: "none",
                  background: exporting ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#1e5a8c)",
                  color: "#fff", fontWeight: 800, cursor: exporting ? "not-allowed" : "pointer", fontSize: 13 }}>
                {exporting ? "⏳..." : "⬇️ تحميل Word"}
              </button>
            </>
          )}
        </div>
        {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 9,
          padding: 12, color: "#dc2626", marginTop: 12, fontWeight: 600, fontSize: 13 }}>{error}</div>}
      </Card>

      {report && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0d3d62" }}>
              {editing ? "✏️ تحرير التقرير" : "📄 معاينة التقرير"}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => navigator.clipboard.writeText(report).then(() => alert("تم النسخ ✓"))}
                style={{ padding: "8px 16px", borderRadius: 7, border: "1.5px solid #0d3d62",
                  background: "#fff", color: "#0d3d62", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>📋 نسخ</button>
              <button onClick={handleExport} disabled={exporting}
                style={{ padding: "8px 16px", borderRadius: 7, border: "none",
                  background: exporting ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#0ea5e9)",
                  color: "#fff", fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", fontSize: 12 }}>
                {exporting ? "⏳..." : "⬇️ Word"}
              </button>
            </div>
          </div>
          {editing
            ? <textarea value={report} onChange={e => setReport(e.target.value)} rows={40}
                style={{ width: "100%", padding: 14, borderRadius: 9, border: "1.5px solid #0ea5e9",
                  fontSize: 13, direction: "rtl", fontFamily: "Cairo,sans-serif", lineHeight: 1.8,
                  background: "#f8fafc", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            : <div style={{ direction: "rtl", lineHeight: 1.8, background: "#fafafa", borderRadius: 10,
                padding: 20, border: "1px solid #e2e8f0", maxHeight: "60vh", overflowY: "auto" }}>
                {renderReport(report)}
              </div>
          }
        </Card>
      )}
      <Navs onBack={onBack} onNext={() => {}} nextLabel="✅ انتهاء" />
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VEPlatform() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INIT);
  const next = () => setStep(s => Math.min(s + 1, 7));
  const back = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div style={{ minHeight: "100vh", padding: "24px 14px", fontFamily: "Cairo,sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0d3d62,#1a5a8c,#0ea5e9)",
          borderRadius: 16, padding: "22px 28px", marginBottom: 24, color: "#fff",
          boxShadow: "0 8px 36px #0d3d6228" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 44 }}>🏛️</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 900, marginBottom: 3 }}>منصة توليد تقارير الهندسة القيمية</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>وفق معايير هيئة كفاءة الإنفاق والمشروعات الحكومية (EXPRO) | EPM-KEV-TP-000002</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 22, flexWrap: "wrap" }}>
          {STEPS.map(s2 => (
            <div key={s2.id} style={{ flex: 1, minWidth: 72, padding: "7px 6px", borderRadius: 9,
              background: step === s2.id ? "#0d3d62" : step > s2.id ? "#0ea5e9" : "#e2e8f0",
              color: step >= s2.id ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700,
              textAlign: "center", transition: "all 0.3s",
              boxShadow: step === s2.id ? "0 4px 14px #0d3d6233" : "none" }}>
              <div style={{ fontSize: 15, marginBottom: 1 }}>{s2.icon}</div>
              {s2.label}
            </div>
          ))}
        </div>

        {step === 1 && <Step1 d={data} set={setData} onNext={next} />}
        {step === 2 && <Step2 d={data} set={setData} onBack={back} onNext={next} />}
        {step === 3 && <Step3 d={data} set={setData} onBack={back} onNext={next} />}
        {step === 4 && <Step4 d={data} set={setData} onBack={back} onNext={next} />}
        {step === 5 && <Step5 d={data} set={setData} onBack={back} onNext={next} />}
        {step === 6 && <Step6 d={data} set={setData} onBack={back} onNext={next} />}
        {step === 7 && <Step7 d={data} onBack={back} />}

        <div style={{ textAlign: "center", marginTop: 18, color: "#94a3b8", fontSize: 11 }}>
          منصة مدعومة بالذكاء الاصطناعي · EPM-KEV-TP-000002
        </div>
      </div>
    </div>
  );
}
