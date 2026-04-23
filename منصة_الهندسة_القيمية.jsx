import { useState, useRef } from "react";

const STEPS = [
  { id: 1, label: "بيانات المشروع", icon: "🏗️" },
  { id: 2, label: "فريق الدراسة", icon: "👥" },
  { id: 3, label: "التكاليف والإحصائيات", icon: "💰" },
  { id: 4, label: "تحليل الوظائف", icon: "⚙️" },
  { id: 5, label: "الأفكار والتقييم", icon: "💡" },
  { id: 6, label: "المقترحات التطويرية", icon: "📋" },
  { id: 7, label: "توليد التقرير", icon: "📄" },
];

const RATING_LABELS = {
  A: { label: "A – ممتاز", color: "#16a34a", bg: "#dcfce7" },
  B: { label: "B – جيد جداً", color: "#2563eb", bg: "#dbeafe" },
  C: { label: "C – جيد", color: "#d97706", bg: "#fef3c7" },
  D: { label: "D – مستبعد", color: "#dc2626", bg: "#fee2e2" },
};

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
      {STEPS.map((s) => (
        <div
          key={s.id}
          style={{
            flex: 1,
            minWidth: 90,
            padding: "8px 10px",
            borderRadius: 10,
            background: current === s.id ? "#0d3d62" : current > s.id ? "#0ea5e9" : "#e2e8f0",
            color: current >= s.id ? "#fff" : "#64748b",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.3s",
            cursor: "default",
            boxShadow: current === s.id ? "0 4px 16px #0d3d6244" : "none",
          }}
        >
          <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
          {s.label}
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#1e3a5f", fontSize: 14 }}>
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #cbd5e1",
          fontSize: 14, outline: "none", direction: "rtl", fontFamily: "inherit",
          background: "#f8fafc", boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0d3d62")}
        onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#1e3a5f", fontSize: 14 }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #cbd5e1",
          fontSize: 14, outline: "none", direction: "rtl", fontFamily: "inherit",
          background: "#f8fafc", resize: "vertical", boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0d3d62")}
        onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
      />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      borderRight: "4px solid #0d3d62", paddingRight: 14, marginBottom: 22, marginTop: 8,
      color: "#0d3d62", fontWeight: 800, fontSize: 17,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 16px #0d3d620f",
      border: "1px solid #e2e8f0", marginBottom: 18, ...style,
    }}>
      {children}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "التالي →", disabled = false, loading = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
      {onBack ? (
        <button onClick={onBack} style={{
          padding: "10px 28px", borderRadius: 9, border: "1.5px solid #0d3d62",
          background: "#fff", color: "#0d3d62", fontWeight: 700, cursor: "pointer", fontSize: 14,
        }}>
          ← السابق
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={disabled || loading}
        style={{
          padding: "11px 34px", borderRadius: 9, border: "none",
          background: disabled || loading ? "#94a3b8" : "linear-gradient(135deg, #0d3d62, #0ea5e9)",
          color: "#fff", fontWeight: 800, cursor: disabled || loading ? "not-allowed" : "pointer",
          fontSize: 15, boxShadow: "0 3px 12px #0d3d6230",
        }}
      >
        {loading ? "⏳ جارٍ التوليد..." : nextLabel}
      </button>
    </div>
  );
}

// ─── STEP 1: Project Info ───────────────────────────────────────────────────
function Step1({ data, setData, onNext }) {
  const u = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <Card>
      <SectionTitle>بيانات المشروع الأساسية</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <Input label="اسم المشروع" value={data.projectName} onChange={u("projectName")} placeholder="مشروع إنشاء..." required />
        <Input label="رقم المشروع" value={data.projectNo} onChange={u("projectNo")} placeholder="PRJ-2025-001" />
        <Input label="الجهة الحكومية" value={data.authority} onChange={u("authority")} placeholder="جامعة أم القرى" required />
        <Input label="استشاري التصميم" value={data.designConsultant} onChange={u("designConsultant")} placeholder="شركة..." />
        <Input label="استشاري الهندسة القيمية" value={data.veConsultant} onChange={u("veConsultant")} placeholder="اسم الاستشاري" required />
        <Input label="مرحلة التصميم" value={data.designPhase} onChange={u("designPhase")} placeholder="مرحلة التصميم التفصيلي" />
        <Input label="تاريخ بداية ورشة العمل" value={data.workshopStart} onChange={u("workshopStart")} type="date" />
        <Input label="تاريخ نهاية ورشة العمل" value={data.workshopEnd} onChange={u("workshopEnd")} type="date" />
      </div>
      <Textarea label="وصف المشروع ونطاق العمل" value={data.projectDesc} onChange={u("projectDesc")} rows={4}
        placeholder="يتضمن المشروع إنشاء وتنفيذ..." />
      <Textarea label="موقع المشروع" value={data.location} onChange={u("location")} rows={2} placeholder="المنطقة، المدينة..." />
      <Textarea label="أهداف دراسة الهندسة القيمية" value={data.objectives} onChange={u("objectives")} rows={3}
        placeholder="تحسين القيمة - ترشيد الإنفاق - رفع كفاءة الأداء..." />
      <NavButtons onNext={onNext} disabled={!data.projectName || !data.authority || !data.veConsultant} />
    </Card>
  );
}

