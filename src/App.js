/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer } from "docx";
import { saveAs } from "file-saver";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "بيانات المشروع", icon: "🏗️" },
  { id: 2, label: "فريق الدراسة", icon: "👥" },
  { id: 3, label: "التكاليف والإحصائيات", icon: "💰" },
  { id: 4, label: "تحليل الوظائف", icon: "⚙️" },
  { id: 5, label: "الأفكار والتقييم", icon: "💡" },
  { id: 6, label: "المقترحات التطويرية", icon: "📋" },
  { id: 7, label: "توليد وتحرير التقرير", icon: "📄" },
];

const RATING_LABELS = {
  A: { label: "A – ممتاز", color: "#16a34a", bg: "#dcfce7" },
  B: { label: "B – جيد جداً", color: "#2563eb", bg: "#dbeafe" },
  C: { label: "C – جيد", color: "#d97706", bg: "#fef3c7" },
  D: { label: "D – مستبعد", color: "#dc2626", bg: "#fee2e2" },
};

const INITIAL_DATA = {
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

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, type = "text", required, half }) {
  return (
    <div style={{ marginBottom: 14, width: half ? "calc(50% - 10px)" : "100%" }}>
      <label style={{ display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 13 }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #cbd5e1",
          fontSize: 13, outline: "none", direction: "rtl", fontFamily: "Cairo, sans-serif",
          background: "#f8fafc", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = "#0d3d62")}
        onBlur={e => (e.target.style.borderColor = "#cbd5e1")} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 13 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #cbd5e1",
          fontSize: 13, outline: "none", direction: "rtl", fontFamily: "Cairo, sans-serif",
          background: "#f8fafc", resize: "vertical", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = "#0d3d62")}
        onBlur={e => (e.target.style.borderColor = "#cbd5e1")} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ borderRight: "4px solid #0d3d62", paddingRight: 12, marginBottom: 18, marginTop: 6,
      color: "#0d3d62", fontWeight: 800, fontSize: 16 }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 22, boxShadow: "0 2px 16px #0d3d620d",
      border: "1px solid #e2e8f0", marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "التالي →", disabled = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
      {onBack
        ? <button onClick={onBack} style={{ padding: "10px 26px", borderRadius: 9, border: "1.5px solid #0d3d62",
            background: "#fff", color: "#0d3d62", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← السابق</button>
        : <div />}
      <button onClick={onNext} disabled={disabled}
        style={{ padding: "11px 32px", borderRadius: 9, border: "none",
          background: disabled ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#0ea5e9)",
          color: "#fff", fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 14, boxShadow: "0 3px 12px #0d3d6225" }}>
        {nextLabel}
      </button>
    </div>
  );
}

