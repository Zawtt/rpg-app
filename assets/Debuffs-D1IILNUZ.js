import{c as p,a as h,u as v,r as g,j as e,X as j}from"./index-BxyrPdyw.js";import{P as y}from"./plus-B4I-7Dc4.js";import{C as N}from"./clock-DP9e3d7p.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",key:"1o5pge"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}]],C=p("skull",w);function D(){const{debuffs:a,setDebuffs:i,showToast:l}=h(),o=v(),[r,c]=g.useState({name:"",turns:1}),d=[{bg:"bg-amber-600",border:"border-amber-500",text:"text-amber-400"},{bg:"bg-orange-600",border:"border-orange-500",text:"text-orange-400"},{bg:"bg-yellow-600",border:"border-yellow-500",text:"text-yellow-400"},{bg:"bg-red-600",border:"border-red-500",text:"text-red-400"},{bg:"bg-rose-600",border:"border-rose-500",text:"text-rose-400"},{bg:"bg-stone-600",border:"border-stone-500",text:"text-stone-400"},{bg:"bg-neutral-600",border:"border-neutral-500",text:"text-neutral-400"},{bg:"bg-zinc-600",border:"border-zinc-500",text:"text-zinc-400"}],x=()=>d[Math.floor(Math.random()*d.length)],m=()=>{if(r.name.trim()&&r.turns>0){const t={id:Date.now(),name:r.name.trim(),turns:parseInt(r.turns),maxTurns:parseInt(r.turns),color:x()};i([...a,t]),c({name:"",turns:1}),l(`Debuff "${t.name}" adicionado!`,"warning")}},b=t=>{const n=a.find(s=>s.id===t);i(a.filter(s=>s.id!==t)),n&&l(`Debuff "${n.name}" removido`,"success")},f=t=>{const n=a.map(s=>{if(s.id===t){const u=s.turns-1;return u<=0?(l(`Debuff "${s.name}" expirou!`,"success"),null):{...s,turns:u}}return s}).filter(Boolean);i(n)};return e.jsxs("div",{className:`debuffs-container ${o.classes.card} backdrop-blur-sm rounded-lg border ${o.classes.cardBorder} shadow-xl`,children:[e.jsx("div",{className:`p-4 border-b ${o.classes.cardBorder}`,children:e.jsxs("h3",{className:"font-semibold font-medieval text-amber-100 flex items-center gap-2",children:[e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",className:"text-amber-400",children:[e.jsxs("circle",{cx:"12",cy:"12",r:"3",fill:"currentColor",children:[e.jsx("animate",{attributeName:"r",values:"3;6;3",dur:"2s",repeatCount:"indefinite"}),e.jsx("animate",{attributeName:"opacity",values:"1;0.3;1",dur:"2s",repeatCount:"indefinite"})]}),e.jsx("circle",{cx:"12",cy:"12",r:"8",fill:"none",stroke:"currentColor",strokeWidth:"1",opacity:"0.5",children:e.jsx("animate",{attributeName:"stroke-dasharray",values:"0,50;25,25;50,0",dur:"3s",repeatCount:"indefinite"})})]}),e.jsx(C,{size:16,className:"text-amber-400"}),"Debuffs"]})}),e.jsxs("div",{className:"p-4 space-y-4",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("div",{children:e.jsx("input",{type:"text",value:r.name,onChange:t=>c({...r,name:t.target.value}),onKeyPress:t=>t.key==="Enter"&&m(),className:`w-full px-3 py-2 ${o.classes.input} border ${o.classes.cardBorder} rounded font-medieval text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm`,placeholder:"Nome do debuff..."})}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{type:"number",value:r.turns,onChange:t=>c({...r,turns:t.target.value}),min:"1",className:`w-20 px-3 py-2 ${o.classes.input} border ${o.classes.cardBorder} rounded font-medieval text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm`,placeholder:"Turnos"}),e.jsxs("button",{onClick:m,className:"button-safe flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors flex items-center justify-center gap-1 text-sm font-medium font-medieval",children:[e.jsx(y,{size:14}),"Add"]})]})]}),e.jsx("div",{className:"space-y-2 max-h-64 overflow-y-auto custom-scrollbar",children:a.length===0?e.jsx("p",{className:"text-amber-400/60 text-sm italic text-center py-4 font-medieval",children:"Nenhum debuff ativo"}):a.map(t=>e.jsxs("div",{className:`debuff-item p-3 ${t.color.bg}/20 rounded border ${t.color.border}/30 cursor-pointer hover:${t.color.bg}/30 transition-colors`,onClick:()=>f(t.id),children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex-1 min-w-0 pr-2",children:[e.jsx("div",{className:`font-medium font-medieval ${t.color.text} text-sm break-words`,children:t.name}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-amber-400/60 mt-1 font-medieval",children:[e.jsx(N,{size:10}),e.jsxs("span",{children:[t.turns," turnos restantes"]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-shrink-0",children:[e.jsx("div",{className:`text-2xl font-bold ${t.color.text}`,children:t.turns}),e.jsx("button",{onClick:n=>{n.stopPropagation(),b(t.id)},className:"button-safe p-1 text-gray-500 hover:text-red-400 transition-colors",children:e.jsx(j,{size:14})})]})]}),e.jsx("div",{className:"text-xs text-amber-400/50 mt-2 italic font-medieval",children:"Clique para reduzir turno"})]},t.id))})]}),e.jsx("style",{children:`
        .debuffs-container {
          position: relative;
          z-index: 25;
          isolation: isolate;
        }

        .debuff-item {
          position: relative;
          z-index: 26;
          overflow: visible;
          contain: layout style;
        }

        /* Garante que botões não saiam do container */
        .button-safe {
          position: relative;
          z-index: 27;
          isolation: isolate;
          min-width: 0;
          white-space: nowrap;
        }

        /* Garante que elementos não sejam cortados */
        .debuffs-container * {
          overflow: visible;
        }

        /* Container específico para botões */
        .debuffs-container .flex {
          overflow: visible;
          align-items: stretch;
        }

        /* Fix para hover states que podem causar problemas */
        .debuff-item:hover {
          transform: translateZ(0);
        }
      `})]})}export{D as default};
