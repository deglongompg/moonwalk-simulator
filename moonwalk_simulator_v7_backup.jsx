import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AFF = "https://go.moonwalk.fit/?r=61eeb64b";
const PPT = 59135;
const LG = ["Bronze", "Argent", "Or", "Platine", "Diamant", "Tungstène"];

const TH = { Bronze: [0,2500,5000,10000], Argent: [0,10000,16000,31500], Or: [0,10000,31500,71500], Platine: [0,31500,71500,145000], Diamant: [0,71500,145000,275000], "Tungstène": [0,145000,275000,600000] };
const XM = { Bronze: [1,1.5,2,3], Argent: [.8,1,2,3], Or: [.4,.8,1.6,2.4], Platine: [.3,.6,1.2,1.8], Diamant: [.2,.4,.8,1.2], "Tungstène": [.1,.2,.4,.6] };
const W = { Bronze: [740,520,402,358], Argent: [600,420,402,221], Or: [500,392,224,115], Platine: [411,180,102,60], Diamant: [195,90,52,29], "Tungstène": [100,30,18,9] };
const WK = { Bronze: 3520, Argent: 2470, Or: 1200, Platine: 550, Diamant: 280, "Tungstène": 20 };
const HI = [
  { label: "Oct 25", Bronze: 3790, Argent: 567, Or: 316, Platine: 186, Diamant: 109, "Tungstène": 0 },
  { label: "Nov 25", Bronze: 5280, Argent: 1030, Or: 407, Platine: 201, Diamant: 111, "Tungstène": 0 },
  { label: "Déc 25", Bronze: 5430, Argent: 1290, Or: 487, Platine: 219, Diamant: 116, "Tungstène": 3 },
  { label: "Mars 26", Bronze: 3520, Argent: 2470, Or: 1200, Platine: 550, Diamant: 280, "Tungstène": 20 },
];
const CL = {
  Bronze: { bg:"#5C3D0E", gw:"#CD853F", tx:"#FFD89B", ic:"🥉", ln:"#CD853F" },
  Argent: { bg:"#2D3648", gw:"#8BA4BE", tx:"#D4E1F0", ic:"🥈", ln:"#8BA4BE" },
  Or: { bg:"#5C4A0E", gw:"#DAA520", tx:"#FFE066", ic:"🥇", ln:"#DAA520" },
  Platine: { bg:"#1A2A3A", gw:"#4299E1", tx:"#90CDF4", ic:"💎", ln:"#4299E1" },
  Diamant: { bg:"#2D1F4E", gw:"#9F7AEA", tx:"#D6BCFA", ic:"♦️", ln:"#9F7AEA" },
  "Tungstène": { bg:"#2A1215", gw:"#F56565", tx:"#FEB2B2", ic:"🔥", ln:"#F56565" },
};
const LK = [{ d:30,l:"30j (×1.08)",m:1.08 },{ d:90,l:"90j (×1.25)",m:1.25 },{ d:180,l:"6 mois (×1.5)",m:1.5 },{ d:365,l:"1 an (×2.0)",m:2 }];
const SG = [{ s:3000,l:"3K",e:"🚶" },{ s:5000,l:"5K",e:"🚶‍♂️" },{ s:7500,l:"7.5K",e:"🏃" },{ s:10000,l:"10K",e:"🏃‍♂️" },{ s:12000,l:"12K",e:"🔥" }];