function ProgressBar({ current }) {
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 26, flexWrap: "wrap" }}>
      {STEPS.map(s => (
        <div key={s.id} style={{ flex: 1, minWidth: 80, padding: "7px 8px", borderRadius: 9,
          background: current === s.id ? "#0d3d62" : current > s.id ? "#0ea5e9" : "#e2e8f0",
          color: current >= s.id ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700,
          textAlign: "center", transition: "all 0.3s",
          boxShadow: current === s.id ? "0 4px 14px #0d3d6233" : "none" }}>
          <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
          {s.label}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  const u = k => v => setData(d => ({ ...d, [k]: v }));
  return (
    <Card>
      <SectionTitle>بيانات المشروع الأساسية</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="اسم المشروع" value={data.projectName} onChange={u("projectName")} placeholder="مشروع إنشاء..." required /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="رقم المشروع" value={data.projectNo} onChange={u("projectNo")} placeholder="PRJ-2025-001" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="الجهة الحكومية" value={data.authority} onChange={u("authority")} placeholder="جامعة أم القرى" required /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="استشاري التصميم" value={data.designConsultant} onChange={u("designConsultant")} placeholder="شركة..." /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="استشاري الهندسة القيمية" value={data.veConsultant} onChange={u("veConsultant")} placeholder="اسم الاستشاري" required /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="مرحلة التصميم" value={data.designPhase} onChange={u("designPhase")} placeholder="مرحلة التصميم التفصيلي" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="تاريخ بداية الورشة" value={data.workshopStart} onChange={u("workshopStart")} type="date" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="تاريخ نهاية الورشة" value={data.workshopEnd} onChange={u("workshopEnd")} type="date" /></div>
      </div>
      <Textarea label="وصف المشروع ونطاق العمل" value={data.projectDesc} onChange={u("projectDesc")} rows={4}
        placeholder="يتضمن المشروع إنشاء وتنفيذ..." />
      <Textarea label="موقع المشروع" value={data.location} onChange={u("location")} rows={2} placeholder="المنطقة، المدينة..." />
      <Textarea label="أهداف دراسة الهندسة القيمية" value={data.objectives} onChange={u("objectives")} rows={3}
        placeholder="تحسين القيمة - ترشيد الإنفاق - رفع كفاءة الأداء..." />
      <SectionTitle>الوثائق والمستندات المرجعية</SectionTitle>
      {data.refDocs.map((doc, i) => (
        <Input key={i} label={`مستند ${i + 1}`} value={doc} placeholder="اسم المستند الفني..."
          onChange={v => { const arr = [...data.refDocs]; arr[i] = v; setData(d => ({ ...d, refDocs: arr })); }} />
      ))}
      <NavButtons onNext={onNext} disabled={!data.projectName || !data.authority || !data.veConsultant} />
    </Card>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function Step2({ data, setData, onBack, onNext }) {
  const add = () => setData(d => ({ ...d, team: [...d.team, { name: "", org: "", role: "", spec: "", phone: "", email: "" }] }));
  const upd = (i, k, v) => setData(d => { const t = [...d.team]; t[i] = { ...t[i], [k]: v }; return { ...d, team: t }; });
  const del = i => setData(d => ({ ...d, team: d.team.filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <SectionTitle>فريق الهندسة القيمية</SectionTitle>
      {data.team.map((m, i) => (
        <div key={i} style={{ background: "#f0f7ff", borderRadius: 10, padding: 14, marginBottom: 12,
          border: "1px solid #bfdbfe", position: "relative" }}>
          <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 8, fontSize: 13 }}>عضو #{i + 1}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px" }}>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="الاسم" value={m.name} onChange={v => upd(i, "name", v)} placeholder="الاسم الكامل" /></div>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="الجهة" value={m.org} onChange={v => upd(i, "org", v)} placeholder="اسم الجهة" /></div>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="الوظيفة" value={m.role} onChange={v => upd(i, "role", v)} placeholder="المسمى الوظيفي" /></div>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="التخصص" value={m.spec} onChange={v => upd(i, "spec", v)} placeholder="هندسة مدنية..." /></div>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="الهاتف" value={m.phone} onChange={v => upd(i, "phone", v)} placeholder="05xxxxxxxx" /></div>
            <div style={{ width: "calc(33% - 12px)" }}><Input label="البريد الإلكتروني" value={m.email} onChange={v => upd(i, "email", v)} placeholder="name@org.sa" /></div>
          </div>
          <button onClick={() => del(i)} style={{ position: "absolute", top: 10, left: 12, background: "#fee2e2",
            border: "none", borderRadius: 6, padding: "3px 10px", color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>حذف</button>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", padding: "10px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ إضافة عضو</button>
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function Step3({ data, setData, onBack, onNext }) {
  const u = k => v => setData(d => ({ ...d, [k]: v }));
  const base = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";
  return (
    <Card>
      <SectionTitle>التكاليف والإحصائيات</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="التكلفة الأساسية (بدون ضريبة) ريال" value={data.baseCost} onChange={u("baseCost")} placeholder="33,891,457" required /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="التكلفة الأساسية (مع الضريبة) ريال" value={data.baseCostVat} onChange={u("baseCostVat")} placeholder="39,872,306" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="تفادي التكاليف المحتمل ريال" value={data.costAvoidance} onChange={u("costAvoidance")} placeholder="5,000,000" /></div>
        <div style={{ width: "calc(50% - 10px)" }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 13 }}>نسبة تفادي التكاليف (محسوبة تلقائياً)</label>
          <div style={{ padding: "9px 12px", borderRadius: 8, background: "#f0fdf4", border: "1.5px solid #86efac",
            fontSize: 17, fontWeight: 800, color: "#16a34a" }}>{pct}%</div>
        </div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="العدد الكلي للأفكار" value={data.totalIdeas} onChange={u("totalIdeas")} type="number" placeholder="15" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="الأفكار المطورة" value={data.developedIdeas} onChange={u("developedIdeas")} type="number" placeholder="8" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="الاعتبارات التصميمية" value={data.designConsiderations} onChange={u("designConsiderations")} type="number" placeholder="3" /></div>
        <div style={{ width: "calc(50% - 10px)" }}><Input label="الأفكار المستبعدة" value={data.rejectedIdeas} onChange={u("rejectedIdeas")} type="number" placeholder="4" /></div>
      </div>
      <SectionTitle>سمات الأداء ونموذج الجودة</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
        {["أ","ب","ج","د","هـ","و"].map((l, i) => (
          <div key={i} style={{ width: "calc(50% - 10px)", display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input label={`سمة الأداء (${l})`} value={data.perfAttribs?.[i]?.name || ""}
                onChange={v => { const a = [...(data.perfAttribs || [])]; a[i] = { ...a[i], name: v }; setData(d => ({ ...d, perfAttribs: a })); }}
                placeholder="سهولة الصيانة..." />
            </div>
            <div style={{ width: 72, marginBottom: 14 }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 12 }}>المستوى</label>
              <input type="number" min={1} max={10} value={data.perfAttribs?.[i]?.level || ""}
                onChange={e => { const a = [...(data.perfAttribs || [])]; a[i] = { ...a[i], level: e.target.value }; setData(d => ({ ...d, perfAttribs: a })); }}
                style={{ width: "100%", padding: "9px 6px", borderRadius: 8, border: "1.5px solid #cbd5e1",
                  fontSize: 13, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!data.baseCost} />
    </Card>
  );
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function Step4({ data, setData, onBack, onNext }) {
  const add = () => setData(d => ({ ...d, functions: [...(d.functions || []), { element: "", func: "", type: "أساسية" }] }));
  const upd = (i, k, v) => setData(d => { const f = [...(d.functions || [])]; f[i] = { ...f[i], [k]: v }; return { ...d, functions: f }; });
  const del = i => setData(d => ({ ...d, functions: (d.functions || []).filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <SectionTitle>تحليل الوظائف - قائمة التحديد العشوائي</SectionTitle>
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
            {(data.functions || []).map((f, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                <td style={{ padding: "6px 10px", textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                <td style={{ padding: "4px 6px" }}>
                  <input value={f.element} onChange={e => upd(i, "element", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "Cairo,sans-serif", fontSize: 13 }}
                    placeholder="قناة تصريف..." />
                </td>
                <td style={{ padding: "4px 6px" }}>
                  <input value={f.func} onChange={e => upd(i, "func", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "Cairo,sans-serif", fontSize: 13 }}
                    placeholder="تصريف المياه..." />
                </td>
                <td style={{ padding: "4px 6px" }}>
                  <select value={f.type} onChange={e => upd(i, "type", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "Cairo,sans-serif", fontSize: 13 }}>
                    <option>أساسية</option><option>ثانوية</option><option>غير مطلوبة</option>
                  </select>
                </td>
                <td style={{ padding: "4px 6px", textAlign: "center" }}>
                  <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none", borderRadius: 5, padding: "4px 10px", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={add} style={{ width: "100%", padding: "10px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 13, marginTop: 12 }}>+ إضافة وظيفة</button>
      <Textarea label="الوظائف ذات الأولوية (سطر لكل وظيفة)" value={data.priorityFunctions || ""}
        onChange={v => setData(d => ({ ...d, priorityFunctions: v }))} rows={3}
        placeholder={"تصريف مياه الأمطار\nحماية المنشآت\nدرء مخاطر السيول"} />
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 5 ───────────────────────────────────────────────────────────────────
function Step5({ data, setData, onBack, onNext }) {
  const add = () => setData(d => ({ ...d, ideas: [...(d.ideas || []), { desc: "", rating: "A" }] }));
  const upd = (i, k, v) => setData(d => { const a = [...(d.ideas || [])]; a[i] = { ...a[i], [k]: v }; return { ...d, ideas: a }; });
  const del = i => setData(d => ({ ...d, ideas: (d.ideas || []).filter((_, idx) => idx !== i) }));
  return (
    <Card>
      <SectionTitle>قائمة الأفكار والتقييم</SectionTitle>
      <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 9, padding: 11, marginBottom: 18, fontSize: 12 }}>
        <strong>معايير التقييم:</strong> A = ممتاز (يُطوَّر) | B = جيد جداً (يُطوَّر) | C = جيد (يُطوَّر) | D = مستبعد
      </div>
      {(data.ideas || []).map((idea, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8,
          background: "#f8fafc", borderRadius: 9, padding: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#0d3d62", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, marginTop: 3 }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <textarea value={idea.desc} onChange={e => upd(i, "desc", e.target.value)}
              placeholder="وصف الفكرة المقترحة..." rows={2}
              style={{ width: "100%", padding: "7px 9px", borderRadius: 7, border: "1px solid #cbd5e1",
                fontSize: 13, direction: "rtl", fontFamily: "Cairo,sans-serif", resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 105 }}>
            {Object.entries(RATING_LABELS).map(([k, v]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
                padding: "3px 7px", borderRadius: 5, fontSize: 11,
                background: idea.rating === k ? v.bg : "transparent",
                border: `1.5px solid ${idea.rating === k ? v.color : "#e2e8f0"}` }}>
                <input type="radio" name={`r-${i}`} value={k} checked={idea.rating === k}
                  onChange={() => upd(i, "rating", k)} style={{ accentColor: v.color }} />
                <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span>
              </label>
            ))}
          </div>
          <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none", borderRadius: 5,
            padding: "5px 9px", color: "#dc2626", cursor: "pointer", fontWeight: 800, marginTop: 3 }}>×</button>
        </div>
      ))}
      <button onClick={add} style={{ width: "100%", padding: "10px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ إضافة فكرة</button>
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 6 ───────────────────────────────────────────────────────────────────
function Step6({ data, setData, onBack, onNext }) {
  const add = () => setData(d => ({
    ...d, proposals: [...(d.proposals || []), {
      title: "", current: "", proposed: "", pros: "", cons: "",
      financialImpact: "", impactType: "تفادي", adjustFactor: "1.0", adjustReason: "", notes: "",
    }]
  }));
  const upd = (i, k, v) => setData(d => { const a = [...(d.proposals || [])]; a[i] = { ...a[i], [k]: v }; return { ...d, proposals: a }; });
  const del = i => setData(d => ({ ...d, proposals: (d.proposals || []).filter((_, idx) => idx !== i) }));
  return (
    <div>
      <Card>
        <SectionTitle>المقترحات التطويرية</SectionTitle>
        <p style={{ color: "#64748b", fontSize: 13 }}>أدخل تفاصيل كل مقترح تم تطويره من الأفكار المقبولة (تقييم A أو B أو C)</p>
      </Card>
      {(data.proposals || []).map((p, i) => (
        <Card key={i} style={{ borderRight: "4px solid #0ea5e9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0d3d62" }}>المقترح رقم {i + 1}</div>
            <button onClick={() => del(i)} style={{ background: "#fee2e2", border: "none", borderRadius: 7,
              padding: "4px 12px", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>حذف</button>
          </div>
          <Input label="عنوان المقترح" value={p.title} onChange={v => upd(i, "title", v)} placeholder="استخدام مواد بناء محلية الصنع..." required />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px" }}>
            <div style={{ width: "calc(50% - 10px)" }}><Textarea label="الوضع الراهن (التصميم الأصلي)" value={p.current} onChange={v => upd(i, "current", v)} rows={3} placeholder="يعتمد التصميم الحالي على..." /></div>
            <div style={{ width: "calc(50% - 10px)" }}><Textarea label="المقترح التطويري" value={p.proposed} onChange={v => upd(i, "proposed", v)} rows={3} placeholder="يقترح الفريق..." /></div>
            <div style={{ width: "calc(50% - 10px)" }}><Textarea label="المزايا والإيجابيات" value={p.pros} onChange={v => upd(i, "pros", v)} rows={3} placeholder={"تخفيض التكلفة\nتسريع التنفيذ\nدعم المحتوى المحلي"} /></div>
            <div style={{ width: "calc(50% - 10px)" }}><Textarea label="السلبيات والتحديات" value={p.cons} onChange={v => upd(i, "cons", v)} rows={3} placeholder="قد يتطلب مراجعة المواصفات..." /></div>
            <div style={{ width: "calc(33% - 14px)" }}><Input label="الأثر المالي المحتمل (ريال)" value={p.financialImpact} onChange={v => upd(i, "financialImpact", v)} placeholder="3,500,000" /></div>
            <div style={{ width: "calc(33% - 14px)" }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 5, color: "#1e3a5f", fontSize: 13 }}>تصنيف الأثر المالي</label>
              <select value={p.impactType} onChange={e => upd(i, "impactType", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #cbd5e1",
                  fontSize: 13, direction: "rtl", fontFamily: "Cairo,sans-serif", background: "#f8fafc", marginBottom: 14 }}>
                <option value="تفادي">تفادي في التكلفة</option>
                <option value="إضافي">تكلفة إضافية</option>
              </select>
            </div>
            <div style={{ width: "calc(33% - 14px)" }}><Input label="معامل التعديل" value={p.adjustFactor} onChange={v => upd(i, "adjustFactor", v)} placeholder="0.85" /></div>
            <div style={{ width: "100%" }}><Input label="مبرر معامل التعديل" value={p.adjustReason} onChange={v => upd(i, "adjustReason", v)} placeholder="تداخل مع مقترح آخر..." /></div>
            <div style={{ width: "100%" }}><Textarea label="ملاحظات إضافية" value={p.notes} onChange={v => upd(i, "notes", v)} rows={2} placeholder="..." /></div>
          </div>
        </Card>
      ))}
      <button onClick={add} style={{ width: "100%", padding: "12px", borderRadius: 9, border: "2px dashed #0d3d62",
        background: "#f0f7ff", color: "#0d3d62", fontWeight: 800, cursor: "pointer", fontSize: 13, marginBottom: 16 }}>+ إضافة مقترح تطويري</button>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="توليد التقرير 🚀" />
    </div>
  );
}

// ─── WORD EXPORT ──────────────────────────────────────────────────────────────
async function exportToWord(data, reportText) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: "1E5F8C" };
  const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

  const base = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";

  const rtlPara = (text, opts = {}) => new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text, font: "Arial", size: 24, ...opts })],
    spacing: { after: 120 },
  });

  const heading1 = (text) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: "0D3D62" })],
    spacing: { before: 360, after: 180 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "0EA5E9", space: 4 } },
  });

  const heading2 = (text) => new Paragraph({
    bidirectional: true, alignment: AlignmentType.RIGHT,
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: "1E3A5F" })],
    spacing: { before: 240, after: 120 },
  });

  const makeTable = (headers, rows, colWidths) => new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, j) => new TableCell({
          borders: headerBorders,
          width: { size: colWidths[j], type: WidthType.DXA },
          shading: { fill: "0D3D62", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, font: "Arial", size: 22, bold: true, color: "FFFFFF" })] })],
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, j) => new TableCell({
          borders,
          width: { size: colWidths[j], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? "F8FAFC" : "FFFFFF", type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: String(cell || ""), font: "Arial", size: 20 })] })],
        }))
      }))
    ]
  });

  const children = [
    // Cover info
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "تقرير دراسة الهندسة القيمية", font: "Arial", size: 44, bold: true, color: "0D3D62" })],
      spacing: { before: 0, after: 200 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: data.projectName || "", font: "Arial", size: 32, bold: true, color: "0EA5E9" })],
      spacing: { after: 100 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `الجهة الحكومية: ${data.authority || ""}`, font: "Arial", size: 24 })],
      spacing: { after: 60 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `استشاري الهندسة القيمية: ${data.veConsultant || ""}`, font: "Arial", size: 24 })],
      spacing: { after: 60 } }),
    new Paragraph({ bidirectional: true, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `رقم الوثيقة: EPM-KEV-TP-000002`, font: "Arial", size: 22, color: "64748B" })],
      spacing: { after: 400 } }),

    // Stats box
    heading1("إحصائيات الدراسة"),
    makeTable(
      ["البيان", "القيمة"],
      [
        ["التكلفة الأساسية (بدون ضريبة)", `${data.baseCost || "—"} ريال`],
        ["التكلفة الأساسية (مع الضريبة)", `${data.baseCostVat || "—"} ريال`],
        ["تفادي التكاليف المحتمل", `${data.costAvoidance || "—"} ريال`],
        ["نسبة تفادي التكاليف", `${pct} %`],
        ["العدد الكلي للأفكار", `${data.totalIdeas || "—"} فكرة`],
        ["الأفكار المطورة", `${data.developedIdeas || "—"} فكرة`],
        ["الاعتبارات التصميمية", `${data.designConsiderations || "—"} فكرة`],
        ["الأفكار المستبعدة", `${data.rejectedIdeas || "—"} فكرة`],
        ["أعضاء فريق الدراسة", `${data.team?.filter(m => m.name).length || 0} عضو`],
      ],
      [4513, 4513]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    // Report content (rendered from text)
    heading1("1. الملخص التنفيذي"),
    rtlPara(`المشروع: ${data.projectName}`),
    rtlPara(`الجهة: ${data.authority}`),
    rtlPara(data.projectDesc || "", { size: 22 }),

    heading2("1.1 أهداف الدراسة"),
    ...(data.objectives || "").split("\n").filter(Boolean).map(line => rtlPara(`• ${line}`, { size: 22 })),

    heading1("2. فريق الهندسة القيمية"),
    makeTable(
      ["#", "الاسم", "الجهة", "الوظيفة", "التخصص", "الهاتف"],
      data.team.filter(m => m.name).map((m, i) => [i + 1, m.name, m.org, m.role, m.spec, m.phone]),
      [500, 1800, 1726, 1500, 1500, 2000]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("3. نظرة عامة عن المشروع"),
    heading2("3.1 مقدمة عن المشروع"),
    rtlPara(data.projectDesc || "", { size: 22 }),
    heading2("3.2 نطاق عمل المشروع وموقعه"),
    rtlPara(data.location || "", { size: 22 }),
    heading2("3.3 الوثائق والمستندات المرجعية"),
    makeTable(
      ["#", "المستند"],
      data.refDocs.filter(Boolean).map((d, i) => [i + 1, d]),
      [600, 8426]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("4. سمات الأداء ونموذج الجودة"),
    makeTable(
      ["سمة الأداء", "المستوى المستهدف (1-10)"],
      (data.perfAttribs || []).filter(a => a.name).map(a => [a.name, a.level]),
      [6000, 3026]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("5. مرحلة تحليل الوظائف"),
    makeTable(
      ["#", "عنصر المشروع", "الوظيفة (فعل + اسم)", "تصنيف الوظيفة"],
      (data.functions || []).filter(f => f.element || f.func).map((f, i) => [i + 1, f.element, f.func, f.type]),
      [400, 2500, 3626, 2500]
    ),
    new Paragraph({ children: [], spacing: { after: 120 } }),
    heading2("الوظائف ذات الأولوية"),
    ...(data.priorityFunctions || "").split("\n").filter(Boolean).map(line => rtlPara(`• ${line}`, { size: 22 })),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("6. مرحلة طرح الأفكار"),
    makeTable(
      ["#", "وصف الفكرة", "التقييم"],
      (data.ideas || []).filter(id => id.desc).map((id, i) => [i + 1, id.desc, id.rating]),
      [400, 7126, 1500]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("7. مرحلة التقييم - نتائج التقييم الحرفي"),
    makeTable(
      ["#", "وصف الفكرة", "التقييم", "القرار"],
      (data.ideas || []).filter(id => id.desc).map((id, i) => [
        i + 1, id.desc, id.rating,
        id.rating === "D" ? "مستبعد" : "يُطوَّر"
      ]),
      [400, 6126, 1000, 1500]
    ),

    new Paragraph({ children: [], spacing: { after: 240 } }),

    heading1("8. مرحلة التطوير - المقترحات التطويرية"),
    ...(data.proposals || []).flatMap((p, i) => [
      heading2(`المقترح رقم ${i + 1}: ${p.title}`),
      makeTable(
        ["البند", "التفاصيل"],
        [
          ["الوضع الراهن", p.current],
          ["المقترح التطويري", p.proposed],
          ["المزايا والإيجابيات", p.pros],
          ["السلبيات والتحديات", p.cons],
          ["الأثر المالي المحتمل", `${p.financialImpact || "—"} ريال`],
          ["تصنيف الأثر المالي", p.impactType],
          ["معامل التعديل", p.adjustFactor],
          ["مبرر معامل التعديل", p.adjustReason],
          ["الأثر المالي المعدّل", (() => {
            const imp = parseFloat((p.financialImpact || "0").replace(/,/g, "")) || 0;
            const adj = parseFloat(p.adjustFactor || "1") || 1;
            return `${(imp * adj).toLocaleString("ar-SA", { maximumFractionDigits: 0 })} ريال`;
          })()],
          ["ملاحظات", p.notes],
        ].filter(row => row[1]),
        [3000, 6026]
      ),
      new Paragraph({ children: [], spacing: { after: 200 } }),
    ]),

    heading1("9. ملخص الأثر المالي للمقترحات"),
    makeTable(
      ["#", "عنوان المقترح", "تصنيف الأثر", "الأثر المحتمل (ريال)", "معامل التعديل", "الأثر المعدّل (ريال)"],
      (data.proposals || []).filter(p => p.title).map((p, i) => {
        const imp = parseFloat((p.financialImpact || "0").replace(/,/g, "")) || 0;
        const adj = parseFloat(p.adjustFactor || "1") || 1;
        return [i + 1, p.title, p.impactType, p.financialImpact || "—", p.adjustFactor, (imp * adj).toLocaleString("ar-SA", { maximumFractionDigits: 0 })];
      }),
      [400, 2500, 1200, 1500, 1126, 1800]
    ),

    new Paragraph({ children: [], spacing: { after: 120 } }),

    // Summary totals
    ...(() => {
      const avoidArr = (data.proposals || []).filter(p => p.impactType === "تفادي");
      const extraArr = (data.proposals || []).filter(p => p.impactType === "إضافي");
      const totalAvoid = avoidArr.reduce((s, p) => {
        const imp = parseFloat((p.financialImpact || "0").replace(/,/g, "")) || 0;
        const adj = parseFloat(p.adjustFactor || "1") || 1;
        return s + imp * adj;
      }, 0);
      const totalExtra = extraArr.reduce((s, p) => {
        const imp = parseFloat((p.financialImpact || "0").replace(/,/g, "")) || 0;
        const adj = parseFloat(p.adjustFactor || "1") || 1;
        return s + imp * adj;
      }, 0);
      return [
        makeTable(
          ["البيان", "المبلغ"],
          [
            ["مجموع تفادي التكاليف المحتمل (المعدّل)", `${totalAvoid.toLocaleString("ar-SA", { maximumFractionDigits: 0 })} ريال`],
            ["مجموع التكاليف الإضافية المحتملة", `${totalExtra.toLocaleString("ar-SA", { maximumFractionDigits: 0 })} ريال`],
            ["التكلفة الأساسية للمشروع (بدون ضريبة)", `${data.baseCost || "—"} ريال`],
            ["نسبة تفادي التكاليف الإجمالية", `${pct} %`],
          ],
          [5000, 4026]
        )
      ];
    })(),

    // AI-generated report section
    new Paragraph({ children: [], spacing: { after: 400 } }),
    heading1("10. التقرير التحليلي المفصّل (مولَّد بالذكاء الاصطناعي)"),
    ...(reportText || "").split("\n").filter(Boolean).map(line => {
      if (line.startsWith("# ")) return heading1(line.replace(/^# /, ""));
      if (line.startsWith("## ")) return heading2(line.replace(/^## /, ""));
      if (line.startsWith("### ")) return new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: line.replace(/^### /, ""), font: "Arial", size: 24, bold: true, color: "334155" })],
        spacing: { before: 160, after: 80 } });
      if (line.startsWith("- ") || line.startsWith("• ")) return rtlPara(`• ${line.replace(/^[-•] /, "")}`, { size: 22 });
      if (line.startsWith("|")) return null;
      return rtlPara(line, { size: 22 });
    }).filter(Boolean),
  ];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            bidirectional: true, alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `تقرير الهندسة القيمية | ${data.projectName || ""}`, font: "Arial", size: 18, color: "0D3D62" }),
              new TextRun({ text: "  |  EPM-KEV-TP-000002", font: "Arial", size: 18, color: "94A3B8" }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "0EA5E9", space: 4 } },
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            bidirectional: true, alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "الصفحة ", font: "Arial", size: 18, color: "94A3B8" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "0D3D62" }),
              new TextRun({ text: " | هيئة كفاءة الإنفاق والمشروعات الحكومية", font: "Arial", size: 18, color: "94A3B8" }),
            ],
          })]
        })
      },
      children,
    }],
    numbering: { config: [] },
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `تقرير_الهندسة_القيمية_${data.projectName || "مشروع"}.docx`);
}

