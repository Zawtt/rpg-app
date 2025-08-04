import{c as B,u as _,j as e,D as le,L as ie,R as ce,r as l,a as de,b as me,e as ue,f as pe,d as xe,C as he}from"./index-Bu_78DCR.js";import{S as be}from"./save-DXuXZxAN.js";import{T as fe}from"./trash-2-X3AAIp9C.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]],O=B("dices",ge);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],ye=B("history",ve);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],je=B("play",we),Ne=({type:p="default",size:o="md",message:s,className:x=""})=>{const a=_(),t={sm:"w-4 h-4",md:"w-6 h-6",lg:"w-8 h-8",xl:"w-12 h-12"},i={default:{icon:ie,animation:"animate-spin",color:a.classes.accent},dice:{icon:O,animation:"animate-bounce",color:a.classes.accent},saving:{icon:be,animation:"animate-pulse",color:a.classes.accent},loading:{icon:le,animation:"animate-pulse",color:a.classes.accent}},m=i[p]||i.default,k=m.icon;return e.jsxs("div",{className:`flex items-center gap-2 ${x}`,children:[e.jsx(k,{className:`${t[o]} ${m.color} ${m.animation}`}),s&&e.jsx("span",{className:`text-sm ${a.classes.textSecondary} font-medium`,children:s})]})},ke=({children:p,loading:o=!1,loadingText:s,loadingType:x="default",disabled:a,className:t="",...i})=>(_(),e.jsx("button",{...i,disabled:o||a,className:`
        flex items-center justify-center gap-2 transition-all duration-200
        ${o?"cursor-not-allowed opacity-75":""}
        ${t}
      `,children:o?e.jsxs(e.Fragment,{children:[e.jsx(Ne,{type:x,size:"sm"}),s||"Carregando..."]}):p})),$e=p=>{try{const o=p.replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(o))throw new Error("Expressão contém caracteres não permitidos");const s=o.match(/(\d+\.?\d*|[+\-*/()])/g);if(!s)throw new Error("Expressão inválida");return Ee(s)}catch(o){throw new Error(`Erro ao avaliar expressão: ${o.message}`)}},Ee=p=>{const o=[],s=[],x={"+":1,"-":1,"*":2,"/":2};for(let t of p)if(/^\d+\.?\d*$/.test(t))o.push(parseFloat(t));else if(t==="(")s.push(t);else if(t===")"){for(;s.length&&s[s.length-1]!=="(";)o.push(s.pop());s.pop()}else if(["+","-","*","/"].includes(t)){for(;s.length&&s[s.length-1]!=="("&&x[s[s.length-1]]>=x[t];)o.push(s.pop());s.push(t)}for(;s.length;)o.push(s.pop());const a=[];for(let t of o)if(typeof t=="number")a.push(t);else{const i=a.pop(),m=a.pop();switch(t){case"+":a.push(m+i);break;case"-":a.push(m-i);break;case"*":a.push(m*i);break;case"/":if(i===0)throw new Error("Divisão por zero");a.push(m/i);break;default:throw new Error(`Operador desconhecido: ${t}`)}}return Math.round(a[0]*100)/100};function Se({onRollStart:p,onRollEnd:o}){const[s,x]=l.useState(""),[a,t]=l.useState(null),[i,m]=l.useState([]),[k,P]=l.useState(!1),[f,D]=l.useState(!1),[M,$]=l.useState(null),[h,F]=l.useState(""),w=l.useRef(!1),Z=l.useRef(null),{ui:b,showToast:g,setLoading:z}=de(),{validateDiceExpression:E}=me(),{announce:v}=ue(),{playDiceRollSound:V,playDiceLandSound:Y}=pe(),L=xe(s,500),c=_();l.useEffect(()=>()=>{w.current=!1},[]),l.useEffect(()=>{if(L.trim()){const r=E(L);F(r.isValid?"":r.error)}else F("")},[L,E]);const ee=[{label:"1d2",value:"1d2",description:"Sim ou nao"},{label:"1d20",value:"1d20",description:"1d20 kkk"},{label:"1d50",value:"1d50",description:"vai se fuder"},{label:"1d100",value:"1d100",description:"boa sorte filhote"}];l.useCallback(r=>{const n=parseFloat(r);return isNaN(n)?"text-white":n===20?"text-green-400":n===1?"text-red-400":n>=15?"text-blue-400":"text-white"},[]);const y=l.useCallback(async(r=s)=>{if(w.current){g("Aguarde a rolagem anterior terminar","warning");return}const n=E(r);if(!n.isValid){g(n.error,"error"),v(`Erro na expressão: ${n.error}`);return}w.current=!0,z({rolling:!0}),p?.(),V(),t(null),D(!1);let u=0,j=r,S=!1;try{const d=/(\d*)d(\d+)/gi;let C=[];const N=r.replace(d,(A,Q,ne)=>{const H=Q?parseInt(Q,10):1,R=parseInt(ne,10);if(isNaN(H)||isNaN(R)||R<=0)throw S=!0,new Error(`Expressão inválida de dado: ${A}`);let J=0,U=[];for(let W=0;W<H;W++){const X=Math.floor(Math.random()*R)+1;U.push(X),J+=X}return C.push(`${H}d${R} [${U.join(", ")}]`),J}).replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(N))throw S=!0,new Error("Expressão contém caracteres inválidos após processamento dos dados.");u=$e(N),j=r,C.length>0&&(j+=` (${C.join(" + ")})`),j+=` = ${u}`,v(`Resultado da rolagem: ${u}`)}catch(d){console.error("Erro ao processar expressão de rolagem:",d),u="Erro na Expressão!",j=`Erro ao rolar '${r}': ${d.message}`,S=!0,g("Erro ao processar rolagem","error"),v(`Erro na rolagem: ${d.message}`)}$("?"),P(!0);const I=2e3,q=100,G=Date.now(),oe=()=>{if(!isNaN(u)&&typeof u=="number"){const d=Date.now()-G,T=1-Math.min(d/I,1),N=Math.max(1,Math.floor(u*(1-T*3))),A=Math.ceil(u*(1+T*3));return Math.floor(Math.random()*(A-N+1))+N}return u},K=setInterval(()=>{const d=Date.now()-G;$(oe()),d>=I-q&&(clearInterval(K),$(u))},q);await new Promise(d=>setTimeout(d,I)),clearInterval(K),P(!1),setTimeout(()=>{t(u),$(null),D(!0),S||m(d=>[j,...d].slice(0,10)),w.current=!1,z({rolling:!1}),o?.(),Y(),setTimeout(()=>D(!1),2e3)},100)},[s,E,g,v,z,p,o,V,Y]),ae=l.useCallback(r=>{x(r),y(r)},[y]),se=l.useCallback(()=>{window.confirm("Deseja limpar todo o histórico de rolagens?")&&(m([]),g("Histórico limpo","success"),v("Histórico de rolagens limpo"))},[g,v]),re=l.useCallback(r=>{const n=r.target.value;n.length<=100&&x(n)},[]),te=l.useCallback(r=>{r.key==="Enter"&&!w.current&&(r.preventDefault(),y())},[y]);return e.jsxs("div",{className:"bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden",children:[e.jsxs("div",{className:"p-6 border-b border-gray-800",children:[e.jsxs("h3",{className:"text-2xl font-storm-gust text-white flex items-center gap-3",children:[e.jsx(O,{size:24,className:"text-white"}),"DICE ROLLER"]}),e.jsx("div",{className:"w-20 h-0.5 bg-amber-500 mt-2"})]}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2",children:["Rolagens de Dados",e.jsx("span",{className:"text-amber-300/80 normal-case ml-2"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",value:s,onChange:re,onKeyPress:te,disabled:b.loading.rolling,className:`
                w-full px-4 py-3 rounded font-medieval text-amber-100 bg-gray-800/80 border border-amber-600/50 focus:outline-none focus:ring-2 transition-all duration-200 text-sm pr-12 placeholder-amber-400/60
                ${h?"bg-red-950/50 border-2 border-red-500 focus:ring-red-500":"focus:border-amber-500 focus:ring-amber-500"}
                ${b.loading.rolling?"opacity-50 cursor-not-allowed":""}
              `,placeholder:">",maxLength:100,"aria-invalid":h?"true":"false","aria-describedby":h?"expression-error":"expression-help"}),e.jsx("button",{onClick:()=>y(),disabled:b.loading.rolling||h!=="",className:`
                absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded transition-all duration-200
                ${b.loading.rolling||h?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-105"}
                text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50
              `,"aria-label":"Rolar dados",children:e.jsx(je,{size:16})})]}),e.jsx("div",{id:"expression-help",className:"text-xs font-medieval text-amber-300/80 mt-1"}),h&&e.jsxs("div",{id:"expression-error",className:"flex items-center gap-2 mt-2 text-red-400 text-sm",role:"alert",children:[e.jsx(he,{size:16,className:"text-red-400"}),e.jsxs("span",{children:["Expressão inválida: ",h]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:ee.map(r=>e.jsx("button",{onClick:()=>ae(r.value),disabled:b.loading.rolling,className:`
                  px-3 py-2 border rounded text-sm font-medieval font-medium transition-all duration-200
                  ${b.loading.rolling?"bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed opacity-50":"bg-gray-800/80 border-amber-600/50 text-amber-100 hover:bg-amber-900/50 hover:border-amber-500 hover:text-amber-50 hover:scale-105"}
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                `,title:r.description,"aria-label":`Rolar ${r.description}`,children:r.label},r.value))})]}),e.jsx(ke,{onClick:()=>y(),loading:b.loading.rolling,loadingText:"ROLANDO...",loadingType:"dice",disabled:h!=="",className:`
            w-full py-4 font-medieval font-bold rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500/50
            ${h?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-[1.02] text-white"}
          `,"aria-label":"Rolar dados com a expressão atual",children:e.jsx("div",{className:"flex items-center justify-center gap",children:e.jsx(O,{size:30})})}),e.jsxs("div",{ref:Z,className:`
            p-6 ${c.classes.card} border ${c.classes.cardBorder} rounded-lg text-center transition-all duration-700 ease-in-out relative overflow-hidden
            ${a!==null?"opacity-100 transform scale-100":"opacity-30 transform scale-95"}
            ${f?"ring-4 shadow-xl":""}
          `,style:{boxShadow:f?"0 0 20px var(--theme-dice-shadow)":"none",borderColor:f?"var(--theme-dice-color)":"rgb(55, 65, 81)"},role:"status","aria-live":"polite",children:[f&&e.jsx("div",{className:"absolute inset-0 opacity-10 dice-animation",style:{background:"radial-gradient(circle, var(--theme-dice-color) 0%, transparent 70%)"}}),e.jsx("div",{className:"text-xs font-medieval text-amber-400 uppercase tracking-wider mb-2 relative z-10",children:"🔻"}),e.jsx("div",{className:`dice-result text-5xl font-extrabold transition-all duration-500 relative z-10 ${f?"dice-animation":""}`,style:{textShadow:f?"0 0 10px var(--theme-dice-shadow)":"none"},children:a!==null?a:"?"}),a!==null&&typeof a=="number"&&e.jsxs("div",{className:"text-sm font-medieval text-amber-300 mt-1 relative z-10 font-medium",children:[a===1&&"nah bro💀",a===20&&"🎉CRITICO🎉",a>=15&&a<20&&"Boa!!!",a>=10&&a<15&&"Boa",a<10&&a>1&&"bruh"]})]}),e.jsxs("div",{className:`${c.classes.card} border ${c.classes.cardBorder} rounded-lg`,children:[e.jsxs("div",{className:`p-4 border-b ${c.classes.cardBorder} flex items-center justify-between`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ye,{size:16,className:c.classes.textSecondary}),e.jsx("h4",{className:`text-sm font-medium ${c.classes.text} uppercase tracking-wider`,children:e.jsx("h3",{className:"text-2xl font-storm-gust text-white-100 flex items-center gap-3",children:"Histórico"})}),e.jsxs("span",{className:`text-xs ${c.classes.textSecondary}`,children:["(",i.length,"/10)"]})]}),i.length>0&&e.jsxs("button",{onClick:se,className:`flex items-center gap-1 text-xs ${c.classes.textSecondary} hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1`,"aria-label":"Limpar histórico de rolagens",children:[e.jsx(fe,{size:12}),"Limpar"]})]}),e.jsx("div",{className:"p-4 max-h-48 overflow-y-auto custom-scrollbar",children:i.length===0?e.jsx("p",{className:`${c.classes.textSecondary} italic text-sm text-center py-4`,children:"Nenhuma rolagem"}):e.jsx("ul",{className:"space-y-2",role:"log","aria-label":"Histórico",children:i.map((r,n)=>e.jsx("li",{className:`
                      ${c.classes.textSecondary} text-sm font-mono ${c.classes.input} p-3 rounded border-l-2 transition-all duration-200
                      ${n===0?"border-orange-500/50 bg-white-500/5":`${c.classes.cardBorder} hover:border-gray-500/50`}
                    `,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{children:r}),n===0&&e.jsx("span",{className:"text-xs text-orange-400 font-bold ml-2",children:"ÚLTIMO"})]})},`${r}-${n}`))})})]})]}),k&&e.jsx("div",{className:"absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-40 animate-fade-in",children:e.jsxs("div",{className:"text-center relative",children:[e.jsx("div",{className:"absolute inset-0 blur-2xl opacity-70 dice-animation",style:{backgroundColor:"rgba(0,0,0,0.5)",boxShadow:"0 0 40px var(--theme-dice-shadow), 0 0 80px var(--theme-dice-shadow)"}}),e.jsx("div",{className:"dice-result text-9xl font-extrabold mb-6 relative z-10 dice-animation",style:{textShadow:"0 0 20px var(--theme-dice-shadow), 0 0 40px var(--theme-dice-shadow)"},children:M}),e.jsx("div",{className:"text-xl text-gray-300 animate-pulse relative z-10",children:"Boa sorte"}),e.jsx("div",{className:"mt-6 flex justify-center space-x-3 relative z-10",children:[...Array(5)].map((r,n)=>e.jsx("div",{className:"w-3 h-3 rounded-full animate-bounce",style:{animationDelay:`${n*.15}s`,animationDuration:"0.6s",backgroundColor:"var(--theme-dice-color)",boxShadow:"0 0 10px var(--theme-dice-shadow)"}},n))})]})}),M!==null&&!k&&e.jsx("div",{className:"absolute inset-0 pointer-events-none z-40",children:e.jsx("div",{className:"animate-move-to-result text-4xl font-extrabold text-white flex items-center justify-center h-full filter drop-shadow-lg",children:M})}),e.jsx("style",{children:`
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
      `})]})}const Me=ce.memo(Se);export{Me as default};
