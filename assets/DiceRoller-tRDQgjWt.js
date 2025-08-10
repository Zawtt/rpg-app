import{c as B,u as _,j as e,D as ie,L as ce,R as de,r as l,a as me,b as ue,e as pe,f as he,d as xe,C as fe}from"./index-BxyrPdyw.js";import{S as be}from"./save-DBX8JKZ-.js";import{T as ge}from"./trash-2-B_f98HJz.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]],O=B("dices",ve);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],we=B("history",ye);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],Ne=B("play",je),ke=({type:u="default",size:s="md",message:a,className:i=""})=>{const t=_(),o={sm:"w-4 h-4",md:"w-6 h-6",lg:"w-8 h-8",xl:"w-12 h-12"},c={default:{icon:ce,animation:"animate-spin",color:t.classes.accent},dice:{icon:O,animation:"animate-bounce",color:t.classes.accent},saving:{icon:be,animation:"animate-pulse",color:t.classes.accent},loading:{icon:ie,animation:"animate-pulse",color:t.classes.accent}},p=c[u]||c.default,k=p.icon;return e.jsxs("div",{className:`flex items-center gap-2 ${i}`,children:[e.jsx(k,{className:`${o[s]} ${p.color} ${p.animation}`}),a&&e.jsx("span",{className:`text-sm ${t.classes.textSecondary} font-medium`,children:a})]})},Ee=({children:u,loading:s=!1,loadingText:a,loadingType:i="default",disabled:t,className:o="",...c})=>(_(),e.jsx("button",{...c,disabled:s||t,className:`
        flex items-center justify-center gap-2 transition-all duration-200
        ${s?"cursor-not-allowed opacity-75":""}
        ${o}
      `,children:s?e.jsxs(e.Fragment,{children:[e.jsx(ke,{type:i,size:"sm"}),a||"Carregando..."]}):u}));class $e{constructor(){this.entropyPool=new Uint32Array(16),this.poolIndex=0,this.lastTime=performance.now(),this.refillEntropyPool(),this.setupEntropyCollection()}refillEntropyPool(){if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(this.entropyPool);else for(let s=0;s<this.entropyPool.length;s++)this.entropyPool[s]=Math.floor(Math.random()*4294967295);this.poolIndex=0}setupEntropyCollection(){let s=0;const a=i=>{const t=performance.now(),o=t-this.lastTime;this.lastTime=t,s=(s+i.clientX+i.clientY+o)%4294967295,Math.random()<.1&&(this.entropyPool[this.poolIndex]^=s,this.poolIndex=(this.poolIndex+1)%this.entropyPool.length)};window.addEventListener("mousemove",a,{passive:!0}),window.addEventListener("click",a,{passive:!0}),window.addEventListener("keydown",a,{passive:!0})}next(){this.poolIndex>=this.entropyPool.length-1&&this.refillEntropyPool();let s=this.entropyPool[this.poolIndex++];const a=performance.now()*1e6;return s^=Math.floor(a)%4294967295,s=this.simpleHash(s),(s>>>0)/4294967296}simpleHash(s){return s=(s>>>16^s)*73244475,s=(s>>>16^s)*73244475,s=s>>>16^s,s}rollDice(s){const a=Math.floor(4294967296/s)*s;let i;do i=Math.floor(this.next()*4294967296);while(i>=a);return i%s+1}}const Re=u=>{try{const s=u.replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(s))throw new Error("Expressão contém caracteres não permitidos");const a=s.match(/(\d+\.?\d*|[+\-*/()])/g);if(!a)throw new Error("Expressão inválida");return De(a)}catch(s){throw new Error(`Erro ao avaliar expressão: ${s.message}`)}},De=u=>{const s=[],a=[],i={"+":1,"-":1,"*":2,"/":2};for(let o of u)if(/^\d+\.?\d*$/.test(o))s.push(parseFloat(o));else if(o==="(")a.push(o);else if(o===")"){for(;a.length&&a[a.length-1]!=="(";)s.push(a.pop());a.pop()}else if(["+","-","*","/"].includes(o)){for(;a.length&&a[a.length-1]!=="("&&i[a[a.length-1]]>=i[o];)s.push(a.pop());a.push(o)}for(;a.length;)s.push(a.pop());const t=[];for(let o of s)if(typeof o=="number")t.push(o);else{const c=t.pop(),p=t.pop();switch(o){case"+":t.push(p+c);break;case"-":t.push(p-c);break;case"*":t.push(p*c);break;case"/":if(c===0)throw new Error("Divisão por zero");t.push(p/c);break;default:throw new Error(`Operador desconhecido: ${o}`)}}return Math.round(t[0]*100)/100};function Ce({onRollStart:u,onRollEnd:s}){const[a,i]=l.useState(""),[t,o]=l.useState(null),[c,p]=l.useState([]),[k,V]=l.useState(!1),[b,M]=l.useState(!1),[L,E]=l.useState(null),[x,G]=l.useState(""),w=l.useRef(!1),ee=l.useRef(null),I=l.useMemo(()=>new $e,[]),{ui:f,showToast:g,setLoading:z}=me(),{validateDiceExpression:$}=ue(),{announce:v}=pe(),{playDiceRollSound:F,playDiceLandSound:Y}=he(),P=xe(a,500),m=_();l.useEffect(()=>()=>{w.current=!1},[]),l.useEffect(()=>{if(P.trim()){const r=$(P);G(r.isValid?"":r.error)}else G("")},[P,$]);const se=[{label:"1d2",value:"1d2",description:"Sim ou não"},{label:"1d20",value:"1d20",description:"D20 clássico"},{label:"1d50",value:"1d50",description:"Desafio médio"},{label:"1d100",value:"1d100",description:"Percentual"}];l.useCallback(r=>{const n=parseFloat(r);return isNaN(n)?"text-white":n===20?"text-green-400":n===1?"text-red-400":n>=15?"text-blue-400":"text-white"},[]);const y=l.useCallback(async(r=a)=>{if(w.current){g("Aguarde a rolagem anterior terminar","warning");return}const n=$(r);if(!n.isValid){g(n.error,"error"),v(`Erro na expressão: ${n.error}`);return}w.current=!0,z({rolling:!0}),u?.(),F(),o(null),M(!1);let h=0,j=r,R=!1;try{const d=/(\d*)d(\d+)/gi;let D=[];const N=r.replace(d,(U,C,le)=>{const H=C?parseInt(C,10):1,S=parseInt(le,10);if(isNaN(H)||isNaN(S)||S<=0)throw R=!0,new Error(`Expressão inválida de dado: ${U}`);let X=0,J=[];for(let W=0;W<H;W++){const Z=I.rollDice(S);J.push(Z),X+=Z}return D.push(`${H}d${S} [${J.join(", ")}]`),X}).replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(N))throw R=!0,new Error("Expressão contém caracteres inválidos após processamento dos dados.");h=Re(N),j=r,D.length>0&&(j+=` (${D.join(" + ")})`),j+=` = ${h}`,v(`Resultado da rolagem: ${h}`)}catch(d){console.error("Erro ao processar expressão de rolagem:",d),h="Erro na Expressão!",j=`Erro ao rolar '${r}': ${d.message}`,R=!0,g("Erro ao processar rolagem","error"),v(`Erro na rolagem: ${d.message}`)}E("?"),V(!0);const T=2e3,q=100,K=Date.now(),ne=()=>{if(!isNaN(h)&&typeof h=="number"){const d=Date.now()-K,A=1-Math.min(d/T,1),N=Math.max(1,Math.floor(h*(1-A*3))),C=Math.ceil(h*(1+A*3))-N+1;return N+I.rollDice(C)-1}return h},Q=setInterval(()=>{const d=Date.now()-K;E(ne()),d>=T-q&&(clearInterval(Q),E(h))},q);await new Promise(d=>setTimeout(d,T)),clearInterval(Q),V(!1),setTimeout(()=>{o(h),E(null),M(!0),R||p(d=>[j,...d].slice(0,10)),w.current=!1,z({rolling:!1}),s?.(),Y(),setTimeout(()=>M(!1),2e3)},100)},[a,$,g,v,z,u,s,F,Y,I]),ae=l.useCallback(r=>{i(r),y(r)},[y]),te=l.useCallback(()=>{window.confirm("Deseja limpar todo o histórico de rolagens?")&&(p([]),g("Histórico limpo","success"),v("Histórico de rolagens limpo"))},[g,v]),re=l.useCallback(r=>{const n=r.target.value;n.length<=100&&i(n)},[]),oe=l.useCallback(r=>{r.key==="Enter"&&!w.current&&(r.preventDefault(),y())},[y]);return e.jsxs("div",{className:"bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden",children:[e.jsx("div",{className:"p-6 border-b border-gray-800",children:e.jsx("div",{className:"flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-2xl font-storm-gust text-white flex items-center gap-3",children:[e.jsx(O,{size:24,className:"text-white"}),"DICE ROLLER"]}),e.jsx("div",{className:"w-20 h-0.5 bg-amber-500 mt-2"})]})})}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2",children:"Rolagens de Dados"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",value:a,onChange:re,onKeyPress:oe,disabled:f.loading.rolling,className:`
                w-full px-4 py-3 rounded font-medieval text-amber-100 bg-gray-800/80 border border-amber-600/50 focus:outline-none focus:ring-2 transition-all duration-200 text-sm pr-12 placeholder-amber-400/60
                ${x?"bg-red-950/50 border-2 border-red-500 focus:ring-red-500":"focus:border-amber-500 focus:ring-amber-500"}
                ${f.loading.rolling?"opacity-50 cursor-not-allowed":""}
              `,placeholder:"Ex: 1d20+5, 2d6+3, 3d8",maxLength:100,"aria-invalid":x?"true":"false","aria-describedby":x?"expression-error":"expression-help"}),e.jsx("button",{onClick:()=>y(),disabled:f.loading.rolling||x!=="",className:`
                absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded transition-all duration-200
                ${f.loading.rolling||x?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-105"}
                text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50
              `,"aria-label":"Rolar dados",children:e.jsx(Ne,{size:16})})]}),e.jsx("div",{id:"expression-help",className:"text-xs font-medieval text-amber-300/80 mt-1"}),x&&e.jsxs("div",{id:"expression-error",className:"flex items-center gap-2 mt-2 text-red-400 text-sm",role:"alert",children:[e.jsx(fe,{size:16,className:"text-red-400"}),e.jsxs("span",{children:["Expressão inválida: ",x]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2",children:"Rolagens Rápidas"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:se.map(r=>e.jsx("button",{onClick:()=>ae(r.value),disabled:f.loading.rolling,className:`
                  px-3 py-2 border rounded text-sm font-medieval font-medium transition-all duration-200
                  ${f.loading.rolling?"bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed opacity-50":"bg-gray-800/80 border-amber-600/50 text-amber-100 hover:bg-amber-900/50 hover:border-amber-500 hover:text-amber-50 hover:scale-105"}
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                `,title:r.description,"aria-label":`Rolar ${r.description}`,children:r.label},r.value))})]}),e.jsx(Ee,{onClick:()=>y(),loading:f.loading.rolling,loadingText:"ROLANDO...",loadingType:"dice",disabled:x!=="",className:`
            w-full py-4 font-medieval font-bold rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500/50
            ${x?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-[1.02] text-white"}
          `,"aria-label":"Rolar dados com a expressão atual",children:e.jsxs("div",{className:"flex items-center justify-center gap",children:[e.jsx(O,{size:30}),e.jsx("span",{className:"text-sm"})]})}),e.jsxs("div",{ref:ee,className:`
            p-6 ${m.classes.card} border ${m.classes.cardBorder} rounded-lg text-center transition-all duration-700 ease-in-out relative overflow-hidden
            ${t!==null?"opacity-100 transform scale-100":"opacity-30 transform scale-95"}
            ${b?"ring-4 shadow-xl":""}
          `,style:{boxShadow:b?"0 0 20px var(--theme-dice-shadow)":"none",borderColor:b?"var(--theme-dice-color)":"rgb(55, 65, 81)"},role:"status","aria-live":"polite",children:[b&&e.jsx("div",{className:"absolute inset-0 opacity-10 dice-animation",style:{background:"radial-gradient(circle, var(--theme-dice-color) 0%, transparent 70%)"}}),e.jsx("div",{className:"text-xs font-medieval text-amber-400 uppercase tracking-wider mb-2 relative z-10",children:"RESULTADO"}),e.jsx("div",{className:`dice-result text-5xl font-extrabold transition-all duration-500 relative z-10 ${b?"dice-animation":""}`,style:{textShadow:b?"0 0 10px var(--theme-dice-shadow)":"none"},children:t!==null?t:"?"}),t!==null&&typeof t=="number"&&e.jsxs("div",{className:"text-sm font-medieval text-amber-300 mt-1 relative z-10 font-medium",children:[t===1&&"nah bro💀",t===20&&"🎉CRITICO🎉",t>=15&&t<20&&"Boa!!!",t>=10&&t<15&&"Boa",t<10&&t>1&&"bruh"]})]}),e.jsxs("div",{className:`${m.classes.card} border ${m.classes.cardBorder} rounded-lg`,children:[e.jsxs("div",{className:`p-4 border-b ${m.classes.cardBorder} flex items-center justify-between`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(we,{size:16,className:m.classes.textSecondary}),e.jsx("h3",{className:"text-2xl font-storm-gust text-white-100 flex items-center gap-3",children:"Histórico"}),e.jsxs("span",{className:`text-xs ${m.classes.textSecondary}`,children:["(",c.length,"/10)"]})]}),c.length>0&&e.jsxs("button",{onClick:te,className:`flex items-center gap-1 text-xs ${m.classes.textSecondary} hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1`,"aria-label":"Limpar histórico de rolagens",children:[e.jsx(ge,{size:12}),"Limpar"]})]}),e.jsx("div",{className:"p-4 max-h-48 overflow-y-auto custom-scrollbar",children:c.length===0?e.jsx("p",{className:`${m.classes.textSecondary} italic text-sm text-center py-4`,children:"Nenhuma Rolagem ainda"}):e.jsx("ul",{className:"space-y-2",role:"log","aria-label":"Histórico",children:c.map((r,n)=>e.jsx("li",{className:`
                      ${m.classes.textSecondary} text-sm font-mono ${m.classes.input} p-3 rounded border-l-2 transition-all duration-200
                      ${n===0?"border-orange-500/50 bg-orange-500/5":`${m.classes.cardBorder} hover:border-gray-500/50`}
                    `,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{children:r}),n===0&&e.jsx("span",{className:"text-xs text-orange-400 font-bold ml-2",children:"ÚLTIMO"})]})},`${r}-${n}`))})})]})]}),k&&e.jsx("div",{className:"absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-40 animate-fade-in",children:e.jsxs("div",{className:"text-center relative",children:[e.jsx("div",{className:"absolute inset-0 blur-2xl opacity-70 dice-animation",style:{backgroundColor:"rgba(0,0,0,0.5)",boxShadow:"0 0 40px var(--theme-dice-shadow), 0 0 80px var(--theme-dice-shadow)"}}),e.jsx("div",{className:"dice-result text-9xl font-extrabold mb-6 relative z-10 dice-animation",style:{textShadow:"0 0 20px var(--theme-dice-shadow), 0 0 40px var(--theme-dice-shadow)"},children:L}),e.jsx("div",{className:"text-xl text-gray-300 animate-pulse relative z-10",children:"Boa sorte"}),e.jsx("div",{className:"mt-6 flex justify-center space-x-3 relative z-10",children:[...Array(5)].map((r,n)=>e.jsx("div",{className:"w-3 h-3 rounded-full animate-bounce",style:{animationDelay:`${n*.15}s`,animationDuration:"0.6s",backgroundColor:["#4ecdc4","#44a08d","#ff6b6b","#f59e0b","#8b5cf6"][n],boxShadow:`0 0 10px ${["#4ecdc4","#44a08d","#ff6b6b","#f59e0b","#8b5cf6"][n]}`}},n))}),e.jsx("div",{className:"mt-4 text-xs text-gray-400 relative z-10",children:e.jsxs("div",{className:"flex justify-center space-x-4",children:[e.jsx("span",{className:"text-green-400",children:"🔐 Crypto"}),e.jsx("span",{className:"text-blue-400",children:"⚡ XorShift"}),e.jsx("span",{className:"text-purple-400",children:"🖱️ Mouse"}),e.jsx("span",{className:"text-yellow-400",children:"⏰ Time"}),e.jsx("span",{className:"text-red-400",children:"🎲 LCG"})]})})]})}),L!==null&&!k&&e.jsx("div",{className:"absolute inset-0 pointer-events-none z-40",children:e.jsx("div",{className:"animate-move-to-result text-4xl font-extrabold text-white flex items-center justify-center h-full filter drop-shadow-lg",children:L})}),e.jsx("style",{children:`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          50% { 
            transform: translateY(-20px) scale(1.05);
          }
        }
        
        @keyframes move-to-result {
          from {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
          }
          to {
            transform: translate(0, 150px) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
          }
        }
        
        @keyframes hybrid-glow {
          0%, 100% {
            box-shadow: 0 0 10px #4ecdc4, 0 0 20px #4ecdc4, 0 0 30px #4ecdc4;
          }
          25% {
            box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 30px #ff6b6b;
          }
          50% {
            box-shadow: 0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b;
          }
          75% {
            box-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        
        .animate-move-to-result {
          position: absolute;
          top: 50%;
          left: 50%;
          animation: move-to-result 1s ease-out forwards;
        }

        /* Pulse animation para loading states */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
          }
        }

        /* Melhorias de acessibilidade */
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce-slow,
          .animate-move-to-result,
          .animate-fade-in {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.1s !important;
          }
        }

        /* Hover effects aprimorados */
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Custom scrollbar para histórico */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }

        /* Animação para dados */
        .dice-animation {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .dice-result {
          color: var(--theme-dice-color, #f59e0b);
        }
      `})]})}const Ie=de.memo(Ce);export{Ie as default};
