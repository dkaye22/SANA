import { useState, useEffect, useRef } from "react";

const D = {
  bg:"#080d1a", card:"#0f1629", card2:"#151f35",
  border:"#1a2640", border2:"#243352",
  blue:"#1d4ed8", blueMid:"#2563eb", blueGlow:"#3b82f6", blueSoft:"#172554",
  accent:"#38bdf8",
  text:"#f0f6ff", text2:"#8ba3c0", text3:"#3d5478",
  trainAc:"#38bdf8", eatAc:"#a78bfa", stackAc:"#2dd4bf", sleepAc:"#818cf8", socialAc:"#f472b6",
  socialBg:"#2d0a1f", socialBd:"#831843",
  green:"#10b981", greenBg:"#052e16", greenBd:"#065f46",
  amber:"#f59e0b", amberBg:"#451a03", amberBd:"#78350f",
  red:"#ef4444", redBg:"#450a0a",
  violet:"#a78bfa", violetBg:"#2e1065", violetBd:"#4c1d95",
  indigo:"#6366f1",
  r8:"8px", r12:"12px", r14:"14px", r20:"20px", r99:"99px",
};

// ─── WEARABLE CONFIG ───────────────────────────────────────────────
const WEARABLES = [
  { id:"apple_watch", name:"Apple Watch", icon:"⌚", color:"#e5e7eb", desc:"Heart rate, HRV, sleep, activity rings", status:"Popular", metrics:["HRV","Sleep","Heart rate","Steps","Active calories"] },
  { id:"oura",        name:"Oura Ring",   icon:"💍", color:"#a78bfa", desc:"Sleep stages, HRV, readiness score, temperature", status:"Best sleep data", metrics:["HRV","Sleep stages","Readiness","Temperature","SpO2"] },
  { id:"whoop",       name:"Whoop",       icon:"📿", color:"#10b981", desc:"Recovery score, strain, HRV, sleep coach", status:"Best recovery", metrics:["Recovery score","Strain","HRV","Sleep coach","Respiratory rate"] },
  { id:"garmin",      name:"Garmin",      icon:"🟢", color:"#34d399", desc:"Body battery, stress, VO2 max, sleep", status:"Best for athletes", metrics:["Body battery","VO2 max","HRV","Stress","Sleep"] },
  { id:"google_fit",  name:"Google Fit",  icon:"🔵", color:"#60a5fa", desc:"Steps, heart rate, sleep via Android", status:"Android", metrics:["Steps","Heart rate","Sleep","Calories"] },
  { id:"fitbit",      name:"Fitbit",      icon:"🔶", color:"#fb923c", desc:"Sleep score, HRV, stress management", status:"Beginner-friendly", metrics:["Sleep score","HRV","Stress","Steps","Calories"] },
  { id:"manual",      name:"No device",   icon:"✏️", color:"#94a3b8", desc:"Use daily check-in answers only — works great", status:"Default", metrics:["Energy","Stress","Soreness","Sleep hrs","Mood"] },
];