function projMig(wk, sc) {
  const r = { conservative:{n:.008,m:.012,c:.005}, moderate:{n:.015,m:.020,c:.003}, aggressive:{n:.03,m:.035,c:.002} }[sc];
  let c = {...WK}; const res = [{label:"Maintenant",week:0,...c}];
  for (let i=1;i<=wk;i++) {
    const t=LG.reduce((s,l)=>s+c[l],0);
    const nx = { Bronze:Math.max(100,c.Bronze+Math.round(t*r.n)-Math.round(c.Bronze*r.m)-Math.round(c.Bronze*r.c)),
      Argent:Math.max(50,c.Argent+Math.round(c.Bronze*r.m)-Math.round(c.Argent*r.m*.7)-Math.round(c.Argent*r.c*.7)),
      Or:Math.max(30,c.Or+Math.round(c.Argent*r.m*.7)-Math.round(c.Or*r.m*.5)-Math.round(c.Or*r.c*.5)),
      Platine:Math.max(20,c.Platine+Math.round(c.Or*r.m*.5)-Math.round(c.Platine*r.m*.35)-Math.round(c.Platine*r.c*.3)),
      Diamant:Math.max(10,c.Diamant+Math.round(c.Platine*r.m*.35)-Math.round(c.Diamant*r.m*.2)-Math.round(c.Diamant*r.c*.2)),
      "Tungstène":Math.max(5,c["Tungstène"]+Math.round(c.Diamant*r.m*.2)) };
    const mo=Math.floor(i/4.33), ms=["Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    if(i%4===0||i===wk) res.push({label:ms[Math.min(mo,ms.length-1)]+" 26",week:i,...nx});
    c=nx;
  } return res;
}

export default function App() {
  const [tab, setTab] = useState("f2p");
  const [price, setPrice] = useState(0.013);
  const [stepGoal, setStepGoal] = useState(5000);
  const [stakeUSD, setStakeUSD] = useState(1);
  const [nbGames, setNbGames] = useState(10);
  const [locked, setLocked] = useState(16348);
  const [buy, setBuy] = useState(0);
  const [dur, setDur] = useState(365);
  const [active, setActive] = useState({Bronze:true,Argent:true,Or:true,Platine:false,Diamant:false,"Tungstène":false});
  const [winners, setWinners] = useState(()=>JSON.parse(JSON.stringify(W)));
  const [showTune, setShowTune] = useState(false);
  const [scenario, setScenario] = useState("moderate");
  const [projWeeks, setProjWeeks] = useState(26);

  const mult = LK.find(d=>d.d===dur)?.m||2;
  const weighted = (locked+buy)*mult, baseWt = locked*mult, inv = buy*price;
  const gT = (wt,lg) => { const t=TH[lg]; for(let i=3;i>=0;i--) if(wt>=t[i]) return i; return 0; };
  const gR = (lg,ti) => { const w=winners[lg]?.[ti]; return w>0?Math.round(PPT/w*100)/100:0; };

  // Real bonus rates: ~1% for easy challenges (3K-7K steps), ~2% for hard (10K+)
  const bonusRate = stepGoal >= 10000 ? 0.02 : 0.01;
  const bonusPerGame = stakeUSD * bonusRate;
  const weeklyBonus = bonusPerGame * nbGames;
  const totalDeposit = stakeUSD * nbGames;

  const f2p = useMemo(()=>{
    const tl=[]; let tMF=0, tGB=0, xp=0;
    const xpG = Math.min(stepGoal*.008,60)*5;
    for(let w=1;w<=52;w++){
      xp += xpG*nbGames;
      let lg="Bronze", can=xp>=2000;
      if(xp>50000) lg="Argent"; if(xp>150000) lg="Or"; if(xp>400000) lg="Platine";
      let wMF=0;
      if(can){ const li=LG.indexOf(lg); for(let i=0;i<=li;i++) wMF+=gR(LG[i],0); }
      tMF+=wMF; tGB+=weeklyBonus;
      if(w===1||w%4===0||w===52) tl.push({
        label:w===1?"Sem 1":`Mois ${Math.ceil(w/4.33)}`,
        week:w, league:lg, canMF:can,
        weeklyMF:Math.round(wMF), weeklyMFusd:+(wMF*price).toFixed(2),
        weeklyBonus:+weeklyBonus.toFixed(2),
        totalMF:Math.round(tMF), totalUSD:+((tMF*price)+tGB).toFixed(2),
        mfValue:+(tMF*price).toFixed(2),
      });
    }
    return tl;
  },[stepGoal,nbGames,stakeUSD,price,winners,weeklyBonus]);

  const rows = useMemo(()=>LG.map(lg=>{
    const ct=gT(weighted,lg),bt=gT(baseWt,lg);
    return {lg,ct,bt,up:ct>bt,r:gR(lg,ct),br:gR(lg,bt),on:active[lg],xp:XM[lg][ct],wk:WK[lg],w:winners[lg][ct]};
  }),[weighted,baseWt,winners,active]);
  const act=rows.filter(r=>r.on), wkMF=act.reduce((s,r)=>s+r.r,0), baseMF=act.reduce((s,r)=>s+r.br,0), gain=wkMF-baseMF;
  const mig = useMemo(()=>projMig(projWeeks,scenario),[projWeeks,scenario]);
  const presets=[{l:"Actuel",v:0},{l:"+10K",v:10000},{l:"+20K",v:20000},{l:"+35K",v:35000},{l:"+50K",v:50000}];
  const targets=LG.flatMap(lg=>TH[lg].map((t,i)=>{if(!t)return null;const d=t-weighted;if(d<=0)return null;return{lg,t:i+1,tok:Math.ceil(d/mult),cost:Math.ceil(d/mult)*price};}).filter(Boolean)).sort((a,b)=>a.tok-b.tok);

  return (
    <div style={{minHeight:"100vh",background:"#0B1222",color:"#E2E8F0",fontFamily:"'Segoe UI','Helvetica Neue',sans-serif"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:16}}>

        {/* HEADER */}
        <div style={{textAlign:"center",padding:"24px 16px 20px",background:"linear-gradient(180deg,#0F1A2E,#0B1222)",borderRadius:"0 0 20px 20px",marginBottom:16}}>
          <div style={{fontSize:42,marginBottom:8}}>🌙</div>
          <h1 style={{fontSize:26,fontWeight:900,color:"#2DD4BF",margin:"0 0 6px"}}>Moonwalk Fitness</h1>
          <p style={{fontSize:14,color:"#94A3B8",margin:"0 0 16px"}}>Marche. Gagne. Progresse.</p>
          <a href={AFF} target="_blank" rel="noopener noreferrer" style={cta}>🚀 Rejoindre Moonwalk Fitness</a>
          <p style={{fontSize:10,color:"#475569",marginTop:8}}>Disponible sur iOS & Android</p>
        </div>

        {/* TABS */}
        <div style={{display:"flex",margin:"0 0 16px",borderRadius:12,overflow:"hidden",border:"1px solid #1E293B"}}>
          {[["f2p","🆓 Commencer"],["sim","💰 Avancé"],["migration","📈 Projections"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"14px 8px",fontSize:12,fontWeight:800,cursor:"pointer",border:"none",background:tab===k?"#1E293B":"#0D1117",color:tab===k?"#2DD4BF":"#64748B"}}>{l}</button>
          ))}
        </div>

        {/* ========== F2P ========== */}
        {tab==="f2p"&&(<>
          {/* How it works */}
          <div style={{...bx,marginBottom:16,background:"linear-gradient(135deg,#0F2027,#203A43)",border:"1px solid #2DD4BF33"}}>
            <h2 style={{fontSize:18,fontWeight:900,color:"#2DD4BF",margin:"0 0 12px"}}>🚶 Comment ça marche ?</h2>
            <div style={{display:"grid",gap:14}}>
              {[
                {ic:"📱",t:"1. Télécharge l'app",d:"Crée ton compte et connecte Google Fit, Apple Health, Fitbit ou Garmin."},
                {ic:"🎯",t:"2. Rejoins des défis de pas",d:"Choisis un objectif (3K à 10K pas/jour) sur 5 à 30 jours. Mise minimum : 200 MF (~$2.60) ou 1 USDC. Tu peux en rejoindre jusqu'à 20 par jour !"},
                {ic:"✅",t:"3. Marche et récupère ta mise",d:"98-99% des joueurs réussissent. Tu récupères ta mise + un micro-bonus sur les rares échecs. Plus tu as de défis en parallèle, plus tu accumules d'XP rapidement."},
                {ic:"⭐",t:"4. Niveau 10 → MF Games",d:"L'XP te fait monter de niveau. Dès le niveau 10 en Bronze (~1-3 semaines selon ton nombre de défis), tu accèdes aux MF Games hebdomadaires."},
                {ic:"💰",t:"5. Gagne du $MF chaque semaine",d:"Les MF Games sont gratuits et distribuent 236 000 tokens $MF par ligue par semaine. Plus tu montes de ligue, plus tu gagnes — sans mise supplémentaire."},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{minWidth:44,height:44,borderRadius:12,background:"rgba(45,212,191,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{s.ic}</div>
                  <div><div style={{fontSize:13,fontWeight:800,color:"#E2E8F0",marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:"#94A3B8",lineHeight:1.6}}>{s.d}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Config */}
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>⚙️ Configure ta simulation</h3>
            
            {/* Step goal */}
            <label style={lbl}>Objectif de pas quotidien</label>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {SG.map(g=>(
                <button key={g.s} onClick={()=>setStepGoal(g.s)} style={{flex:1,padding:"10px",fontSize:13,fontWeight:800,borderRadius:10,cursor:"pointer",textAlign:"center",
                  border:stepGoal===g.s?"2px solid #2DD4BF":"2px solid #1E293B",background:stepGoal===g.s?"rgba(45,212,191,0.12)":"transparent",color:stepGoal===g.s?"#2DD4BF":"#64748B",
                }}>{g.e} {g.l}</button>
              ))}
            </div>
            <div style={{fontSize:10,color:stepGoal>=10000?"#68D391":"#64748B",marginTop:4}}>
              Bonus estimé : <strong>{stepGoal>=10000?"~2%":"~1%"}</strong> par défi réussi {stepGoal>=10000&&"(défi difficile = meilleur bonus)"}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* Number of games */}
              <div>
                <label style={lbl}>Nombre de défis simultanés : <strong style={{color:"#2DD4BF",fontSize:16}}>{nbGames}</strong></label>
                <input type="range" min={1} max={100} value={nbGames} onChange={e=>setNbGames(parseInt(e.target.value))}
                  style={{width:"100%",accentColor:"#2DD4BF",marginBottom:8}} />
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {[5,10,20,40,60,100].map(n=>(
                    <button key={n} onClick={()=>setNbGames(n)} style={{
                      padding:"6px 10px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",
                      border:nbGames===n?"1px solid #2DD4BF":"1px solid #1E293B",
                      background:nbGames===n?"rgba(45,212,191,0.1)":"transparent",
                      color:nbGames===n?"#2DD4BF":"#475569",
                    }}>{n}</button>
                  ))}
                </div>
              </div>
              {/* Stake */}
              <div>
                <label style={lbl}>Mise par défi (USD)</label>
                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                  {[1,2,5,10,25].map(s=>(
                    <button key={s} onClick={()=>setStakeUSD(s)} style={{
                      padding:"8px 14px",fontSize:12,fontWeight:700,borderRadius:8,cursor:"pointer",
                      border:stakeUSD===s?"2px solid #F59E0B":"2px solid #1E293B",
                      background:stakeUSD===s?"rgba(245,158,11,0.12)":"transparent",
                      color:stakeUSD===s?"#F59E0B":"#64748B",
                    }}>${s}</button>
                  ))}
                </div>
                <div style={{fontSize:11,color:"#64748B",marginTop:4}}>
                  Dépôt total en jeu : <strong style={{color:"#F59E0B"}}>${totalDeposit}</strong>
                  <span style={{color:"#475569"}}> (récupéré à 98-99%)</span>
                </div>
              </div>
            </div>

            {/* Instant results */}
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,padding:16,marginTop:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#64748B",marginBottom:4}}>Bonus hebdo (défis)</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#F59E0B"}}>+${weeklyBonus.toFixed(2)}</div>
                  <div style={{fontSize:10,color:"#475569"}}>{nbGames} défis × {Math.round(bonusRate*100)}% bonus</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#64748B",marginBottom:4}}>XP boost</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#818CF8"}}>×{nbGames}</div>
                  <div style={{fontSize:10,color:"#475569"}}>Plus de défis = montée plus rapide</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#64748B",marginBottom:4}}>MF Games (dès niv. 10)</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#2DD4BF"}}>{Math.round(gR("Bronze",0))} MF/sem</div>
                  <div style={{fontSize:10,color:"#475569"}}>≈ ${(gR("Bronze",0)*price).toFixed(2)}/sem</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progression cards */}
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>📈 Progression Tier 1 (sans lock)</h3>
            <div style={{display:"grid",gap:8}}>
              {[
                {lg:"Bronze",wk:"0-8",desc:"Premiers défis",lgs:["Bronze"]},
                {lg:"Argent",wk:"4-12",desc:"Montée en Argent",lgs:["Bronze","Argent"]},
                {lg:"Or",wk:"12-25",desc:"Arrivée en Or",lgs:["Bronze","Argent","Or"]},
                {lg:"Platine",wk:"25+",desc:"Objectif long terme",lgs:["Bronze","Argent","Or","Platine"]},
              ].map((st,i)=>{
                const c=CL[st.lg]; let tMF=0; st.lgs.forEach(l=>{tMF+=gR(l,0);});
                // Adjust weeks based on nbGames (more games = faster XP)
                const speedMult = Math.min(5, nbGames / 5);
                const adjWeeks = st.wk.includes("+") ? st.wk : st.wk.split("-").map(w => Math.max(1, Math.round(parseInt(w) / speedMult))).join("-");
                return (
                  <div key={i} style={{background:`linear-gradient(135deg,${c.bg},#0B1222)`,border:`1px solid ${c.gw}33`,borderRadius:12,padding:"14px 18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:22}}>{c.ic}</span>
                        <div>
                          <div style={{fontSize:16,fontWeight:900,color:c.tx}}>{st.lg}</div>
                          <div style={{fontSize:11,color:"#94A3B8"}}>~{adjWeeks} sem avec {nbGames} défis</div>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:900,color:"#2DD4BF"}}>{Math.round(tMF)} MF/sem</div>
                        <div style={{fontSize:12,fontWeight:700,color:"#68D391"}}>${(tMF*price).toFixed(2)}/sem • ${(tMF*price*4.33).toFixed(2)}/mois</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 12 month table */}
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>📅 Projection 12 mois</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr>
                  <th style={th}>Période</th><th style={th}>Ligue</th><th style={th}>MF Games</th>
                  <th style={th}>MF/sem</th><th style={th}>$/sem (MF)</th><th style={th}>$/sem (défis)</th>
                  <th style={{...th,color:"#68D391"}}>Cumulé $</th>
                </tr></thead>
                <tbody>{f2p.map((r,i)=>{const c=CL[r.league];return(
                  <tr key={i} style={{background:r.canMF&&i>0?"rgba(45,212,191,0.03)":"transparent"}}>
                    <td style={{...td,fontWeight:700}}>{r.label}</td>
                    <td style={{...td,color:c.tx,fontWeight:700}}>{c.ic} {r.league}</td>
                    <td style={td}>{r.canMF?<span style={{color:"#2DD4BF"}}>✅</span>:<span style={{color:"#64748B"}}>🔒</span>}</td>
                    <td style={{...td,color:"#2DD4BF",fontWeight:700}}>{r.weeklyMF||"—"}</td>
                    <td style={td}>{r.weeklyMFusd>0?`$${r.weeklyMFusd}`:"—"}</td>
                    <td style={{...td,color:"#F59E0B"}}>${r.weeklyBonus}</td>
                    <td style={{...td,color:"#68D391",fontWeight:800}}>${r.totalUSD}</td>
                  </tr>
                );})}</tbody>
              </table>
            </div>
          </div>

          {/* Chart */}
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>💰 Gains cumulés ($)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={f2p}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B"/>
                <XAxis dataKey="label" tick={{fill:"#64748B",fontSize:10}}/>
                <YAxis tick={{fill:"#64748B",fontSize:10}}/>
                <Tooltip contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:11,color:"#E2E8F0"}}/>
                <Line type="monotone" dataKey="totalUSD" stroke="#68D391" strokeWidth={3} dot={{r:3,fill:"#68D391"}} name="Total $"/>
                <Line type="monotone" dataKey="mfValue" stroke="#2DD4BF" strokeWidth={2} dot={false} name="MF Games $" strokeDasharray="5 5"/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Lock tip */}
          <div style={{...bx,marginBottom:16,background:"linear-gradient(135deg,#1A1A2E,#16213E)",border:"1px solid rgba(245,158,11,0.2)"}}>
            <h3 style={{color:"#F59E0B",fontSize:14,fontWeight:800,margin:"0 0 8px"}}>💡 Astuce : bloquer tes MF gagnés pour multiplier tes gains</h3>
            <p style={{fontSize:12,color:"#94A3B8",margin:0,lineHeight:1.7}}>
              Tes MF Games te rapportent des tokens $MF chaque semaine. En les <strong style={{color:"#2DD4BF"}}>bloquant (lock)</strong> dans l'app, 
              tu montes de Tier et tes gains explosent. En Or, le Tier 4 rapporte <strong style={{color:"#2DD4BF"}}>~5× plus</strong> que le Tier 1. 
              Et tu récupères 100% de tes tokens à la fin. Essaie l'onglet "Avancé" pour simuler !
            </p>
          </div>

          {/* CTA */}
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <a href={AFF} target="_blank" rel="noopener noreferrer" style={{...cta,fontSize:18,padding:"16px 40px"}}>🚀 Commencer sur Moonwalk</a>
            <p style={{fontSize:11,color:"#475569",marginTop:8}}>Télécharge l'app sur iOS ou Android</p>
          </div>
        </>)}

        {/* ========== ADVANCED ========== */}
        {tab==="sim"&&(<>
          <div style={{margin:"0 0 16px",background:"linear-gradient(135deg,#0F2027,#203A43,#2C5364)",border:"2px solid #2DD4BF",borderRadius:16,padding:24}}>
            <h2 style={{fontSize:18,fontWeight:900,color:"#2DD4BF",margin:"0 0 16px"}}>💰 SIMULER UN INVESTISSEMENT</h2>
            <div style={{textAlign:"center",margin:"0 0 16px",padding:16,background:"rgba(0,0,0,0.3)",borderRadius:12}}>
              <div style={{fontSize:42,fontWeight:900,color:"#2DD4BF",lineHeight:1}}>+{buy.toLocaleString()} MF</div>
              <div style={{fontSize:20,color:"#F59E0B",fontWeight:700,marginTop:6}}>= ${(buy*price).toFixed(2)}</div>
              <div style={{fontSize:12,color:"#64748B",marginTop:6}}>Pondéré: {Math.round(weighted).toLocaleString()}</div>
            </div>
            <input type="range" min={0} max={80000} step={500} value={buy} onChange={e=>setBuy(parseInt(e.target.value))} style={{width:"100%",height:10,accentColor:"#2DD4BF",marginBottom:14,cursor:"pointer"}}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
              {presets.map(p=>(<button key={p.v} onClick={()=>setBuy(p.v)} style={{padding:"12px 20px",fontSize:14,fontWeight:900,borderRadius:12,cursor:"pointer",minWidth:80,border:buy===p.v?"2px solid #2DD4BF":"2px solid #334155",background:buy===p.v?"rgba(45,212,191,0.2)":"rgba(15,23,42,0.6)",color:buy===p.v?"#2DD4BF":"#94A3B8"}}>{p.l}{p.v>0&&<div style={{fontSize:10,opacity:.7}}>~${(p.v*price).toFixed(0)}</div>}</button>))}
            </div>
          </div>
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>⚙️ Paramètres</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              <div><label style={lbl}>Prix $MF</label><input type="number" step={.001} value={price} onChange={e=>setPrice(parseFloat(e.target.value)||0)} style={inp}/></div>
              <div><label style={lbl}>Tokens lockés</label><input type="number" step={100} value={locked} onChange={e=>setLocked(Math.round(parseFloat(e.target.value))||0)} style={inp}/></div>
              <div><label style={lbl}>Lock</label><select value={dur} onChange={e=>setDur(parseInt(e.target.value))} style={{...inp,cursor:"pointer"}}>{LK.map(d=><option key={d.d} value={d.d}>{d.l}</option>)}</select></div>
              <div><label style={lbl}>Pondéré</label><div style={{padding:"8px 10px",background:"rgba(45,212,191,0.08)",borderRadius:6,color:"#2DD4BF",fontWeight:800,fontSize:14,textAlign:"center",border:"1px solid rgba(45,212,191,0.2)"}}>{Math.round(weighted).toLocaleString()}</div></div>
            </div>
          </div>
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>🏆 Ligues actives</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {LG.map(lg=>{const c=CL[lg],on=active[lg];return<button key={lg} onClick={()=>setActive(p=>({...p,[lg]:!p[lg]}))} style={{padding:"10px 18px",fontSize:13,fontWeight:800,borderRadius:10,cursor:"pointer",border:on?`2px solid ${c.gw}`:"2px solid #1E293B",background:on?c.bg:"transparent",color:on?c.tx:"#475569",opacity:on?1:.4}}>{c.ic} {lg}</button>;})}
            </div>
          </div>
          <div style={{display:"grid",gap:10,marginBottom:16}}>
            {rows.map(r=>{const c=CL[r.lg],d=r.r-r.br;return(
              <div key={r.lg} style={{background:r.on?`linear-gradient(135deg,${c.bg},#0B1222)`:"#0D1117",border:r.up?"2px solid #2DD4BF":r.on?`1px solid ${c.gw}33`:"1px solid #1E293B",borderRadius:12,padding:"14px 18px",opacity:r.on?1:.3}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:20}}>{c.ic}</span>
                    <span style={{fontSize:18,fontWeight:900,color:c.tx}}>{r.lg}</span>
                    <span style={{background:r.up?"rgba(45,212,191,0.15)":"rgba(100,116,139,0.15)",color:r.up?"#2DD4BF":"#94A3B8",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:800}}>Tier {r.ct+1}{r.up&&" ⬆"}</span>
                    <span style={{fontSize:10,color:"#F59E0B",background:"rgba(245,158,11,0.1)",padding:"2px 8px",borderRadius:10,fontWeight:700}}>XP ×{r.xp}</span>
                    <span style={{fontSize:9,color:"#475569"}}>{r.wk} marcheurs</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:26,fontWeight:900,color:r.on?"#2DD4BF":"#334155"}}>{r.on?`${Math.round(r.r)} MF`:"—"}</div>
                    <div style={{fontSize:11,color:"#64748B"}}>{r.on&&`≈ $${(r.r*price).toFixed(2)}/sem`}</div>
                    {r.on&&r.up&&d>0&&<div style={{fontSize:12,color:"#2DD4BF",fontWeight:800}}>+{Math.round(d)} MF</div>}
                  </div>
                </div>
                <div style={{display:"flex",gap:3,marginTop:10}}>{TH[r.lg].map((thr,i)=>{const reached=weighted>=thr,was=baseWt>=thr,fresh=reached&&!was;return<div key={i} style={{flex:1}}><div style={{height:5,borderRadius:3,background:fresh?"#2DD4BF":reached?c.gw+"88":"#1E293B"}}/><div style={{fontSize:8,textAlign:"center",marginTop:2,color:reached?c.tx:"#334155"}}>T{i+1} {thr>0?`${(thr/1000).toFixed(thr<10000?1:0)}k`:"Free"}</div></div>;})}</div>
              </div>
            );})}
          </div>
          <div style={{background:"linear-gradient(135deg,#0F2027,#203A43)",border:"2px solid #1E293B",borderRadius:16,padding:20,marginBottom:16}}>
            <h3 style={{color:"#2DD4BF",fontSize:13,margin:"0 0 14px",textTransform:"uppercase",letterSpacing:1.5}}>📊 Résumé</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:buy>0?16:0}}>
              <SC l="Par semaine" mf={wkMF} usd={wkMF*price}/>
              <SC l="Par mois" mf={wkMF*4.33} usd={wkMF*price*4.33}/>
              <SC l="Par an" mf={wkMF*52} usd={wkMF*price*52}/>
            </div>
            {buy>0&&<div style={{background:"rgba(0,0,0,0.4)",borderRadius:10,padding:14,border:"1px solid rgba(245,158,11,0.2)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,textAlign:"center"}}>
                <div><div style={sub}>Investissement</div><div style={{fontSize:22,fontWeight:900,color:"#F59E0B"}}>${inv.toFixed(0)}</div></div>
                <div><div style={sub}>Gain supp./sem</div><div style={{fontSize:22,fontWeight:900,color:"#2DD4BF"}}>+{Math.round(gain)} MF</div></div>
                <div><div style={sub}>Payback</div><div style={{fontSize:22,fontWeight:900,color:"#818CF8"}}>{gain>0?`~${Math.ceil(inv/(gain*price))} sem`:"∞"}</div></div>
              </div>
            </div>}
          </div>
          {targets.length>0&&<div style={{...bx,marginBottom:16}}>
            <h3 style={{...sec,color:"#F59E0B"}}>🎯 Prochains paliers</h3>
            <div style={{display:"grid",gap:4}}>{targets.slice(0,8).map((t,i)=>{const c=CL[t.lg];return<div key={i} onClick={()=>setBuy(t.tok)} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:8,cursor:"pointer"}}><span style={{fontSize:13}}>{c.ic} <span style={{color:c.tx,fontWeight:800}}>{t.lg}</span> <span style={{color:"#64748B"}}>T{t.t}</span></span><span style={{fontSize:13}}><span style={{color:"#F59E0B",fontWeight:800}}>+{t.tok.toLocaleString()} MF</span> <span style={{color:"#475569"}}>(${t.cost.toFixed(0)})</span></span></div>;})}</div>
          </div>}
        </>)}

        {/* ========== MIGRATION ========== */}
        {tab==="migration"&&(<>
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>📊 Scénario</h3>
            <div style={{display:"flex",gap:8,marginBottom:12}}>{[["conservative","🐢 Conservateur"],["moderate","⚖️ Modéré"],["aggressive","🚀 Agressif"]].map(([k,l])=>(<button key={k} onClick={()=>setScenario(k)} style={{flex:1,padding:10,fontSize:12,fontWeight:800,borderRadius:10,cursor:"pointer",border:scenario===k?"2px solid #2DD4BF":"2px solid #1E293B",background:scenario===k?"rgba(45,212,191,0.1)":"transparent",color:scenario===k?"#2DD4BF":"#64748B"}}>{l}</button>))}</div>
            <label style={lbl}>Projection: {projWeeks} semaines</label>
            <input type="range" min={8} max={52} value={projWeeks} onChange={e=>setProjWeeks(parseInt(e.target.value))} style={{width:"100%",accentColor:"#2DD4BF"}}/>
          </div>
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>👥 Évolution des marcheurs</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[...HI,...mig.slice(1)]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B"/><XAxis dataKey="label" tick={{fill:"#64748B",fontSize:9}} interval="preserveStartEnd"/><YAxis tick={{fill:"#64748B",fontSize:10}}/>
                <Tooltip contentStyle={{background:"#1E293B",border:"1px solid #334155",borderRadius:8,fontSize:11,color:"#E2E8F0"}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                {LG.map(lg=><Line key={lg} type="monotone" dataKey={lg} stroke={CL[lg].ln} strokeWidth={2} dot={false}/>)}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{...bx,marginBottom:16}}>
            <h3 style={sec}>📋 Données</h3>
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr><th style={th}>Période</th>{LG.map(l=><th key={l} style={{...th,color:CL[l].tx}}>{CL[l].ic}</th>)}<th style={th}>Total</th></tr></thead>
              <tbody>{mig.map((s,i)=>(<tr key={i}><td style={{...td,fontWeight:700,color:i===0?"#2DD4BF":"#94A3B8"}}>{s.label}</td>{LG.map(l=><td key={l} style={td}>{s[l].toLocaleString()}</td>)}<td style={{...td,fontWeight:700}}>{LG.reduce((sum,l)=>sum+s[l],0).toLocaleString()}</td></tr>))}</tbody>
            </table></div>
          </div>
        </>)}

        {/* FOOTER */}
        <div style={{textAlign:"center",padding:"24px 0",borderTop:"1px solid #1E293B"}}>
          <a href={AFF} target="_blank" rel="noopener noreferrer" style={{...cta,marginBottom:12,display:"inline-block"}}>🚀 Rejoindre Moonwalk</a>
          <p style={{fontSize:9,color:"#334155",lineHeight:1.6}}>Simulateur communautaire • Données Mars 2026 • ⚠️ Pas un conseil financier</p>
        </div>
      </div>
    </div>
  );
}

