"use client";
import { useState, useRef, useEffect } from "react";
import { initialClients, initialMessages, initialInvoices, statusConfig } from "@/lib/data";

const C = {
  bg: "#0D0F14", surface: "#151820", card: "#1C2030", border: "#252A3A",
  accent: "#4F8EF7", accentSoft: "#4F8EF720", green: "#34D399", greenSoft: "#34D39920",
  yellow: "#FBBF24", yellowSoft: "#FBBF2420", red: "#F87171", redSoft: "#F8717120",
  purple: "#A78BFA", purpleSoft: "#A78BFA20", text: "#F1F5F9", muted: "#64748B",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ name, size = 18, color = "currentColor" }) {
  const map = {
    dashboard: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    clients:   <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
    messages:  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    invoices:  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>,
    ai:        <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>,
    send:      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
    plus:      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    dollar:    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    clock:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    spark:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    file:      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13,2 13,9 20,9"/></svg>,
    arrow:     <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  };
  return map[name] || null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
async function askClaude(prompt, system) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text;
}

const s = {
  app:        { display:"flex", height:"100vh", background:C.bg, fontFamily:"'Sora',sans-serif", color:C.text, overflow:"hidden" },
  sidebar:    { width:220, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"24px 0", flexShrink:0 },
  logo:       { padding:"0 20px 28px", fontSize:18, fontWeight:700, letterSpacing:"-0.5px" },
  main:       { flex:1, overflow:"auto", display:"flex", flexDirection:"column" },
  header:     { padding:"24px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 },
  pageTitle:  { fontSize:22, fontWeight:700, letterSpacing:"-0.5px" },
  content:    { padding:"24px 32px", flex:1, overflow:"auto" },
  grid3:      { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 },
  grid2:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 },
  card:       { background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" },
  cardHeader: { padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" },
  cardTitle:  { fontSize:14, fontWeight:600 },
  input:      { background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.text, fontFamily:"'Sora',sans-serif", fontSize:13.5, outline:"none", width:"100%", boxSizing:"border-box" },
};

const btn = (v="primary") => ({
  padding:"9px 18px", borderRadius:9, border: v==="ghost"?`1px solid ${C.border}`:"none",
  cursor:"pointer", fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:600,
  background: v==="primary"?C.accent: v==="ghost"?"transparent":C.surface,
  color: v==="primary"?"#fff":C.text, display:"flex", alignItems:"center", gap:6, transition:"opacity 0.15s",
});
const badge = (color,bg) => ({ fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:6, color, background:bg, letterSpacing:"0.03em" });
const avatar = (color) => ({ width:38, height:38, borderRadius:10, background:color+"30", color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0, border:`1px solid ${color}40` });
const clientRow = (sel) => ({ padding:"14px 20px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", background:sel?C.accentSoft:"transparent", borderBottom:`1px solid ${C.border}`, transition:"background 0.12s" });
const navItem = (active) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 20px", cursor:"pointer", fontSize:13.5, fontWeight:active?600:400, color:active?C.accent:C.muted, background:active?C.accentSoft:"transparent", borderLeft:`3px solid ${active?C.accent:"transparent"}`, transition:"all 0.15s", marginBottom:2 });

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Portal() {
  const [tab, setTab]                   = useState("dashboard");
  const [clients, setClients]           = useState(initialClients);
  const [messages, setMessages]         = useState(initialMessages);
  const invoices                        = initialInvoices;
  const [selClient, setSelClient]       = useState(null);
  const [msgInput, setMsgInput]         = useState("");
  const [aiPrompt, setAiPrompt]         = useState("");
  const [aiResp, setAiResp]             = useState("");
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiSug, setAiSug]               = useState("");
  const [aiSugLoading, setAiSugLoading] = useState(false);
  const [showAdd, setShowAdd]           = useState(false);
  const [newC, setNewC]                 = useState({ name:"", email:"", project:"", budget:"" });
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, selClient]);

  const totalEarned  = clients.reduce((s,c) => s+c.paid, 0);
  const totalPending = clients.reduce((s,c) => s+(c.budget-c.paid), 0);
  const activeCount  = clients.filter(c => c.status==="active").length;
  const unread       = messages.filter(m => !m.read && m.sender==="client").length;
  const clientMsgs   = selClient ? messages.filter(m => m.clientId===selClient.id) : [];

  const sendMsg = () => {
    if (!msgInput.trim() || !selClient) return;
    setMessages(p => [...p, { id:Date.now(), clientId:selClient.id, sender:"you", text:msgInput, time:"Now", read:true }]);
    setMsgInput("");
  };

  const getAiReply = async () => {
    if (!selClient) return;
    setAiSugLoading(true);
    const last = clientMsgs.filter(m => m.sender==="client").at(-1);
    try {
      const t = await askClaude(
        `Client "${selClient.name}" working on "${selClient.project}" said: "${last?.text||"Hello"}". Write a short professional friendly reply in 1-2 sentences. Only output the reply.`
      );
      setAiSug(t);
    } catch(e) { setAiSug("Error: " + e.message); }
    setAiSugLoading(false);
  };

  const runAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setAiResp("");
    try {
      const t = await askClaude(aiPrompt,
        `You are an AI assistant in a freelancer client portal. Freelancer has ${clients.length} clients. Total earned: $${totalEarned.toLocaleString()}. Active projects: ${activeCount}.`
      );
      setAiResp(t);
    } catch(e) { setAiResp("Error: " + e.message); }
    setAiLoading(false);
  };

  const addClient = () => {
    if (!newC.name || !newC.project) return;
    const colors = ["#4F8EF7","#A78BFA","#34D399","#FBBF24","#F87171","#FB923C"];
    setClients(p => [...p, { id:Date.now(), name:newC.name, email:newC.email, project:newC.project, status:"pending", budget:Number(newC.budget)||0, paid:0, progress:0, avatar:newC.name.slice(0,2).toUpperCase(), color:colors[Math.floor(Math.random()*colors.length)], due:"TBD", files:0, messages:0 }]);
    setNewC({ name:"", email:"", project:"", budget:"" });
    setShowAdd(false);
  };

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:"dashboard" },
    { id:"clients",   label:"Clients",   icon:"clients" },
    { id:"messages",  label:"Messages",  icon:"messages", badge:unread },
    { id:"invoices",  label:"Invoices",  icon:"invoices" },
    { id:"ai",        label:"AI Assistant", icon:"ai" },
  ];

  return (
    <div style={s.app}>
      {/* ── Sidebar ── */}
      <div style={s.sidebar}>
        <div style={s.logo}>portal<span style={{color:C.accent}}>.ai</span></div>
        {navItems.map(n => (
          <div key={n.id} style={navItem(tab===n.id)} onClick={() => setTab(n.id)}>
            <Icon name={n.icon} size={16} color={tab===n.id?C.accent:C.muted}/>
            <span style={{flex:1}}>{n.label}</span>
            {n.badge>0 && <span style={{background:C.red,color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{n.badge}</span>}
          </div>
        ))}
        <div style={{flex:1}}/>
        <div style={{padding:"16px 20px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.accent}}>JD</div>
            <div><div style={{fontSize:13,fontWeight:600}}>Jane Doe</div><div style={{fontSize:11,color:C.muted}}>Freelancer</div></div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={s.main}>

        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <>
            <div style={s.header}>
              <div><div style={s.pageTitle}>Dashboard</div><div style={{fontSize:13,color:C.muted,marginTop:4}}>Welcome back, Jane 👋</div></div>
              <button style={btn()} onClick={()=>{setTab("clients");setShowAdd(true);}}>
                <Icon name="plus" size={14} color="#fff"/> New Client
              </button>
            </div>
            <div style={s.content}>
              <div style={s.grid3}>
                {[
                  {label:"Total Earned",    value:`$${totalEarned.toLocaleString()}`,  color:C.green,  icon:"dollar"},
                  {label:"Pending Payment", value:`$${totalPending.toLocaleString()}`, color:C.yellow, icon:"clock"},
                  {label:"Active Projects", value:activeCount,                          color:C.accent, icon:"clients"},
                ].map((st,i) => (
                  <div key={i} style={{...s.card,padding:"20px 24px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:16,right:16,opacity:0.25}}><Icon name={st.icon} size={28} color={st.color}/></div>
                    <div style={{fontSize:12,color:C.muted,fontWeight:500,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{st.label}</div>
                    <div style={{fontSize:28,fontWeight:700,letterSpacing:"-1px",color:st.color}}>{st.value}</div>
                  </div>
                ))}
              </div>
              <div style={s.grid2}>
                <div style={s.card}>
                  <div style={s.cardHeader}><span style={s.cardTitle}>Active Clients</span><span style={{fontSize:12,color:C.muted}}>{clients.length} total</span></div>
                  {clients.slice(0,4).map(c => (
                    <div key={c.id} style={clientRow(false)} onClick={()=>{setSelClient(c);setTab("messages");}}>
                      <div style={avatar(c.color)}>{c.avatar}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13.5,fontWeight:600,marginBottom:2}}>{c.name}</div>
                        <div style={{fontSize:12,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.project}</div>
                        <div style={{height:4,borderRadius:2,background:C.border,marginTop:6,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${c.progress}%`,background:c.color,borderRadius:2,transition:"width 0.5s"}}/>
                        </div>
                      </div>
                      <span style={badge(statusConfig[c.status].color,statusConfig[c.status].bg)}>{statusConfig[c.status].label}</span>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <div style={s.cardHeader}><span style={s.cardTitle}>Recent Invoices</span></div>
                  {invoices.slice(0,4).map(inv => {
                    const cl = clients.find(c=>c.id===inv.clientId);
                    const ist = {paid:{c:C.green,bg:C.greenSoft,l:"Paid"},unpaid:{c:C.yellow,bg:C.yellowSoft,l:"Unpaid"},draft:{c:C.muted,bg:"#33415520",l:"Draft"}};
                    return (
                      <div key={inv.id} style={{padding:"12px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div><div style={{fontSize:13,fontWeight:600}}>{inv.id}</div><div style={{fontSize:12,color:C.muted}}>{cl?.name}</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,marginBottom:3}}>${inv.amount.toLocaleString()}</div><span style={badge(ist[inv.status].c,ist[inv.status].bg)}>{ist[inv.status].l}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* CLIENTS */}
        {tab==="clients" && (
          <>
            <div style={s.header}><div style={s.pageTitle}>Clients</div><button style={btn()} onClick={()=>setShowAdd(true)}><Icon name="plus" size={14} color="#fff"/> Add Client</button></div>
            <div style={s.content}>
              {showAdd && (
                <div style={{...s.card,marginBottom:20,padding:20}}>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>New Client</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    {[["name","Client Name"],["email","Email"],["project","Project Name"],["budget","Budget ($)"]].map(([k,ph]) => (
                      <input key={k} style={s.input} placeholder={ph} value={newC[k]} onChange={e=>setNewC(p=>({...p,[k]:e.target.value}))}/>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button style={btn()} onClick={addClient}>Add Client</button>
                    <button style={btn("ghost")} onClick={()=>setShowAdd(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <div style={s.card}>
                {clients.map(c => (
                  <div key={c.id} style={{...clientRow(false),alignItems:"flex-start",padding:"16px 20px"}}>
                    <div style={avatar(c.color)}>{c.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                        <span style={{fontSize:14,fontWeight:600}}>{c.name}</span>
                        <span style={badge(statusConfig[c.status].color,statusConfig[c.status].bg)}>{statusConfig[c.status].label}</span>
                      </div>
                      <div style={{fontSize:12.5,color:C.muted,marginBottom:8}}>{c.project} · Due {c.due}</div>
                      <div style={{display:"flex",gap:20,fontSize:12,color:C.muted,marginBottom:8}}>
                        <span style={{color:C.green}}>${c.paid.toLocaleString()} paid</span>
                        <span>/ ${c.budget.toLocaleString()} total</span>
                        <span>{c.files} files</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${c.progress}%`,background:c.color,borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:12,color:C.muted,width:35,textAlign:"right"}}>{c.progress}%</span>
                      </div>
                    </div>
                    <button style={{...btn("ghost"),fontSize:12,padding:"6px 12px"}} onClick={()=>{setSelClient(c);setTab("messages");}}>
                      Message <Icon name="arrow" size={12} color={C.muted}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MESSAGES */}
        {tab==="messages" && (
          <div style={{display:"flex",height:"100%",overflow:"hidden"}}>
            <div style={{width:260,borderRight:`1px solid ${C.border}`,overflow:"auto",flexShrink:0}}>
              <div style={{padding:"20px 16px 12px",fontSize:14,fontWeight:600}}>Conversations</div>
              {clients.map(c => {
                const u = messages.filter(m=>m.clientId===c.id&&!m.read&&m.sender==="client").length;
                const last = messages.filter(m=>m.clientId===c.id).at(-1);
                return (
                  <div key={c.id} style={clientRow(selClient?.id===c.id)} onClick={()=>setSelClient(c)}>
                    <div style={avatar(c.color)}>{c.avatar}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                        <span style={{fontSize:13.5,fontWeight:600}}>{c.name}</span>
                        {u>0&&<span style={{background:C.red,color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{u}</span>}
                      </div>
                      <div style={{fontSize:12,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{last?.text||"No messages"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {selClient ? (
                <>
                  <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
                    <div style={avatar(selClient.color)}>{selClient.avatar}</div>
                    <div><div style={{fontSize:14,fontWeight:600}}>{selClient.name}</div><div style={{fontSize:12,color:C.muted}}>{selClient.project}</div></div>
                    <button style={{...btn("ghost"),marginLeft:"auto",fontSize:12}} onClick={getAiReply} disabled={aiSugLoading}>
                      <Icon name="spark" size={13} color={C.accent}/> {aiSugLoading?"Thinking...":"AI Reply"}
                    </button>
                  </div>
                  <div style={{flex:1,overflow:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:10}}>
                    {clientMsgs.map(m => (
                      <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:m.sender==="you"?"flex-end":"flex-start"}}>
                        <div style={{maxWidth:"72%",padding:"9px 14px",borderRadius:m.sender==="you"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.sender==="you"?C.accent:C.surface,color:C.text,fontSize:13.5,lineHeight:1.5}}>{m.text}</div>
                        <span style={{fontSize:11,color:C.muted,marginTop:3,paddingLeft:4,paddingRight:4}}>{m.time}</span>
                      </div>
                    ))}
                    <div ref={endRef}/>
                  </div>
                  {aiSug && (
                    <div style={{padding:"10px 20px",background:C.accentSoft,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
                      <Icon name="spark" size={14} color={C.accent}/>
                      <span style={{fontSize:12.5,color:C.text,flex:1}}>{aiSug}</span>
                      <button style={{...btn(),fontSize:12,padding:"6px 12px"}} onClick={()=>{setMsgInput(aiSug);setAiSug("");}}>Use</button>
                      <button style={{...btn("ghost"),fontSize:12,padding:"6px 10px"}} onClick={()=>setAiSug("")}>✕</button>
                    </div>
                  )}
                  <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10}}>
                    <input style={{...s.input,flex:1}} placeholder="Type a message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
                    <button style={btn()} onClick={sendMsg}><Icon name="send" size={15} color="#fff"/></button>
                  </div>
                </>
              ) : (
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,flexDirection:"column",gap:12}}>
                  <Icon name="messages" size={40} color={C.border}/>
                  <span style={{fontSize:14}}>Select a client to start messaging</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INVOICES */}
        {tab==="invoices" && (
          <>
            <div style={s.header}><div style={s.pageTitle}>Invoices</div></div>
            <div style={s.content}>
              <div style={s.grid3}>
                {[
                  {label:"Total Billed",  value:`$${invoices.reduce((a,i)=>a+i.amount,0).toLocaleString()}`, color:C.text},
                  {label:"Collected",     value:`$${invoices.filter(i=>i.status==="paid").reduce((a,i)=>a+i.amount,0).toLocaleString()}`, color:C.green},
                  {label:"Outstanding",   value:`$${invoices.filter(i=>i.status==="unpaid").reduce((a,i)=>a+i.amount,0).toLocaleString()}`, color:C.yellow},
                ].map((st,i)=>(
                  <div key={i} style={{...s.card,padding:"20px 24px"}}>
                    <div style={{fontSize:12,color:C.muted,fontWeight:500,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{st.label}</div>
                    <div style={{fontSize:28,fontWeight:700,letterSpacing:"-1px",color:st.color}}>{st.value}</div>
                  </div>
                ))}
              </div>
              <div style={s.card}>
                <div style={{...s.cardHeader,display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:8,fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>
                  <span>Invoice</span><span>Client</span><span>Amount</span><span>Due Date</span><span>Status</span>
                </div>
                {invoices.map(inv=>{
                  const cl=clients.find(c=>c.id===inv.clientId);
                  const ist={paid:{c:C.green,bg:C.greenSoft,l:"Paid"},unpaid:{c:C.yellow,bg:C.yellowSoft,l:"Unpaid"},draft:{c:C.muted,bg:"#33415520",l:"Draft"}};
                  return (
                    <div key={inv.id} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:8,padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                      <span style={{fontSize:13.5,fontWeight:600}}>{inv.id}</span>
                      <span style={{fontSize:13,color:C.muted}}>{cl?.name}</span>
                      <span style={{fontSize:14,fontWeight:700}}>${inv.amount.toLocaleString()}</span>
                      <span style={{fontSize:12.5,color:C.muted}}>{inv.due}</span>
                      <span style={badge(ist[inv.status].c,ist[inv.status].bg)}>{ist[inv.status].l}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* AI */}
        {tab==="ai" && (
          <>
            <div style={s.header}><div style={s.pageTitle}>AI Assistant</div></div>
            <div style={s.content}>
              <div style={{...s.card,marginBottom:20}}>
                <div style={{padding:"20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                  <Icon name="spark" size={18} color={C.accent}/>
                  <span style={{fontWeight:600,fontSize:14}}>Ask AI anything about your business</span>
                </div>
                <div style={{padding:20}}>
                  <div style={{display:"flex",gap:10,marginBottom:14}}>
                    <input style={{...s.input,flex:1}} placeholder="e.g. Draft a follow-up email for Nexaflow, which invoice is overdue..." value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runAI()}/>
                    <button style={btn()} onClick={runAI} disabled={aiLoading}>
                      {aiLoading?"Thinking...":<><Icon name="spark" size={14} color="#fff"/> Ask AI</>}
                    </button>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {["Draft follow-up email for Lumira Studio","Which invoice is overdue?","Summarize my active projects","Tips to improve client retention"].map(q=>(
                      <button key={q} style={{...btn("ghost"),fontSize:11.5,padding:"5px 10px"}} onClick={()=>setAiPrompt(q)}>{q}</button>
                    ))}
                  </div>
                </div>
                {(aiLoading||aiResp) && (
                  <div style={{padding:"0 20px 20px"}}>
                    <div style={{background:C.surface,borderRadius:10,padding:16,border:`1px solid ${C.border}`,fontSize:13.5,lineHeight:1.7,color:C.text,minHeight:60,whiteSpace:"pre-wrap"}}>
                      {aiLoading?<div style={{display:"flex",alignItems:"center",gap:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:C.accent,animation:"pulse 1s infinite"}}/> AI is thinking...</div>:aiResp}
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
                {[
                  {label:"Draft project update",  icon:"file",     p:"Write a professional project status update email I can send to my active clients."},
                  {label:"Payment reminder",       icon:"dollar",   p:"Write a polite but firm payment reminder email for a client whose invoice is 2 weeks overdue."},
                  {label:"Proposal template",      icon:"clients",  p:"Write a short freelance project proposal template I can customize for new clients."},
                  {label:"End of month report",    icon:"dashboard",p:`Summarize my freelance business: ${clients.length} clients, $${totalEarned.toLocaleString()} earned, $${totalPending.toLocaleString()} pending. Give insights.`},
                ].map(a=>(
                  <div key={a.label} style={{...s.card,padding:16,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>{setAiPrompt(a.p);}}>
                    <div style={{width:36,height:36,borderRadius:9,background:C.accentSoft,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name={a.icon} size={16} color={C.accent}/>
                    </div>
                    <div>
                      <div style={{fontSize:13.5,fontWeight:600}}>{a.label}</div>
                      <div style={{fontSize:11.5,color:C.muted}}>Click to load prompt</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