// ─── STEP 2: Team ───────────────────────────────────────────────────────────
function Step2({ data, setData, onBack, onNext }) {
  const addMember = () =>
    setData((d) => ({ ...d, team: [...d.team, { name: "", org: "", role: "", spec: "", phone: "", email: "" }] }));
  const updateMember = (i, k, v) =>
    setData((d) => {
      const t = [...d.team];
      t[i] = { ...t[i], [k]: v };
      return { ...d, team: t };
    });
  const removeMember = (i) =>
    setData((d) => ({ ...d, team: d.team.filter((_, idx) => idx !== i) }));

  return (
    <Card>
      <SectionTitle>فريق الهندسة القيمية</SectionTitle>
      {data.team.map((m, i) => (
        <div key={i} style={{
          background: "#f0f7ff", borderRadius: 10, padding: 16, marginBottom: 14,
          border: "1px solid #bfdbfe", position: "relative",
        }}>
          <div style={{ fontWeight: 700, color: "#1e3a5f", marginBottom: 10 }}>عضو #{i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
            <Input label="الاسم" value={m.name} onChange={(v) => updateMember(i, "name", v)} placeholder="الاسم الكامل" />
            <Input label="الجهة" value={m.org} onChange={(v) => updateMember(i, "org", v)} placeholder="اسم الجهة" />
            <Input label="الوظيفة" value={m.role} onChange={(v) => updateMember(i, "role", v)} placeholder="المسمى الوظيفي" />
            <Input label="التخصص" value={m.spec} onChange={(v) => updateMember(i, "spec", v)} placeholder="هندسة مدنية..." />
            <Input label="الهاتف" value={m.phone} onChange={(v) => updateMember(i, "phone", v)} placeholder="05xxxxxxxx" />
            <Input label="البريد الإلكتروني" value={m.email} onChange={(v) => updateMember(i, "email", v)} placeholder="name@org.sa" />
          </div>
          <button onClick={() => removeMember(i)} style={{
            position: "absolute", top: 10, left: 14, background: "#fee2e2", border: "none",
            borderRadius: 6, padding: "3px 10px", color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}>حذف</button>
        </div>
      ))}
      <button onClick={addMember} style={{
        width: "100%", padding: "11px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 14, marginBottom: 8,
      }}>
        + إضافة عضو
      </button>
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 3: Costs & Stats ──────────────────────────────────────────────────
function Step3({ data, setData, onBack, onNext }) {
  const u = (k) => (v) => setData((d) => ({ ...d, [k]: v }));

  const baseCostNum = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoidanceNum = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = baseCostNum > 0 ? ((avoidanceNum / baseCostNum) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <SectionTitle>التكاليف والإحصائيات</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <Input label="التكلفة الأساسية للمشروع (بدون ضريبة) ريال" value={data.baseCost} onChange={u("baseCost")} placeholder="33,891,457" required />
        <Input label="التكلفة الأساسية (مع الضريبة) ريال" value={data.baseCostVat} onChange={u("baseCostVat")} placeholder="39,872,306" />
        <Input label="تفادي التكاليف المحتمل ريال" value={data.costAvoidance} onChange={u("costAvoidance")} placeholder="5,000,000" />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#1e3a5f", fontSize: 14 }}>
            نسبة تفادي التكاليف (محسوبة تلقائياً)
          </label>
          <div style={{
            padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1.5px solid #86efac",
            fontSize: 18, fontWeight: 800, color: "#16a34a",
          }}>
            {pct}%
          </div>
        </div>
        <Input label="العدد الكلي للأفكار" value={data.totalIdeas} onChange={u("totalIdeas")} type="number" placeholder="15" />
        <Input label="الأفكار المطورة" value={data.developedIdeas} onChange={u("developedIdeas")} type="number" placeholder="8" />
        <Input label="الاعتبارات التصميمية" value={data.designConsiderations} onChange={u("designConsiderations")} type="number" placeholder="3" />
        <Input label="الأفكار المستبعدة" value={data.rejectedIdeas} onChange={u("rejectedIdeas")} type="number" placeholder="4" />
      </div>
      <SectionTitle>سمات الأداء ونموذج الجودة</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        {["أ", "ب", "ج", "د", "هـ", "و"].map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input
                label={`سمة الأداء (${l})`}
                value={data.perfAttribs?.[i]?.name || ""}
                onChange={(v) => {
                  const arr = [...(data.perfAttribs || Array(6).fill({ name: "", level: 7 }))];
                  arr[i] = { ...arr[i], name: v };
                  setData((d) => ({ ...d, perfAttribs: arr }));
                }}
                placeholder="سهولة الصيانة..."
              />
            </div>
            <div style={{ width: 80, marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#1e3a5f", fontSize: 12 }}>
                المستوى (1-10)
              </label>
              <input
                type="number" min={1} max={10}
                value={data.perfAttribs?.[i]?.level || ""}
                onChange={(e) => {
                  const arr = [...(data.perfAttribs || Array(6).fill({ name: "", level: 7 }))];
                  arr[i] = { ...arr[i], level: e.target.value };
                  setData((d) => ({ ...d, perfAttribs: arr }));
                }}
                style={{
                  width: "100%", padding: "10px 8px", borderRadius: 8, border: "1.5px solid #cbd5e1",
                  fontSize: 14, textAlign: "center", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} disabled={!data.baseCost} />
    </Card>
  );
}

// ─── STEP 4: Function Analysis ──────────────────────────────────────────────
function Step4({ data, setData, onBack, onNext }) {
  const addFunc = () =>
    setData((d) => ({ ...d, functions: [...(d.functions || []), { element: "", func: "", type: "أساسية" }] }));
  const updateFunc = (i, k, v) =>
    setData((d) => {
      const f = [...(d.functions || [])];
      f[i] = { ...f[i], [k]: v };
      return { ...d, functions: f };
    });
  const removeFunc = (i) =>
    setData((d) => ({ ...d, functions: (d.functions || []).filter((_, idx) => idx !== i) }));

  return (
    <Card>
      <SectionTitle>تحليل الوظائف (قائمة التحديد العشوائي)</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#0d3d62", color: "#fff" }}>
              <th style={{ padding: "10px 12px", borderRadius: "8px 0 0 0" }}>#</th>
              <th style={{ padding: "10px 12px" }}>عنصر المشروع</th>
              <th style={{ padding: "10px 12px" }}>الوظيفة (فعل + اسم)</th>
              <th style={{ padding: "10px 12px" }}>تصنيف الوظيفة</th>
              <th style={{ padding: "10px 12px", borderRadius: "0 8px 0 0" }}></th>
            </tr>
          </thead>
          <tbody>
            {(data.functions || []).map((f, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                <td style={{ padding: "4px 8px" }}>
                  <input value={f.element} onChange={(e) => updateFunc(i, "element", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "inherit", fontSize: 13 }}
                    placeholder="قناة تصريف..." />
                </td>
                <td style={{ padding: "4px 8px" }}>
                  <input value={f.func} onChange={(e) => updateFunc(i, "func", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "inherit", fontSize: 13 }}
                    placeholder="تصريف المياه..." />
                </td>
                <td style={{ padding: "4px 8px" }}>
                  <select value={f.type} onChange={(e) => updateFunc(i, "type", e.target.value)}
                    style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", direction: "rtl", fontFamily: "inherit", fontSize: 13 }}>
                    <option>أساسية</option>
                    <option>ثانوية</option>
                    <option>غير مطلوبة</option>
                  </select>
                </td>
                <td style={{ padding: "4px 8px", textAlign: "center" }}>
                  <button onClick={() => removeFunc(i)} style={{ background: "#fee2e2", border: "none", borderRadius: 5, padding: "4px 10px", color: "#dc2626", cursor: "pointer", fontWeight: 700 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addFunc} style={{
        width: "100%", padding: "10px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 14, marginTop: 14,
      }}>+ إضافة وظيفة</button>
      <Textarea
        label="الوظائف ذات الأولوية (اذكرها بسطر لكل وظيفة)"
        value={data.priorityFunctions || ""}
        onChange={(v) => setData((d) => ({ ...d, priorityFunctions: v }))}
        rows={3}
        placeholder="تصريف مياه الأمطار&#10;حماية المنشآت&#10;درء مخاطر السيول"
      />
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 5: Ideas & Evaluation ─────────────────────────────────────────────
function Step5({ data, setData, onBack, onNext }) {
  const addIdea = () =>
    setData((d) => ({ ...d, ideas: [...(d.ideas || []), { desc: "", rating: "A" }] }));
  const updateIdea = (i, k, v) =>
    setData((d) => {
      const arr = [...(d.ideas || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...d, ideas: arr };
    });
  const removeIdea = (i) =>
    setData((d) => ({ ...d, ideas: (d.ideas || []).filter((_, idx) => idx !== i) }));

  return (
    <Card>
      <SectionTitle>قائمة الأفكار والتقييم</SectionTitle>
      <div style={{ background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 13 }}>
        <strong>معايير التقييم الحرفي:</strong> A = ممتاز (يُطوَّر) | B = جيد جداً (يُطوَّر) | C = جيد (يُطوَّر) | D = مستبعد
      </div>
      {(data.ideas || []).map((idea, i) => (
        <div key={i} style={{
          display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10,
          background: "#f8fafc", borderRadius: 10, padding: 12, border: "1px solid #e2e8f0",
        }}>
          <div style={{
            minWidth: 30, height: 30, borderRadius: "50%", background: "#0d3d62",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, marginTop: 4,
          }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <textarea
              value={idea.desc}
              onChange={(e) => updateIdea(i, "desc", e.target.value)}
              placeholder="وصف الفكرة المقترحة..."
              rows={2}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid #cbd5e1",
                fontSize: 13, direction: "rtl", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 110 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#1e3a5f" }}>التقييم</label>
            {Object.entries(RATING_LABELS).map(([k, v]) => (
              <label key={k} style={{
                display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                padding: "4px 8px", borderRadius: 6,
                background: idea.rating === k ? v.bg : "transparent",
                border: `1.5px solid ${idea.rating === k ? v.color : "#e2e8f0"}`,
              }}>
                <input type="radio" name={`r-${i}`} value={k} checked={idea.rating === k}
                  onChange={() => updateIdea(i, "rating", k)} style={{ accentColor: v.color }} />
                <span style={{ fontSize: 12, color: v.color, fontWeight: 700 }}>{v.label}</span>
              </label>
            ))}
          </div>
          <button onClick={() => removeIdea(i)} style={{
            background: "#fee2e2", border: "none", borderRadius: 6, padding: "5px 10px",
            color: "#dc2626", cursor: "pointer", fontWeight: 800, marginTop: 4,
          }}>×</button>
        </div>
      ))}
      <button onClick={addIdea} style={{
        width: "100%", padding: "10px", borderRadius: 9, border: "2px dashed #0ea5e9",
        background: "#f0f9ff", color: "#0ea5e9", fontWeight: 700, cursor: "pointer", fontSize: 14, marginBottom: 8,
      }}>+ إضافة فكرة</button>
      <NavButtons onBack={onBack} onNext={onNext} />
    </Card>
  );
}

// ─── STEP 6: Proposals ──────────────────────────────────────────────────────
function Step6({ data, setData, onBack, onNext }) {
  const addProposal = () =>
    setData((d) => ({
      ...d,
      proposals: [...(d.proposals || []), {
        title: "", current: "", proposed: "", pros: "", cons: "",
        financialImpact: "", impactType: "تفادي", adjustFactor: "1.0", notes: "",
      }],
    }));
  const updateP = (i, k, v) =>
    setData((d) => {
      const arr = [...(d.proposals || [])];
      arr[i] = { ...arr[i], [k]: v };
      return { ...d, proposals: arr };
    });
  const removeP = (i) =>
    setData((d) => ({ ...d, proposals: (d.proposals || []).filter((_, idx) => idx !== i) }));

  return (
    <div>
      <Card>
        <SectionTitle>المقترحات التطويرية</SectionTitle>
        <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
          أدخل تفاصيل كل مقترح تم تطويره من الأفكار المقبولة (تقييم A أو B أو C)
        </p>
      </Card>
      {(data.proposals || []).map((p, i) => (
        <Card key={i} style={{ borderRight: "4px solid #0ea5e9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0d3d62" }}>المقترح رقم {i + 1}</div>
            <button onClick={() => removeP(i)} style={{
              background: "#fee2e2", border: "none", borderRadius: 7, padding: "5px 14px",
              color: "#dc2626", cursor: "pointer", fontWeight: 700,
            }}>حذف المقترح</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="عنوان المقترح" value={p.title} onChange={(v) => updateP(i, "title", v)}
                placeholder="استخدام مواد بناء محلية الصنع..." required />
            </div>
            <Textarea label="الوضع الراهن (التصميم الأصلي)" value={p.current} onChange={(v) => updateP(i, "current", v)}
              rows={3} placeholder="يعتمد التصميم الحالي على..." />
            <Textarea label="المقترح التطويري" value={p.proposed} onChange={(v) => updateP(i, "proposed", v)}
              rows={3} placeholder="يقترح الفريق..." />
            <Textarea label="المزايا والإيجابيات" value={p.pros} onChange={(v) => updateP(i, "pros", v)}
              rows={3} placeholder="تخفيض التكلفة&#10;تسريع التنفيذ&#10;دعم المحتوى المحلي" />
            <Textarea label="السلبيات والتحديات" value={p.cons} onChange={(v) => updateP(i, "cons", v)}
              rows={3} placeholder="قد يتطلب مراجعة المواصفات..." />
            <Input label="الأثر المالي المحتمل (ريال)" value={p.financialImpact} onChange={(v) => updateP(i, "financialImpact", v)}
              placeholder="3,500,000" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#1e3a5f", fontSize: 14 }}>
                تصنيف الأثر المالي
              </label>
              <select value={p.impactType} onChange={(e) => updateP(i, "impactType", e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #cbd5e1",
                  fontSize: 14, direction: "rtl", fontFamily: "inherit", background: "#f8fafc",
                }}>
                <option value="تفادي">تفادي في التكلفة</option>
                <option value="إضافي">تكلفة إضافية</option>
              </select>
            </div>
            <Input label="معامل التعديل" value={p.adjustFactor} onChange={(v) => updateP(i, "adjustFactor", v)} placeholder="0.85" />
            <Textarea label="ملاحظات إضافية" value={p.notes} onChange={(v) => updateP(i, "notes", v)} rows={2} placeholder="..." />
          </div>
        </Card>
      ))}
      <button onClick={addProposal} style={{
        width: "100%", padding: "12px", borderRadius: 9, border: "2px dashed #0d3d62",
        background: "#f0f7ff", color: "#0d3d62", fontWeight: 800, cursor: "pointer", fontSize: 14, marginBottom: 18,
      }}>+ إضافة مقترح تطويري</button>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel="توليد التقرير 🚀" />
    </div>
  );
}

// ─── STEP 7: Generate Report ─────────────────────────────────────────────────
function Step7({ data, onBack }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const reportRef = useRef(null);

  const baseCostNum = parseFloat((data.baseCost || "0").replace(/,/g, "")) || 0;
  const avoidanceNum = parseFloat((data.costAvoidance || "0").replace(/,/g, "")) || 0;
  const pct = baseCostNum > 0 ? ((avoidanceNum / baseCostNum) * 100).toFixed(1) : "0.0";

  const generateReport = async () => {
    setLoading(true);
    setError("");
    setReport("");

    const prompt = `أنت محلل خبير في الهندسة القيمية (VE Expert) معتمد من هيئة كفاءة الإنفاق والمشروعات الحكومية (EXPRO).

بناءً على البيانات المدخلة التالية، اكتب تقرير دراسة هندسة قيمية كامل ومحترف بالعربية الفصحى الرصينة المناسبة للتقارير الحكومية السعودية، مستخدماً هيكل نموذج تقرير EXPRO التالي:

═══ البيانات المدخلة ═══

المشروع: ${data.projectName}
الجهة: ${data.authority}
الاستشاري: ${data.veConsultant}
مرحلة التصميم: ${data.designPhase || "التصميم التفصيلي"}
فترة الورشة: من ${data.workshopStart || "—"} إلى ${data.workshopEnd || "—"}
الوصف: ${data.projectDesc || "—"}
الموقع: ${data.location || "—"}
الأهداف: ${data.objectives || "—"}

التكلفة الأساسية (بدون ضريبة): ${data.baseCost || "—"} ريال
التكلفة الأساسية (مع الضريبة): ${data.baseCostVat || "—"} ريال
تفادي التكاليف المحتمل: ${data.costAvoidance || "—"} ريال
نسبة تفادي التكاليف: ${pct}%
عدد الأفكار: ${data.totalIdeas || 0} فكرة (مطورة: ${data.developedIdeas || 0}، اعتبارات: ${data.designConsiderations || 0}، مستبعدة: ${data.rejectedIdeas || 0})

سمات الأداء:
${(data.perfAttribs || []).filter(a => a.name).map((a, i) => `- ${a.name}: المستوى ${a.level}/10`).join("\n") || "—"}

الوظائف المحددة:
${(data.functions || []).map((f, i) => `${i + 1}. ${f.element} → ${f.func} (${f.type})`).join("\n") || "—"}

الوظائف ذات الأولوية: ${data.priorityFunctions || "—"}

قائمة الأفكار والتقييم:
${(data.ideas || []).map((idea, i) => `${i + 1}. [${idea.rating}] ${idea.desc}`).join("\n") || "—"}

المقترحات التطويرية:
${(data.proposals || []).map((p, i) => `
المقترح ${i + 1}: ${p.title}
- الوضع الراهن: ${p.current}
- المقترح: ${p.proposed}
- المزايا: ${p.pros}
- التحديات: ${p.cons}
- الأثر المالي: ${p.financialImpact} ريال (${p.impactType})
- معامل التعديل: ${p.adjustFactor}
- ملاحظات: ${p.notes}`).join("\n") || "—"}

فريق الدراسة: ${(data.team || []).map(m => `${m.name} (${m.org} - ${m.role})`).join("، ") || "—"}

═══ التقرير المطلوب ═══

اكتب التقرير الكامل مقسماً إلى الأقسام التالية بدقة:

# 1. الملخص التنفيذي
## 1.1 مقدمة
## 1.2 ملخص دراسة الهندسة القيمية (مع الإحصائيات الكاملة)
## 1.3 ملخص الأثر المالي للمقترحات (جدول مفصل لكل مقترح يشمل: رقم المقترح، التصنيف، مقدار الأثر، معامل التعديل، مبرر المعامل، الأثر المعدّل)
## 1.4 أجندة ورشة العمل (جدول ثلاثة أيام)
## 1.5 فريق الهندسة القيمية (جدول بأعضاء الفريق)

# 2. نظرة عامة عن المشروع
## 2.1 مقدمة عن المشروع
## 2.2 نطاق عمل المشروع وموقعه
## 2.3 الوثائق والمستندات المرجعية

# 3. خطة عمل الهندسة القيمية
## 3.1 مرحلة الإعداد
## 3.2 ورشة عمل الهندسة القيمية

# 4. تحليل المعلومات وإعداد النماذج
## 4.1 نماذج تحليل التكاليف (وصف توزيع التكاليف)
## 4.2 سمات الأداء (جدول السمات ومستوياتها)
## 4.3 نموذج الجودة

# 5. مرحلة تحليل الوظائف
(جدول قائمة التحديد العشوائي للوظائف + وصف مخطط FAST + الوظائف ذات الأولوية)

# 6. مرحلة طرح الأفكار
(جدول قائمة الأفكار الكاملة)

# 7. مرحلة التقييم
## 7.1 تقنية التقييم
## 7.2 نتائج مرحلة التقييم (جدول الأفكار بعد التقييم)

# 8. مرحلة التطوير
(لكل مقترح: وصف الوضع الراهن، المقترح التطويري، المزايا، التحديات، الأثر المالي التفصيلي، الخلاصة)

التعليمات الإضافية:
- استخدم لغة عربية فصحى رصينة تناسب التقارير الحكومية السعودية
- استخدم مصطلحات الهندسة القيمية المعيارية: تفادي التكاليف، كفاءة الأداء، سمات الجودة، مخطط فاست، تحليل الوظائف
- أضف نصوصاً تفسيرية احترافية بين كل قسم
- اعرض الجداول بتنسيق Markdown واضح
- الأرقام المالية بفواصل الآلاف وعملة الريال السعودي
- لا تضف تعليقاً أو توضيحاً خارج نص التقرير`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const result = await response.json();
      if (result.content?.[0]?.text) {
        setReport(result.content[0].text);
      } else {
        setError("حدث خطأ في الاتصال بالنموذج. يرجى المحاولة مرة أخرى.");
      }
    } catch (e) {
      setError("حدث خطأ غير متوقع: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    navigator.clipboard.writeText(report).then(() => {
      alert("تم نسخ التقرير إلى الحافظة ✓");
    });
  };

  // Render markdown-ish text
  const renderReport = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h2 key={i} style={{ color: "#0d3d62", borderBottom: "2px solid #0ea5e9", paddingBottom: 6, marginTop: 28, fontWeight: 800, fontSize: 18 }}>{line.replace(/^# /, "")}</h2>;
      if (line.startsWith("## ")) return <h3 key={i} style={{ color: "#1e3a5f", marginTop: 18, fontWeight: 700, fontSize: 15 }}>{line.replace(/^## /, "")}</h3>;
      if (line.startsWith("### ")) return <h4 key={i} style={{ color: "#334155", marginTop: 12, fontWeight: 700, fontSize: 14 }}>{line.replace(/^### /, "")}</h4>;
      if (line.startsWith("|")) {
        const cells = line.split("|").filter(Boolean);
        const isHeader = text.split("\n")[i + 1]?.startsWith("|---") || text.split("\n")[i + 1]?.startsWith("| --");
        return (
          <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
            {cells.map((c, j) => isHeader
              ? <th key={j} style={{ padding: "8px 12px", background: "#0d3d62", color: "#fff", border: "1px solid #2563eb", fontSize: 13 }}>{c.trim()}</th>
              : <td key={j} style={{ padding: "7px 12px", border: "1px solid #e2e8f0", fontSize: 13 }}>{c.trim()}</td>
            )}
          </tr>
        );
      }
      if (line.startsWith("|---") || line.startsWith("| --")) return null;
      if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} style={{ marginRight: 22, marginBottom: 4, color: "#374151", fontSize: 14 }}>{line.replace(/^[-*] /, "")}</li>;
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      return <p key={i} style={{ margin: "4px 0", color: "#374151", fontSize: 14, lineHeight: 1.7 }}>{line}</p>;
    });
  };

  return (
    <div>
      <Card>
        <SectionTitle>توليد التقرير الاحترافي</SectionTitle>
        <div style={{
          background: "linear-gradient(135deg, #0d3d62, #0ea5e9)", borderRadius: 12, padding: 20, color: "#fff", marginBottom: 20,
        }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>ملخص البيانات المدخلة</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 13 }}>
            <div>📁 <strong>المشروع:</strong> {data.projectName || "—"}</div>
            <div>🏛️ <strong>الجهة:</strong> {data.authority || "—"}</div>
            <div>👤 <strong>الاستشاري:</strong> {data.veConsultant || "—"}</div>
            <div>💰 <strong>التكلفة:</strong> {data.baseCost || "—"} ريال</div>
            <div>✅ <strong>تفادي التكاليف:</strong> {pct}%</div>
            <div>💡 <strong>الأفكار:</strong> {(data.ideas || []).length} | المقترحات: {(data.proposals || []).length}</div>
          </div>
        </div>
        {!report && (
          <button onClick={generateReport} disabled={loading} style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none",
            background: loading ? "#94a3b8" : "linear-gradient(135deg, #16a34a, #0ea5e9)",
            color: "#fff", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontSize: 16,
            boxShadow: "0 4px 20px #0d3d6230",
          }}>
            {loading ? "⏳ جارٍ توليد التقرير... يرجى الانتظار" : "🚀 توليد التقرير الاحترافي الكامل"}
          </button>
        )}
        {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 9, padding: 14, color: "#dc2626", marginTop: 14, fontWeight: 600 }}>{error}</div>}
      </Card>

      {report && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#0d3d62" }}>📄 التقرير المولَّد</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={copyReport} style={{
                padding: "9px 20px", borderRadius: 8, border: "1.5px solid #0d3d62",
                background: "#fff", color: "#0d3d62", fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}>📋 نسخ التقرير</button>
              <button onClick={() => { setReport(""); setError(""); }} style={{
                padding: "9px 20px", borderRadius: 8, border: "1.5px solid #dc2626",
                background: "#fff", color: "#dc2626", fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}>🔄 إعادة التوليد</button>
            </div>
          </div>
          <div ref={reportRef} style={{
            direction: "rtl", fontFamily: "inherit", lineHeight: 1.8,
            background: "#fafafa", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0",
            maxHeight: "70vh", overflowY: "auto",
          }}>
            {renderReport(report)}
          </div>
        </Card>
      )}
      <NavButtons onBack={onBack} onNext={() => { }} nextLabel="✅ انتهاء" />
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ValueEngineeringPlatform() {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    projectName: "", projectNo: "", authority: "", designConsultant: "",
    veConsultant: "", designPhase: "", workshopStart: "", workshopEnd: "",
    projectDesc: "", location: "", objectives: "",
    team: [{ name: "", org: "", role: "", spec: "", phone: "", email: "" }],
    baseCost: "", baseCostVat: "", costAvoidance: "", totalIdeas: "", developedIdeas: "",
    designConsiderations: "", rejectedIdeas: "",
    perfAttribs: Array(6).fill(null).map(() => ({ name: "", level: 7 })),
    functions: [{ element: "", func: "", type: "أساسية" }],
    priorityFunctions: "",
    ideas: [{ desc: "", rating: "A" }],
    proposals: [],
  });

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0f7ff 0%, #e8f4fd 50%, #f0fdf4 100%)",
      padding: "32px 20px",
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      direction: "rtl",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0d3d62 0%, #1a5a8c 60%, #0ea5e9 100%)",
          borderRadius: 18, padding: "28px 36px", marginBottom: 30, color: "#fff",
          boxShadow: "0 8px 40px #0d3d6240",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontSize: 52 }}>🏛️</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.5, marginBottom: 4 }}>
                منصة توليد تقارير الهندسة القيمية
              </div>
              <div style={{ fontSize: 14, opacity: 0.85, fontWeight: 500 }}>
                وفق معايير هيئة كفاءة الإنفاق والمشروعات الحكومية (EXPRO) | النموذج EPM-KEV-TP-000002
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar current={step} total={7} />

        {/* Steps */}
        {step === 1 && <Step1 data={projectData} setData={setProjectData} onNext={next} />}
        {step === 2 && <Step2 data={projectData} setData={setProjectData} onBack={back} onNext={next} />}
        {step === 3 && <Step3 data={projectData} setData={setProjectData} onBack={back} onNext={next} />}
        {step === 4 && <Step4 data={projectData} setData={setProjectData} onBack={back} onNext={next} />}
        {step === 5 && <Step5 data={projectData} setData={setProjectData} onBack={back} onNext={next} />}
        {step === 6 && <Step6 data={projectData} setData={setProjectData} onBack={back} onNext={next} />}
        {step === 7 && <Step7 data={projectData} onBack={back} />}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, color: "#94a3b8", fontSize: 12 }}>
          منصة مدعومة بالذكاء الاصطناعي · متوافقة مع نموذج EXPRO · رقم الوثيقة: EPM-KEV-TP-000002
        </div>
      </div>
    </div>
  );
}