function SC({l,mf,usd}){return<div style={{background:"rgba(0,0,0,0.3)",borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:"#64748B",marginBottom:4}}>{l}</div><div style={{fontSize:22,fontWeight:900,color:"#2DD4BF"}}>{Math.round(mf).toLocaleString()}</div><div style={{fontSize:10,color:"#64748B"}}>MF</div><div style={{fontSize:14,fontWeight:700,color:"#68D391",marginTop:2}}>${usd.toFixed(2)}</div></div>;}

const cta={padding:"14px 36px",fontSize:16,fontWeight:800,background:"linear-gradient(135deg,#2DD4BF,#06B6D4)",color:"#0B1222",borderRadius:12,textDecoration:"none",boxShadow:"0 4px 20px rgba(45,212,191,0.3)"};
const bx={background:"#111827",border:"1px solid #1E293B",borderRadius:12,padding:16};
const sec={color:"#64748B",fontSize:11,margin:"0 0 12px",textTransform:"uppercase",letterSpacing:1.5};
const lbl={fontSize:10,color:"#64748B",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.5};
const sub={fontSize:10,color:"#64748B"};
const inp={width:"100%",padding:"8px 10px",background:"rgba(0,0,0,0.3)",border:"1px solid #1E293B",borderRadius:6,color:"#E2E8F0",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
const th={padding:"6px 8px",textAlign:"center",borderBottom:"1px solid #1E293B",color:"#64748B",fontSize:10,fontWeight:700};
const td={padding:"5px 8px",textAlign:"center",borderBottom:"1px solid #0F172A",color:"#94A3B8"};