// ─── STEP 7: GENERATE + EDIT + EXPORT ────────────────────────────────────────
function Step7({ data, onBack }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const base = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoid = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = base > 0 ? ((avoid / base) * 100).toFixed(1) : "0.0";

  const generate = async () => {
    setLoading(true); setError(""); setReport("");
    const prompt = `أنت محلل خبير في الهندسة القيمية (VE Expert) معتمد من هيئة كفاءة الإنفاق والمشروعات الحكومية (EXPRO).

اكتب تقريراً تحليلياً مفصلاً بالعربية الفصحى الرصينة المناسبة للتقارير الحكومية السعودية.

البيانات:
- المشروع: ${data.projectName}
- الجهة: ${data.authority}
- الاستشاري: ${data.veConsultant}
- مرحلة التصميم: ${data.designPhase || "التصميم التفصيلي"}
- فترة الورشة: ${data.workshopStart || "—"} إلى ${data.workshopEnd || "—"}
- الوصف: ${data.projectDesc || "—"}
- الموقع: ${data.location || "—"}
- الأهداف: ${data.objectives || "—"}
- التكلفة الأساسية: ${data.baseCost || "—"} ريال
- التكلفة مع الضريبة: ${data.baseCostVat || "—"} ريال
- تفادي التكاليف: ${data.costAvoidance || "—"} ريال (${pct}%)
- إجمالي الأفكار: ${data.totalIdeas || 0} (مطورة: ${data.developedIdeas || 0}، مستبعدة: ${data.rejectedIdeas || 0})
- سمات الأداء: ${(data.perfAttribs || []).filter(a => a.name).map(a => `${a.name}: ${a.level}/10`).join("، ") || "—"}
- الوظائف ذات الأولوية: ${data.priorityFunctions || "—"}
- الأفكار والتقييم: ${(data.ideas || []).map((id, i) => `${i + 1}.[${id.rating}] ${id.desc}`).join(" | ") || "—"}
- المقترحات: ${(data.proposals || []).map((p, i) => `${i + 1}.${p.title}| الوضع الراهن:${p.current}| المقترح:${p.proposed}| المزايا:${p.pros}| التحديات:${p.cons}| الأثر:${p.financialImpact} ريال (${p.impactType})`).join(" || ") || "—"}

اكتب تقريراً يشمل:

# الملخص التنفيذي
(مقدمة احترافية تبرز القيمة المضافة للدراسة)

## ملخص دراسة الهندسة القيمية
(وصف شامل للدراسة ومنهجيتها ومخرجاتها)

## أبرز نتائج الدراسة
(أهم المقترحات والتوصيات)

# منهجية الدراسة وخطة العمل
(شرح مراحل الهندسة القيمية المطبقة)

# تحليل المعلومات والنماذج
(تفسير نموذج التكاليف وسمات الأداء)

# تحليل الوظائف
(تفسير وظائف المشروع ومخطط FAST)

# مرحلة طرح الأفكار
(وصف جلسة العصف الذهني وأبرز الأفكار)

# مرحلة التطوير والمقترحات
${(data.proposals || []).map((p, i) => `## المقترح ${i + 1}: ${p.title}
(تحليل تفصيلي احترافي للمقترح، ومقارنة الوضع الراهن بالمقترح، وتبرير الأثر المالي)`).join("\n")}

# الخلاصة والتوصيات
(توصيات ختامية للجهة الحكومية)

استخدم مصطلحات: تفادي التكاليف، كفاءة الأداء، سمات الجودة، مخطط فاست، كفاءة الإنفاق الحكومي.
لا تضف أي محتوى خارج نص التقرير.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000,
          messages: [{ role: "user", content: prompt }] }),
      });
      const result = await res.json();
      if (result.content?.[0]?.text) {
        setReport(result.content[0].text);
        setEditing(false);
      } else {
        setError("حدث خطأ في الاتصال بالنموذج.");
      }
    } catch (e) { setError("خطأ: " + e.message); }
    finally { setLoading(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await exportToWord(data, report); }
    catch (e) { setError("خطأ في التصدير: " + e.message); }
    finally { setExporting(false); }
  };

  const renderReport = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h2 key={i} style={{ color: "#0d3d62", borderBottom: "2px solid #0ea5e9", paddingBottom: 5, marginTop: 24, fontWeight: 800, fontSize: 17 }}>{line.replace(/^# /, "")}</h2>;
      if (line.startsWith("## ")) return <h3 key={i} style={{ color: "#1e3a5f", marginTop: 16, fontWeight: 700, fontSize: 14 }}>{line.replace(/^## /, "")}</h3>;
      if (line.startsWith("### ")) return <h4 key={i} style={{ color: "#334155", marginTop: 10, fontWeight: 700, fontSize: 13 }}>{line.replace(/^### /, "")}</h4>;
      if (line.startsWith("- ") || line.startsWith("• ")) return <div key={i} style={{ margin: "3px 0 3px 0", paddingRight: 16, color: "#374151", fontSize: 13 }}>• {line.replace(/^[-•] /, "")}</div>;
      if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
      return <p key={i} style={{ margin: "3px 0", color: "#374151", fontSize: 13, lineHeight: 1.7 }}>{line}</p>;
    });

  return (
    <div>
      {/* Summary */}
      <Card>
        <SectionTitle>توليد التقرير الاحترافي</SectionTitle>
        <div style={{ background: "linear-gradient(135deg,#0d3d62,#0ea5e9)", borderRadius: 12,
          padding: 18, color: "#fff", marginBottom: 18, fontSize: 13 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>ملخص البيانات المدخلة</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              ["📁 المشروع", data.projectName],
              ["🏛️ الجهة", data.authority],
              ["👤 الاستشاري", data.veConsultant],
              ["💰 التكلفة", `${data.baseCost || "—"} ريال`],
              ["✅ تفادي التكاليف", `${pct}%`],
              ["💡 أفكار", `${(data.ideas || []).length} | مقترحات: ${(data.proposals || []).length}`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
                <strong>{k}:</strong> {v || "—"}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={generate} disabled={loading}
            style={{ flex: 1, minWidth: 200, padding: "13px", borderRadius: 10, border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(135deg,#16a34a,#0ea5e9)",
              color: "#fff", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontSize: 14 }}>
            {loading ? "⏳ جارٍ التوليد..." : report ? "🔄 إعادة التوليد" : "🚀 توليد التقرير الاحترافي"}
          </button>
          {report && (
            <>
              <button onClick={() => setEditing(e => !e)}
                style={{ padding: "13px 22px", borderRadius: 10, border: "1.5px solid #0d3d62",
                  background: editing ? "#0d3d62" : "#fff", color: editing ? "#fff" : "#0d3d62",
                  fontWeight: 800, cursor: "pointer", fontSize: 14 }}>
                {editing ? "👁️ معاينة" : "✏️ تحرير"}
              </button>
              <button onClick={handleExport} disabled={exporting}
                style={{ padding: "13px 22px", borderRadius: 10, border: "none",
                  background: exporting ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#1e5a8c)",
                  color: "#fff", fontWeight: 800, cursor: exporting ? "not-allowed" : "pointer", fontSize: 14 }}>
                {exporting ? "⏳ جارٍ التصدير..." : "⬇️ تحميل Word (.docx)"}
              </button>
            </>
          )}
        </div>
        {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 9,
          padding: 12, color: "#dc2626", marginTop: 12, fontWeight: 600, fontSize: 13 }}>{error}</div>}
      </Card>

      {report && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0d3d62" }}>
              {editing ? "✏️ تحرير التقرير" : "📄 معاينة التقرير"}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {editing ? "يمكنك تعديل النص مباشرة ثم تحميله" : "اضغط 'تحرير' لتعديل النص"}
            </div>
          </div>

          {editing ? (
            <textarea value={report} onChange={e => setReport(e.target.value)} rows={40}
              style={{ width: "100%", padding: "14px", borderRadius: 9, border: "1.5px solid #0ea5e9",
                fontSize: 13, direction: "rtl", fontFamily: "Cairo,sans-serif", lineHeight: 1.8,
                background: "#f8fafc", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
          ) : (
            <div style={{ direction: "rtl", lineHeight: 1.8, background: "#fafafa", borderRadius: 10,
              padding: 22, border: "1px solid #e2e8f0", maxHeight: "65vh", overflowY: "auto" }}>
              {renderReport(report)}
            </div>
          )}

          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => navigator.clipboard.writeText(report).then(() => alert("تم النسخ ✓"))}
              style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #0d3d62",
                background: "#fff", color: "#0d3d62", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              📋 نسخ النص
            </button>
            <button onClick={handleExport} disabled={exporting}
              style={{ padding: "9px 18px", borderRadius: 8, border: "none",
                background: exporting ? "#94a3b8" : "linear-gradient(135deg,#0d3d62,#0ea5e9)",
                color: "#fff", fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", fontSize: 13 }}>
              {exporting ? "⏳..." : "⬇️ تحميل Word"}
            </button>
          </div>
        </Card>
      )}
      <NavButtons onBack={onBack} onNext={() => {}} nextLabel="✅ انتهاء" />
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const next = () => setStep(s => Math.min(s + 1, 7));
  const back = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f7ff,#e8f4fd 50%,#f0fdf4)",
      padding: "28px 16px", fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0d3d62,#1a5a8c,#0ea5e9)",
          borderRadius: 16, padding: "24px 32px", marginBottom: 26, color: "#fff",
          boxShadow: "0 8px 36px #0d3d6230" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>🏛️</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
                منصة توليد تقارير الهندسة القيمية
              </div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>
                وفق معايير هيئة كفاءة الإنفاق والمشروعات الحكومية (EXPRO) | EPM-KEV-TP-000002
              </div>
            </div>
          </div>
        </div>

        <ProgressBar current={step} />

        {step === 1 && <Step1 data={data} setData={setData} onNext={next} />}
        {step === 2 && <Step2 data={data} setData={setData} onBack={back} onNext={next} />}
        {step === 3 && <Step3 data={data} setData={setData} onBack={back} onNext={next} />}
        {step === 4 && <Step4 data={data} setData={setData} onBack={back} onNext={next} />}
        {step === 5 && <Step5 data={data} setData={setData} onBack={back} onNext={next} />}
        {step === 6 && <Step6 data={data} setData={setData} onBack={back} onNext={next} />}
        {step === 7 && <Step7 data={data} onBack={back} />}

        <div style={{ textAlign: "center", marginTop: 20, color: "#94a3b8", fontSize: 11 }}>
          منصة مدعومة بالذكاء الاصطناعي · متوافقة مع نموذج EXPRO · رقم الوثيقة: EPM-KEV-TP-000002
        </div>
      </div>
    </div>
  );
}