// ─── FULL DAILY PLANS (post check-in) ──────────────────────────────
function buildDailyPlans(checkinAns, userProfile, wearable) {
  const { energy, stress, soreness, sleep_hrs, mood } = checkinAns;
  const f      = userProfile.sex === "Female";
  const goal   = userProfile.goal || "muscle";
  const prot   = userProfile.prot || 190;
  const cal    = userProfile.cal  || 2450;
  const dur    = userProfile.dur  || 45;
  const lowR   = energy <= 2 || soreness >= 4 || sleep_hrs < 6;
  const hiS    = stress >= 4;
  const great  = energy >= 4 && soreness <= 2 && sleep_hrs >= 7.5;
  const hasHRV = wearable && wearable !== "manual";

  // ── TRAIN PLAN ──
  const trainExercises = (() => {
    if (lowR && hiS) return [
      { name:"20-min easy walk",              sets:"1",    reps:"20 min",  rest:"—",      note:"Outdoors preferred — sunlight + movement lower cortisol" },
      { name:"Hip flexor stretch",            sets:"3",    reps:"45s each",rest:"30s",    note:"Kneel, drive hips forward. Priority given current stress level." },
      { name:"Thoracic rotation",             sets:"2",    reps:"10 each", rest:"30s",    note:"Seated or lying. Breathe into each rotation." },
      { name:"Glute bridge",                  sets:"3",    reps:"15",      rest:"30s",    note:"Posterior chain without spinal loading." },
      { name:"4-7-8 breathing",               sets:"4",    reps:"1 round", rest:"—",      note:"Inhale 4 · hold 7 · exhale 8. Drops cortisol measurably." },
    ];
    if (lowR) return [
      { name:"Goblet squat",                  sets:"3",    reps:"10",      rest:"90s",    note:"Reduced from planned 4 sets — protecting recovery." },
      { name:"DB Romanian Deadlift",          sets:"3",    reps:"10",      rest:"90s",    note:"Light load — focus on feel, not weight today." },
      { name:"DB Row",                        sets:"3",    reps:"10",      rest:"90s",    note:"Moderate weight. Stop if soreness flares." },
      { name:"Plank",                         sets:"3",    reps:"30s",     rest:"45s",    note:"Core stability — no heavy loading today." },
      { name:"Calf raise",                    sets:"3",    reps:"15",      rest:"45s",    note:"Easy finisher." },
    ];
    if (great) return [
      { name:"Back Squat",                    sets:"4",    reps:"6–8",     rest:"3 min",  note:"Green day — go heavy. This is when you make progress." },
      { name:"Romanian Deadlift",             sets:"4",    reps:"8",       rest:"2 min",  note:"Full depth, controlled descent. Push the weight today." },
      { name:"DB Walking Lunge",              sets:"3",    reps:"10 each", rest:"90s",    note:"Unilateral work — reveals and fixes imbalances." },
      { name:"Leg Press",                     sets:"3",    reps:"12",      rest:"90s",    note:"Top set close to failure today." },
      { name:"Leg Curl",                      sets:"3",    reps:"12",      rest:"60s",    note:"Full range of motion — slow descent." },
      { name:"Calf Raise",                    sets:"4",    reps:"20",      rest:"45s",    note:"Heel below step. Full stretch at bottom." },
    ];
    return [
      { name:"Goblet Squat",                  sets:"4",    reps:"8–10",    rest:"2 min",  note:"Primary lower body — full depth." },
      { name:"Romanian Deadlift",             sets:"3",    reps:"10",      rest:"2 min",  note:"Hip push-back, not spine bend." },
      { name:"DB Walking Lunge",              sets:"3",    reps:"10 each", rest:"90s",    note:"Torso upright throughout." },
      { name:"Leg Curl",                      sets:"3",    reps:"12",      rest:"60s",    note:"Full range of motion." },
      { name:"Glute Bridge",                  sets:"3",    reps:"15",      rest:"45s",    note:"Squeeze glutes hard at top." },
      { name:"Plank",                         sets:"3",    reps:"40s",     rest:"45s",    note:"Body rigid — brace like you'll be hit." },
    ];
  })();

  const trainSession = lowR && hiS ? "Active recovery" : lowR ? "Reduced intensity" : great ? "Full — push today" : "Standard session";
  const trainNote    = lowR && hiS
    ? `Session swapped to active recovery. ${hasHRV ? `Your ${WEARABLES.find(w=>w.id===wearable)?.name} HRV data confirms your nervous system is under load.` : "Energy and stress signals indicate your nervous system is under load."} Rest today, stronger tomorrow.`
    : lowR
    ? `Intensity reduced based on your check-in. ${dur === 45 ? "Target 35 min" : "Target 45 min"} — loads are dialled back but you're still training.`
    : great
    ? `Green day. ${hasHRV ? `${WEARABLES.find(w=>w.id===wearable)?.name} confirms strong recovery.` : "All signals are aligned."} Full session at full intensity — this is when progress happens fastest.`
    : `Standard session. Adjust intensity based on how the warm-up feels.`;

  // ── NUTRITION PLAN ──
  const calToday    = hiS ? Math.round(cal * 0.97) : great ? cal : cal;
  const protToday   = prot;
  const carbNote    = great ? "Training day — keep carbs high to fuel the session." : hiS ? "High stress day — prioritise complex carbs and avoid blood sugar spikes." : lowR ? "Recovery day — carbs slightly lower, protein stays the same." : "Balanced day — follow plan as normal.";
  const meals = [
    { time:"Breakfast · 7–9 AM",  cal:Math.round(calToday*0.25), prot:Math.round(protToday*0.26), items: f
        ? ["Greek yogurt (200g) + berries + walnuts — 32g protein","2 eggs scrambled — 14g protein"]
        : ["3 eggs scrambled + feta on wholegrain toast — 32g protein","Greek yogurt (200g) + mixed berries — 14g protein"] },
    { time:"Lunch · 12–1 PM",     cal:Math.round(calToday*0.31), prot:Math.round(protToday*0.33), items: goal==="muscle"
        ? ["Chicken rice bowl — black beans, avocado, pico de gallo — 45g protein","Protein shake if needed — 25g protein"]
        : ["Salmon fillet + brown rice + roasted veg — 42g protein","Side salad with olive oil"] },
    { time:"Snack · 3:30 PM",     cal:Math.round(calToday*0.12), prot:Math.round(protToday*0.10), items:["Cottage cheese (150g) + fruit — 18g protein","Or: protein bar if pressed for time"] },
    { time:"Dinner · 7 PM",       cal:Math.round(calToday*0.32), prot:Math.round(protToday*0.31), items: great
        ? ["Salmon fillet + sweet potato + asparagus — 44g protein","Quinoa ½ cup — 8g protein"]
        : ["Chicken thighs + roasted vegetables + brown rice — 42g protein","Side of leafy greens with olive oil"] },
  ];
  const nutritionNote = hiS
    ? "Avoid caffeine after 1 PM today. Add magnesium-rich foods (leafy greens, pumpkin seeds). Anti-inflammatory fats (salmon, walnuts, avocado) are particularly beneficial under elevated stress."
    : lowR
    ? "Keep protein high to preserve muscle during reduced training. Add complex carbs for sustained energy. Avoid alcohol tonight — recovery is the priority."
    : great
    ? "Training day nutrition — carbs are your friend today. Eat the larger meals. Don't undereat on green days."
    : "Follow the plan as normal. Protein spread across 4 meals hits your target without any single meal being a chore.";

  // ── SUPPLEMENT PLAN ──
  const suppSchedule = [
    { time:"With breakfast",    items: hiS
        ? ["Ashwagandha KSM-66 · 600mg — cortisol is elevated, this is what it's for","Vitamin D3 · 2,000 IU — fat-soluble, absorbed best with food"]
        : ["Vitamin D3 · 2,000 IU — fat-soluble, take with food"] },
    { time:"Post-workout or midday", items: goal==="muscle" || goal==="performance"
        ? ["Creatine monohydrate · 5g — any time, consistency matters more than timing"]
        : [] },
    { time:"Before bed · 9:30 PM", items: sleep_hrs < 7
        ? ["Magnesium glycinate · 300mg — tonight especially important, take earlier than usual (9:00 PM)"]
        : ["Magnesium glycinate · 300mg — 60–90 min before bed"] },
  ].filter(s => s.items.length > 0);

  const suppNote = hiS
    ? "Ashwagandha is your most important supplement today — elevated cortisol is the primary threat to your goal right now."
    : sleep_hrs < 6.5
    ? "Move magnesium to 9:00 PM tonight — you need an earlier start on the wind-down given last night's sleep."
    : "Supplements as scheduled. Consistency this week is already showing in your recovery markers.";

  // ── SLEEP PLAN ──
  const sleepTarget = hiS || sleep_hrs < 6 ? 8.5 : 7.5;
  const bedtime     = sleep_hrs < 6 ? "9:45 PM" : "10:30 PM";
  const winddown = [
    { time:"9:00 PM", action:"Dim all lights and put phone face-down", note:"Blue light suppresses melatonin — start 90 min before bed tonight" },
    { time:"9:30 PM", action:"Magnesium glycinate 300mg", note:sleep_hrs < 6 ? "Earlier than usual — you need the extra sleep onset support" : "60–90 min before bed is the optimal window" },
    { time:"9:45 PM", action:"10 min light stretching or 4-7-8 breathing", note:"Activates parasympathetic system — your 'rest and digest' state" },
    { time:"10:15 PM", action:"Cool room to 65–68°F / 18–20°C", note:"Core temperature must drop to initiate sleep — a cool room accelerates this" },
    { time:bedtime,    action:"Lights out", note:`Target ${sleepTarget} hrs · wake ${bedtime === "9:45 PM" ? "6:15 AM" : "6:00 AM"}` },
  ];
  const sleepNote = sleep_hrs < 6
    ? "Last night left a significant deficit. Tonight is the single highest-leverage thing you can do for tomorrow. The wind-down starts earlier — follow it closely."
    : hiS
    ? "High stress keeps the nervous system in sympathetic overdrive at bedtime. The wind-down protocol is especially important tonight — it's not optional when cortisol is elevated."
    : sleep_hrs >= 7.5
    ? "Good sleep last night. Keep the same bedtime tonight — consistency matters more than any single good night."
    : "Close to target. One more consistent night moves you into the range where recovery compounds.";

  // ── SOCIAL RECOVERY PLAN ──
  const socialLevel = checkinAns.social || "none";
  const socialLabels = { none:"Quiet night", light:"Light social", moderate:"Night out", heavy:"Big night" };
  const socialBadge  = socialLabels[socialLevel] || "Quiet night";

  const socialHydration = {
    none:     ["Drink 500ml water first thing — keeps everything running well today"],
    light:    ["Add one extra glass of water or coconut water this morning","Even 1–2 drinks nudge dehydration — a small top-up helps"],
    moderate: ["500ml water + electrolytes within 30 min of waking — this is step one","Coconut water or an electrolyte tablet works better than plain water right now","Keep sipping through the morning — aim for 2L by noon"],
    heavy:    ["1 litre of water + electrolytes as soon as you wake — before coffee, before anything","Sip steadily — don't chug, your stomach lining needs gentleness right now","Target 3L total today. Your kidneys worked overtime last night."],
  }[socialLevel];

  const socialFood = {
    none:     [],
    light:    ["Eggs this morning — cysteine in eggs helps clear residual acetaldehyde","Banana for potassium — even light alcohol depletes electrolytes"],
    moderate: ["Eggs first — cysteine is the most effective natural recovery food","Banana + avocado for potassium and healthy fats to stabilise blood sugar","Ginger tea if your stomach is unsettled — genuinely reduces nausea","Lunch: salmon or chicken with rice restores glycogen and amino acids efficiently"],
    heavy:    ["Start with bland carbs — toast or plain oats, let your stomach settle for 20 min","Then eggs within an hour — cysteine directly neutralises acetaldehyde, the main toxic byproduct","Banana + avocado — potassium and magnesium were heavily depleted","Avoid greasy food (it's a myth). Protein + complex carbs are what actually help.","Bone broth if available — collagen, electrolytes, and easy on the gut"],
  }[socialLevel];

  const socialSupps = {
    none:     [],
    light:    ["Vitamin C · 500mg — light antioxidant support, minor but helpful"],
    moderate: ["B-complex · 1 tablet — alcohol depletes B1, B6, B12 directly","Vitamin C · 1g — supports liver detox pathways","Magnesium glycinate · 200mg this morning — alcohol suppresses magnesium absorption"],
    heavy:    ["B-complex · 1 tablet — take immediately, B vitamins are the first thing depleted","NAC (N-Acetylcysteine) · 600mg — boosts glutathione, the liver's primary detox molecule","Vitamin C · 1g — antioxidant support while your body is still processing","Electrolyte tablet or powder — sodium, potassium, magnesium all need replenishing","Skip creatine today — your kidneys are already working hard"],
  }[socialLevel];

  const socialTrain = {
    none:     "Proceed as planned — you're in great shape for today's session.",
    light:    "Proceed as planned. One or two drinks don't meaningfully affect performance.",
    moderate: "Reduce session intensity by ~20%. Skip max-effort sets. A solid moderate session today is smarter than a hard one — your cortisol is already elevated.",
    heavy:    "Rest day or a gentle 20-min walk only. Training hard when acutely hungover spikes cortisol significantly and increases muscle damage — it's counterproductive. Rest today, attack tomorrow.",
  }[socialLevel];

  const socialSleep = {
    none:     "Normal sleep routine tonight. You're set up well.",
    light:    "Stick to your usual bedtime. Even light alcohol can fragment REM — keep the wind-down protocol tonight.",
    moderate: "Prioritise an earlier bedtime tonight — aim for 9:30 PM. Alcohol suppresses REM significantly. Tonight is where you actually recover from last night.",
    heavy:    "Early bed is non-negotiable tonight — 9:00 PM, aim for 9+ hours. Last night's sleep was largely non-restorative even if it felt deep. Tonight is where real recovery happens.",
  }[socialLevel];

  const socialNote = {
    none:     "You gave your body space to rest. Stack that with a good day today and you're in a great position.",
    light:    "You kept it social and balanced — that's exactly right. You're not in recovery mode; just minor optimization today.",
    moderate: "You had a good night. The goal today isn't damage control — it's systematic recovery so you're back at full capacity tomorrow. Follow the hydration and food steps and you'll feel noticeably better by the afternoon.",
    heavy:    "Big night — it happens. The difference between people who bounce back well and those who don't is having a system. Hydration and B vitamins first, food within the hour, rest today, early bed tonight. You'll feel meaningfully better by 3 PM.",
  }[socialLevel];

  const socialPlan = { socialLevel, socialBadge, socialHydration, socialFood, socialSupps, socialTrain, socialSleep, socialNote };

  return { trainSession, trainNote, trainExercises, calToday, protToday, carbNote, meals, nutritionNote, suppSchedule, suppNote, sleepTarget, bedtime, winddown, sleepNote, lowR, hiS, great, socialPlan };
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────
const Pill=({label,bg,color,size=10})=><span style={{fontSize:size,fontWeight:500,padding:"2px 9px",borderRadius:D.r99,background:bg,color,display:"inline-block"}}>{label}</span>;
const SLabel=({c,mt=0,mb=8})=><div style={{fontSize:9,fontWeight:500,color:D.text3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:mb,marginTop:mt}}>{c}</div>;
const Card=({children,style={}})=><div style={{background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r14,padding:"13px 15px",marginBottom:9,...style}}>{children}</div>;

function ChkItem({label,sub,done:init=false,accent=D.accent}){
  const[d,setD]=useState(init);
  return(
    <div onClick={()=>setD(!d)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 13px",background:d?`${accent}10`:D.card,border:`1.5px solid ${d?accent:D.border}`,borderRadius:D.r12,cursor:"pointer",marginBottom:7,transition:"all .15s"}}>
      <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${d?accent:D.border}`,background:d?accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
        {d&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <div><div style={{fontSize:13,fontWeight:500,color:d?D.text3:D.text,textDecoration:d?"line-through":"none"}}>{label}</div>{sub&&<div style={{fontSize:11,color:D.text3,marginTop:2,lineHeight:1.4}}>{sub}</div>}</div>
    </div>
  );
}

function ExpandSection({icon,label,accent,badge,children}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r14,marginBottom:9,overflow:"hidden",transition:"all .2s"}}>
      <div onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",cursor:"pointer"}}>
        <div style={{width:34,height:34,borderRadius:D.r8,background:`${accent}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:500,color:D.text}}>{label}</div>
          {badge&&<div style={{fontSize:10,color:accent,marginTop:2}}>{badge}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:accent}}/>
          <span style={{fontSize:14,color:D.text3,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>›</span>
        </div>
      </div>
      {open&&<div style={{borderTop:`0.5px solid ${D.border}`,padding:"13px 15px"}}>{children}</div>}
    </div>
  );
}

// ─── WEARABLE SYNC SCREEN ─────────────────────────────────────────
function WearableScreen({connected,onConnect,onBack}){
  const[connecting,setConnecting]=useState(null);
  const[justConnected,setJustConnected]=useState(null);

  const connect=(id)=>{
    setConnecting(id);
    setTimeout(()=>{
      setConnecting(null);
      setJustConnected(id);
      setTimeout(()=>{ onConnect(id); },1200);
    },1800);
  };

  return(
    <div style={{background:D.bg,minHeight:580,paddingBottom:24}}>
      <div style={{padding:"20px 20px 14px",borderBottom:`0.5px solid ${D.border}`}}>
        <button onClick={onBack} style={{fontSize:12,color:D.text2,background:"none",border:"none",cursor:"pointer",padding:0,marginBottom:10,display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:14}}>←</span> Back
        </button>
        <div style={{fontSize:9,fontWeight:500,color:D.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Wearable sync</div>
        <div style={{fontSize:20,fontWeight:500,color:D.text,letterSpacing:"-0.3px"}}>Connect your device</div>
        <div style={{fontSize:12,color:D.text2,marginTop:3,lineHeight:1.6}}>Sana reads HRV, sleep stages, and recovery data to adapt your plan automatically — before you even open the app.</div>
      </div>

      <div style={{padding:"14px 20px"}}>
        {connected&&connected!=="manual"&&(
          <div style={{background:D.greenBg,border:`0.5px solid ${D.greenBd}`,borderRadius:D.r12,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:20}}>{WEARABLES.find(w=>w.id===connected)?.icon}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:D.green}}>Connected — {WEARABLES.find(w=>w.id===connected)?.name}</div>
              <div style={{fontSize:11,color:D.text2,marginTop:1}}>Syncing {WEARABLES.find(w=>w.id===connected)?.metrics?.slice(0,3).join(", ")}</div>
            </div>
          </div>
        )}

        <div style={{padding:"10px 13px",background:D.blueSoft,border:`0.5px solid ${D.border2}`,borderRadius:D.r12,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:500,color:D.accent,marginBottom:4}}>What Sana does with your data</div>
          <div style={{fontSize:11,color:D.text2,lineHeight:1.6}}>When HRV drops 10%+ below your baseline, Sana quietly swaps your strength session for recovery before you open the app. Sleep stages inform your energy targets. Temperature trends flag illness before symptoms appear.</div>
        </div>

        {WEARABLES.map(w=>{
          const isConnected=connected===w.id;
          const isConnecting=connecting===w.id;
          const wasJustConnected=justConnected===w.id;
          return(
            <div key={w.id} style={{background:isConnected?D.greenBg:D.card,border:`0.5px solid ${isConnected?D.greenBd:D.border}`,borderRadius:D.r14,padding:"14px 15px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{fontSize:24,flexShrink:0,width:36,textAlign:"center"}}>{w.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <div style={{fontSize:13,fontWeight:500,color:isConnected?D.green:D.text}}>{w.name}</div>
                    <Pill label={isConnected?"Connected ✓":w.status} bg={isConnected?D.greenBg:`${D.accent}15`} color={isConnected?D.green:D.accent}/>
                  </div>
                  <div style={{fontSize:11,color:D.text2,marginBottom:8,lineHeight:1.45}}>{w.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                    {w.metrics.map(m=><span key={m} style={{fontSize:9,padding:"2px 7px",borderRadius:D.r99,background:`${D.accent}12`,color:D.accent,border:`0.5px solid ${D.border2}`}}>{m}</span>)}
                  </div>
                  {w.id!=="manual"&&(
                    <button
                      onClick={()=>!isConnected&&!isConnecting&&connect(w.id)}
                      style={{padding:"8px 14px",fontSize:12,fontWeight:500,borderRadius:D.r12,background:isConnected?"transparent":isConnecting?D.blueSoft:D.blue,color:isConnected?D.green:D.text,border:isConnected?`0.5px solid ${D.greenBd}`:"none",cursor:isConnected?"default":"pointer",minWidth:100}}
                    >
                      {isConnected?"Connected ✓":isConnecting?"Connecting...":wasJustConnected?"Connected!":"Connect"}
                    </button>
                  )}
                  {w.id==="manual"&&<div style={{fontSize:11,color:D.text3}}>Active by default · check-in data only</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── POST CHECK-IN FULL PLAN ───────────────────────────────────────
function PostCheckinPlan({checkinAns,userProfile,wearable,onDone}){
  const plans=buildDailyPlans(checkinAns,userProfile,wearable);
  const sc={
    rest:    {dot:D.amber, bg:D.amberBg, bd:D.amberBd, label:"Rest day"},
    warning: {dot:"#f97316",bg:"#1c1917",bd:"#44403c",  label:"Light day"},
    info:    {dot:D.accent, bg:D.card,   bd:D.border,   label:"Standard"},
    success: {dot:D.green,  bg:D.greenBg,bd:D.greenBd,  label:"Green day"},
  }[plans.lowR&&plans.hiS?"rest":plans.lowR?"warning":plans.great?"success":"info"];

  const f=userProfile.sex==="Female";
  const name=userProfile.name||"there";

  const bodySignal=plans.lowR&&plans.hiS
    ? f?`${name}, your nervous system needs space today. Cortisol is elevated — restoration, not effort.`:`${name}, your body hasn't finished recovering. Rest today means a stronger session tomorrow.`
    : plans.lowR
    ? `${name}, ${checkinAns.soreness>=4?"muscle damage is still resolving":"sleep was below target"}. Lighter work today, stronger work tomorrow.`
    : plans.great
    ? `${name}, everything is aligned today. ${f?"Energy, hormones, and recovery are all working with you — make this count.":"HRV is strong, soreness is low, sleep was solid. Green day — don't hold back."}`
    : `${name}, solid day. Show up and do the work.`;

  const moodMsg={1:f?"Hard days happen. Sana's job today is protection, not pressure.":"It's okay to have a hard day. Small inputs compound.",2:"Not your best day — the consistent days are the ones that build the most.",3:"Steady. Showing up at 70% still builds the habit.",4:"Good energy. Body and mind aligned.",5:"You're in the zone. Use it."}[checkinAns.mood]||"";

  return(
    <div style={{background:D.bg,paddingBottom:28}}>
      {/* Header */}
      <div style={{padding:"20px 20px 14px",borderBottom:`0.5px solid ${D.border}`}}>
        <div style={{fontSize:9,fontWeight:500,color:D.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Check-in complete · plan updated</div>
        <div style={{fontSize:20,fontWeight:500,color:D.text,letterSpacing:"-0.3px"}}>Today's full plan</div>
        <div style={{fontSize:12,color:D.text2,marginTop:2}}>{new Date().toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</div>
      </div>

      <div style={{padding:"14px 20px"}}>

        {/* Body signal */}
        <div style={{background:sc.bg,border:`0.5px solid ${sc.bd}`,borderRadius:D.r14,padding:"14px 16px",marginBottom:14}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:sc.dot}}/>
            <Pill label={sc.label} bg={`${sc.dot}20`} color={sc.dot}/>
            {wearable&&wearable!=="manual"&&<Pill label={`via ${WEARABLES.find(w=>w.id===wearable)?.name}`} bg={D.blueSoft} color={D.accent}/>}
          </div>
          <div style={{fontSize:14,fontWeight:500,color:D.text,lineHeight:1.4,marginBottom:5}}>{bodySignal}</div>
          <div style={{fontSize:12,color:D.text2,lineHeight:1.6}}>{moodMsg}</div>
        </div>

        {/* Signals summary */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[
            {l:"Energy",  v:`${checkinAns.energy}/5`,    c:checkinAns.energy>=3?D.green:D.amber},
            {l:"Stress",  v:`${checkinAns.stress}/5`,    c:checkinAns.stress<=2?D.green:checkinAns.stress>=4?D.red:D.amber},
            {l:"Soreness",v:`${checkinAns.soreness}/5`,  c:checkinAns.soreness<=2?D.green:D.amber},
            {l:"Sleep",   v:`${checkinAns.sleep_hrs}h`,  c:checkinAns.sleep_hrs>=7.5?D.green:checkinAns.sleep_hrs>=6?D.amber:D.red},
          ].map(m=>(
            <div key={m.l} style={{background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r12,padding:"11px 12px"}}>
              <div style={{fontSize:10,color:D.text3,marginBottom:4}}>{m.l}</div>
              <div style={{fontSize:18,fontWeight:500,color:m.c}}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* ── TRAIN ── */}
        <ExpandSection icon="💪" label="Train" accent={D.trainAc} badge={`${plans.trainSession} · tap to see full workout`}>
          <div style={{padding:"8px 10px",background:`${D.trainAc}12`,border:`0.5px solid ${D.trainAc}30`,borderRadius:D.r8,marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:500,color:D.trainAc,marginBottom:3}}>{plans.trainSession}</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.6}}>{plans.trainNote}</div>
          </div>
          {plans.trainExercises.length>0&&(
            <>
              <SLabel c="Exercises — tap when done" mb={8}/>
              {plans.trainExercises.map((ex,i)=>(
                <div key={i} style={{marginBottom:8}}>
                  <ChkItem
                    label={ex.name}
                    sub={`${ex.sets} sets × ${ex.reps} · Rest: ${ex.rest} · ${ex.note}`}
                    accent={D.trainAc}
                  />
                </div>
              ))}
            </>
          )}
          <div style={{marginTop:8,padding:"9px 11px",background:D.blueSoft,border:`0.5px solid ${D.border2}`,borderRadius:D.r8}}>
            <div style={{fontSize:10,fontWeight:500,color:D.accent,marginBottom:3}}>The science</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.55}}>
              {plans.lowR&&plans.hiS?"Cortisol rises sharply when you train hard under accumulated stress — lighter work protects the adaptation from your last session.":plans.great?"High energy + low soreness + good sleep = maximum anabolic environment. Don't waste it.":"Consistent work at moderate intensity compounds over weeks. Today's session matters."}
            </div>
            <div style={{fontSize:10,color:D.text3,marginTop:3}}>Cadegiani & Kater, 2017 · Schoenfeld, 2010</div>
          </div>
        </ExpandSection>

        {/* ── EAT ── */}
        <ExpandSection icon="🥗" label="Eat" accent={D.eatAc} badge={`${plans.calToday} kcal · ${plans.protToday}g protein · tap to see meals`}>
          <div style={{marginBottom:12}}>
            {[
              {l:"Calories", v:`${plans.calToday} kcal`, c:D.eatAc},
              {l:"Protein",  v:`${plans.protToday}g`,    c:D.trainAc},
              {l:"Note",     v:plans.carbNote,            c:D.text2, full:true},
            ].map(m=>(
              <div key={m.l} style={{display:"flex",justifyContent:"space-between",alignItems:m.full?"flex-start":"center",padding:"7px 0",borderBottom:`0.5px solid ${D.border}`}}>
                <div style={{fontSize:11,color:D.text3,flexShrink:0,marginRight:12}}>{m.l}</div>
                <div style={{fontSize:m.full?11:13,fontWeight:m.full?400:500,color:m.c,textAlign:"right",lineHeight:1.5}}>{m.v}</div>
              </div>
            ))}
          </div>
          <SLabel c="Today's meals" mb={8}/>
          {plans.meals.map((meal,i)=>(
            <div key={i} style={{background:D.card2,border:`0.5px solid ${D.border2}`,borderRadius:D.r12,padding:"11px 13px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{fontSize:12,fontWeight:500,color:D.text}}>{meal.time}</div>
                <div style={{display:"flex",gap:6}}>
                  <Pill label={`${meal.cal} kcal`} bg={D.border} color={D.text2}/>
                  <Pill label={`${meal.prot}g P`}  bg={`${D.eatAc}15`} color={D.eatAc}/>
                </div>
              </div>
              {meal.items.map((item,j)=>(
                <div key={j} style={{fontSize:11,color:D.text2,lineHeight:1.5,padding:"3px 0",borderTop:j>0?`0.5px solid ${D.border}`:"none"}}>{item}</div>
              ))}
            </div>
          ))}
          <div style={{padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8,fontSize:11,color:D.text2,lineHeight:1.6}}>{plans.nutritionNote}</div>
        </ExpandSection>

        {/* ── STACK ── */}
        <ExpandSection icon="💊" label="Stack" accent={D.stackAc} badge="Timing adjusted to today's signals — tap to see">
          <div style={{marginBottom:10,padding:"9px 11px",background:`${D.stackAc}10`,border:`0.5px solid ${D.stackAc}30`,borderRadius:D.r8,fontSize:11,color:D.text2,lineHeight:1.6}}>{plans.suppNote}</div>
          {plans.suppSchedule.map((slot,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <SLabel c={slot.time} mb={6}/>
              {slot.items.map((item,j)=><ChkItem key={j} label={item} accent={D.stackAc}/>)}
            </div>
          ))}
          <div style={{padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8,fontSize:10,color:D.text3,lineHeight:1.55}}>Wellness suggestions based on your data — not medical advice. Consult a doctor if you take medication.</div>
        </ExpandSection>

        {/* ── SLEEP ── */}
        <ExpandSection icon="🌙" label="Sleep" accent={D.sleepAc} badge={`Target ${plans.sleepTarget} hrs · lights out ${plans.bedtime} · tap to see`}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["Bedtime",plans.bedtime],["Wake","6:00 AM"],["Target",`${plans.sleepTarget} hrs`]].map(([l,v])=>(
              <div key={l} style={{background:D.card2,border:`0.5px solid ${D.border2}`,borderRadius:D.r8,padding:"10px",textAlign:"center"}}>
                <div style={{fontSize:16,fontWeight:500,color:D.sleepAc}}>{v}</div>
                <div style={{fontSize:9,color:D.text3,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:12,padding:"9px 11px",background:`${D.sleepAc}10`,border:`0.5px solid ${D.sleepAc}30`,borderRadius:D.r8,fontSize:11,color:D.text2,lineHeight:1.6}}>{plans.sleepNote}</div>
          <SLabel c="Wind-down protocol — tap when done" mb={8}/>
          {plans.winddown.map((step,i)=>(
            <ChkItem key={i} label={`${step.time} · ${step.action}`} sub={step.note} accent={D.sleepAc}/>
          ))}
          <div style={{marginTop:8,padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8}}>
            <div style={{fontSize:10,fontWeight:500,color:D.sleepAc,marginBottom:3}}>Why tonight matters</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.55}}>70% of daily growth hormone is released during slow-wave sleep. {f?"For women, sleep quality directly regulates oestrogen and progesterone.":"Under 7 hrs, testosterone drops 10–15% — directly opposing your muscle goal."}</div>
            <div style={{fontSize:10,color:D.text3,marginTop:3}}>Van Cauter et al., 2000 · {f?"Mong et al., 2011":"Leproult & Van Cauter, JAMA 2011"}</div>
          </div>
        </ExpandSection>

        {/* ── SOCIAL ── */}
        <ExpandSection icon="🎉" label="Social" accent={D.socialAc} badge={`${plans.socialPlan.socialBadge} · tap to see recovery plan`}>
          <div style={{marginBottom:12,padding:"9px 11px",background:`${D.socialAc}10`,border:`0.5px solid ${D.socialAc}30`,borderRadius:D.r8,fontSize:11,color:D.text2,lineHeight:1.6}}>{plans.socialPlan.socialNote}</div>

          {plans.socialPlan.socialHydration.length>0&&(
            <>
              <SLabel c="Hydration" mb={6}/>
              {plans.socialPlan.socialHydration.map((item,i)=><ChkItem key={i} label={item} accent={D.socialAc}/>)}
            </>
          )}

          {plans.socialPlan.socialFood.length>0&&(
            <>
              <SLabel c="Food for recovery" mb={6} mt={10}/>
              {plans.socialPlan.socialFood.map((item,i)=><ChkItem key={i} label={item} accent={D.socialAc}/>)}
            </>
          )}

          {plans.socialPlan.socialSupps.length>0&&(
            <>
              <SLabel c="Supplements" mb={6} mt={10}/>
              {plans.socialPlan.socialSupps.map((item,i)=><ChkItem key={i} label={item} accent={D.socialAc}/>)}
            </>
          )}

          <div style={{marginTop:10,padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8}}>
            <div style={{fontSize:10,fontWeight:500,color:D.socialAc,marginBottom:3}}>Training today</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.55}}>{plans.socialPlan.socialTrain}</div>
          </div>

          <div style={{marginTop:8,padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8}}>
            <div style={{fontSize:10,fontWeight:500,color:D.socialAc,marginBottom:3}}>Tonight's sleep</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.55}}>{plans.socialPlan.socialSleep}</div>
          </div>

          <div style={{marginTop:8,padding:"9px 11px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r8}}>
            <div style={{fontSize:10,fontWeight:500,color:D.socialAc,marginBottom:3}}>The science</div>
            <div style={{fontSize:11,color:D.text2,lineHeight:1.55}}>
              {plans.socialPlan.socialLevel==="heavy"
                ?"Alcohol metabolises into acetaldehyde — more toxic than alcohol itself. NAC and cysteine (eggs) accelerate its clearance via glutathione. B vitamins are cofactors in this pathway."
                :plans.socialPlan.socialLevel==="moderate"
                ?"Moderate alcohol suppresses REM sleep by up to 25% and elevates cortisol the next morning. Hydration and B-complex are the highest-leverage recovery steps."
                :"Social connection and occasional enjoyment are independently linked to lower all-cause mortality. Balance is not a weakness in your plan — it's part of it."}
            </div>
            <div style={{fontSize:10,color:D.text3,marginTop:3}}>
              {plans.socialPlan.socialLevel==="heavy"||plans.socialPlan.socialLevel==="moderate"
                ?"Lieber, 2005 · Yules et al., 1967 · Penning et al., 2012"
                :"Holt-Lunstad et al., 2010 · Umberson & Montez, 2010"}
            </div>
          </div>
        </ExpandSection>

        {/* Why anchor */}
        <div style={{padding:"12px 14px",background:D.blueSoft,border:`0.5px solid ${D.border2}`,borderRadius:D.r12,marginBottom:14,borderLeft:`2px solid ${D.accent}`}}>
          <div style={{fontSize:9,fontWeight:500,color:D.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Your why</div>
          <div style={{fontSize:12,color:D.text2,lineHeight:1.7}}>You're building toward something real. This day counts — even if it doesn't feel like it right now. Keep going.</div>
        </div>

        <button onClick={onDone} style={{width:"100%",padding:"13px",fontSize:14,fontWeight:500,borderRadius:D.r12,background:D.blue,color:"#fff",border:"none",cursor:"pointer"}}>Back to dashboard →</button>
      </div>
    </div>
  );
}

// ─── CHECK-IN FLOW ─────────────────────────────────────────────────
function CheckInFlow({userProfile,wearable,onComplete,onBack}){
  const[step,setStep]=useState(0);
  const[ans,setAns]=useState({});
  const[showPlan,setShowPlan]=useState(false);
  const f=userProfile.sex==="Female";
  const name=userProfile.name||"there";

  const qs=[
    {k:"energy",  label:`How's your energy this morning, ${name}?`,  type:"scale",labels:["Exhausted","Low","Okay","Good","Strong"],    icons:["😫","😔","😐","🙂","⚡"]},
    {k:"stress",  label:"How stressed are you right now?",            type:"scale",sub:f?"Stress hits your hormones differently — this changes your plan":"This changes how Sana approaches your session and recovery", labels:["Calm","Mild","Moderate","High","Overwhelmed"],icons:["😌","🙂","😤","😰","🔥"]},
    {k:"soreness",label:"How sore are your muscles?",                 type:"scale",labels:["None","Light","Moderate","Significant","Very sore"],icons:["✅","🟢","🟡","🟠","🔴"]},
    {k:"sleep_hrs",label:"How many hours did you sleep last night?", type:"sleep"},
    {k:"social",  label:"How was last night?",                        type:"social",sub:"No judgment — this shapes your social recovery plan for today"},
    {k:"mood",    label:"And how's your mood?",                       type:"scale",sub:"Not energy, not stress — just how you feel inside right now",labels:["Low","Down","Neutral","Good","Great"],icons:["💙","😕","😐","😊","🌟"]},
  ];

  const handleAns=(v)=>{
    const na={...ans,[qs[step].k]:v};
    setAns(na);
    if(step<qs.length-1) setStep(s=>s+1);
    else setShowPlan(true);
  };

  if(showPlan) return <PostCheckinPlan checkinAns={ans} userProfile={userProfile} wearable={wearable} onDone={onComplete}/>;

  const q=qs[step];
  const pct=Math.round((step/qs.length)*100);

  return(
    <div style={{background:D.bg,minHeight:580}}>
      <div style={{height:2,background:D.border}}><div style={{height:"100%",width:`${pct}%`,background:D.accent,transition:"width .4s"}}/></div>
      <div style={{padding:"14px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:9,fontWeight:500,color:D.accent,letterSpacing:"0.1em",textTransform:"uppercase"}}>Morning check-in · {step+1}/{qs.length}</div>
        {step>0?<button onClick={()=>setStep(s=>s-1)} style={{fontSize:12,color:D.text2,background:"none",border:"none",cursor:"pointer"}}>← Back</button>
        :<button onClick={onBack} style={{fontSize:12,color:D.text2,background:"none",border:"none",cursor:"pointer"}}>Cancel</button>}
      </div>

      {wearable&&wearable!=="manual"&&(
        <div style={{margin:"10px 20px 0",padding:"8px 12px",background:D.blueSoft,border:`0.5px solid ${D.border2}`,borderRadius:D.r8,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14}}>{WEARABLES.find(w=>w.id===wearable)?.icon}</span>
          <div style={{fontSize:11,color:D.accent}}>{WEARABLES.find(w=>w.id===wearable)?.name} data is being read alongside your answers</div>
        </div>
      )}

      <div style={{padding:"16px 20px"}}>
        {/* Sana bubble */}
        <div style={{position:"relative",marginLeft:38,marginBottom:16}}>
          <div style={{position:"absolute",left:-38,top:0,width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${D.blueMid},${D.indigo})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:"#fff"}}>S</div>
          <div style={{background:D.card,border:`0.5px solid ${D.border2}`,borderRadius:"0 13px 13px 13px",padding:"12px 14px"}}>
            <div style={{fontSize:14,fontWeight:500,color:D.text,lineHeight:1.45,marginBottom:q.sub?5:0}}>{q.label}</div>
            {q.sub&&<div style={{fontSize:12,color:D.text2,lineHeight:1.55}}>{q.sub}</div>}
          </div>
        </div>

        {q.type==="scale"&&q.labels.map((l,i)=>(
          <div key={i} onClick={()=>handleAns(i+1)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r12,cursor:"pointer",marginBottom:8,transition:"all .12s"}}>
            <span style={{fontSize:20,width:28,textAlign:"center",flexShrink:0}}>{q.icons[i]}</span>
            <div style={{flex:1,fontSize:13,fontWeight:500,color:D.text}}>{l}</div>
            <div style={{fontSize:12,color:D.text3}}>{i+1}/5</div>
          </div>
        ))}

        {q.type==="sleep"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5].map(h=>(
              <div key={h} onClick={()=>handleAns(h)} style={{padding:"13px 8px",background:D.card,border:`0.5px solid ${h>=7.5?D.greenBd:h>=6?D.border:D.amberBd}`,borderRadius:D.r12,cursor:"pointer",textAlign:"center",transition:"all .12s"}}>
                <div style={{fontSize:16,fontWeight:500,color:h>=7.5?D.green:h>=6?D.text:D.amber}}>{h}</div>
                <div style={{fontSize:9,color:D.text3,marginTop:2}}>hrs</div>
              </div>
            ))}
          </div>
        )}

        {q.type==="social"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {v:"none",     icon:"🏠", label:"Quiet night in",           sub:"Home early, no drinks"},
              {v:"light",    icon:"🥂", label:"Light social",             sub:"1–2 drinks, home by midnight"},
              {v:"moderate", icon:"🎉", label:"Night out",                sub:"A few drinks, got home late"},
              {v:"heavy",    icon:"🌙", label:"Big night",                sub:"Heavy drinking, very late"},
            ].map(opt=>(
              <div key={opt.v} onClick={()=>handleAns(opt.v)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r12,cursor:"pointer",transition:"all .12s"}}>
                <span style={{fontSize:22,width:30,textAlign:"center",flexShrink:0}}>{opt.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,color:D.text}}>{opt.label}</div>
                  <div style={{fontSize:11,color:D.text3,marginTop:2}}>{opt.sub}</div>
                </div>
                <div style={{fontSize:14,color:D.text3}}>›</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────
export default function SanaCheckInV2(){
  const[screen,setScreen]=useState("home"); // home|checkin|wearable
  const[wearable,setWearable]=useState("manual");
  const[checkinDone,setCheckinDone]=useState(false);

  // Demo user
  const userProfile={name:"Alex",sex:"Male",age:28,goal:"muscle",prot:190,cal:2450,dur:45,stress:"high",sleep:"okay"};

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",background:"#050810",WebkitFontSmoothing:"antialiased",padding:"10px 0 0"}}>
      {/* Demo switcher */}
      <div style={{maxWidth:420,margin:"0 auto 10px",padding:"0 14px"}}>
        <div style={{fontSize:9,fontWeight:500,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Demo screens</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[["home","Dashboard"],["checkin","Check-in"],["wearable","Wearable sync"]].map(([k,l])=>(
            <button key={k} onClick={()=>setScreen(k)} style={{fontSize:10,fontWeight:500,padding:"4px 10px",borderRadius:D.r99,border:`0.5px solid ${screen===k?D.accent:D.border}`,background:screen===k?D.blueSoft:D.card,color:screen===k?D.accent:D.text2,cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:420,margin:"0 auto",background:D.bg,borderRadius:"16px 16px 0 0",overflow:"hidden",border:`0.5px solid ${D.border}`,borderBottom:"none",minHeight:600}}>
        <div style={{overflowY:"auto",maxHeight:600}}>

          {/* HOME / DASHBOARD */}
          {screen==="home"&&(
            <div style={{padding:"24px 20px",paddingBottom:28}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <div style={{fontSize:11,color:D.text3,marginBottom:3}}>{new Date().toLocaleDateString([],{weekday:"long",month:"long",day:"numeric"})}</div>
                  <div style={{fontSize:22,fontWeight:500,color:D.text,letterSpacing:"-0.4px",lineHeight:1.15}}>Good morning,<br/>Alex.</div>
                </div>
                <button onClick={()=>setScreen("wearable")} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",background:D.card,border:`0.5px solid ${wearable!=="manual"?D.greenBd:D.border2}`,borderRadius:D.r99,cursor:"pointer",fontSize:11,fontWeight:500,color:wearable!=="manual"?D.green:D.text2}}>
                  <span style={{fontSize:14}}>{WEARABLES.find(w=>w.id===wearable)?.icon||"📱"}</span>
                  {wearable==="manual"?"Sync device":WEARABLES.find(w=>w.id===wearable)?.name}
                </button>
              </div>

              {/* Check-in card */}
              {!checkinDone?(
                <div onClick={()=>setScreen("checkin")} style={{background:D.card,border:`0.5px solid ${D.accent}`,borderRadius:D.r14,padding:"16px",marginBottom:14,cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontSize:15,fontWeight:500,color:D.text}}>Morning check-in</div>
                    <Pill label="10 seconds" bg={D.blueSoft} color={D.accent}/>
                  </div>
                  <div style={{fontSize:12,color:D.text2,lineHeight:1.6,marginBottom:10}}>Tell Sana how you're doing. Your train, eat, stack, and sleep plans update instantly based on what you say — with full details for each.</div>
                  <div style={{padding:"10px 12px",background:D.blueSoft,borderRadius:D.r8,fontSize:11,color:D.accent}}>→ After check-in, tap each pillar card to see your full personalised plan for today</div>
                </div>
              ):(
                <div style={{background:D.greenBg,border:`0.5px solid ${D.greenBd}`,borderRadius:D.r14,padding:"13px 16px",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:500,color:D.green,marginBottom:3}}>✓ Check-in done — plans updated</div>
                  <div style={{fontSize:11,color:D.text2}}>Tap any pillar below to see today's full plan for that section.</div>
                </div>
              )}

              {/* Pillars */}
              <SLabel c="Your five pillars — tap to see today's plan" mb={10}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {[
                  {k:"train",icon:"💪",label:"Train",sub:"3 sessions · 45 min",bar:0.72,ac:D.trainAc,st:"On track",stBg:D.greenBg,stC:D.green},
                  {k:"eat",  icon:"🥗",label:"Eat",  sub:"2,450 kcal · 190g P",bar:0.65,ac:D.eatAc,  st:"Good",   stBg:D.blueSoft,stC:D.accent},
                  {k:"stack",icon:"💊",label:"Stack",sub:"4 supplements",       bar:0.5, ac:D.stackAc,st:"2 of 4", stBg:D.amberBg, stC:D.amber},
                  {k:"sleep",icon:"🌙",label:"Sleep",sub:"Target 7.5 hrs",      bar:0.4, ac:D.sleepAc,st:"Needs care",stBg:D.redBg,stC:D.red},
                ].map(p=>(
                  <div key={p.k} style={{background:D.card,border:`0.5px solid ${D.border}`,borderRadius:D.r14,padding:"12px 13px",cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                      <div style={{width:32,height:32,borderRadius:D.r8,background:`${p.ac}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{p.icon}</div>
                      <Pill label={p.st} bg={p.stBg} color={p.stC}/>
                    </div>
                    <div style={{fontSize:13,fontWeight:500,color:D.text,marginBottom:2}}>{p.label}</div>
                    <div style={{fontSize:11,color:D.text2,marginBottom:9,lineHeight:1.3}}>{p.sub}</div>
                    <div style={{height:3,background:D.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${p.bar*100}%`,background:p.ac,borderRadius:2}}/></div>
                  </div>
                ))}
              </div>
              {/* Social — full-width fifth pillar */}
              <div onClick={()=>setScreen("checkin")} style={{background:D.card,border:`0.5px solid ${D.socialBd}`,borderRadius:D.r14,padding:"12px 14px",cursor:"pointer",marginTop:9,display:"flex",alignItems:"center",gap:13}}>
                <div style={{width:36,height:36,borderRadius:D.r8,background:`${D.socialAc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🎉</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                    <div style={{fontSize:13,fontWeight:500,color:D.text}}>Social</div>
                    <Pill label={checkinDone?"Plan ready":"Log last night"} bg={checkinDone?D.socialBg:`${D.socialAc}15`} color={D.socialAc}/>
                  </div>
                  <div style={{fontSize:11,color:D.text2,marginBottom:8,lineHeight:1.3}}>Going out · drinking · late nights · next-day recovery</div>
                  <div style={{height:3,background:D.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:"60%",background:D.socialAc,borderRadius:2}}/></div>
                </div>
              </div>

              <div onClick={()=>setScreen("checkin")} style={{marginTop:10,padding:"13px 15px",background:D.card,border:`0.5px solid ${D.border2}`,borderRadius:D.r14,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:D.r8,background:`linear-gradient(135deg,${D.blueMid}30,${D.indigo}30)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,color:D.text}}>Daily check-in → full plan</div>
                  <div style={{fontSize:11,color:D.text2}}>5 questions · all 4 pillar plans update · tap any to expand</div>
                </div>
                <div style={{fontSize:16,color:D.text3}}>→</div>
              </div>
            </div>
          )}

          {/* CHECK-IN */}
          {screen==="checkin"&&(
            <CheckInFlow
              userProfile={userProfile}
              wearable={wearable}
              onComplete={()=>{setCheckinDone(true);setScreen("home");}}
              onBack={()=>setScreen("home")}
            />
          )}

          {/* WEARABLE SYNC */}
          {screen==="wearable"&&(
            <WearableScreen
              connected={wearable}
              onConnect={(id)=>{setWearable(id);setScreen("home");}}
              onBack={()=>setScreen("home")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
