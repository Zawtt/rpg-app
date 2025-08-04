import{c as V,u as G,j as e,D as le,L as ce,R as de,r as c,a as me,b as ue,e as pe,f as xe,d as he,C as fe}from"./index-C--PV945.js";import{S as be}from"./save-BQGPMF7D.js";import{T as ge}from"./trash-2-DvpI9gU9.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["rect",{width:"12",height:"12",x:"2",y:"10",rx:"2",ry:"2",key:"6agr2n"}],["path",{d:"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",key:"1o487t"}],["path",{d:"M6 18h.01",key:"uhywen"}],["path",{d:"M10 14h.01",key:"ssrbsk"}],["path",{d:"M15 6h.01",key:"cblpky"}],["path",{d:"M18 9h.01",key:"2061c0"}]],B=V("dices",ye);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],we=V("history",ve);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],Ne=V("play",je),Ee=({type:p="default",size:t="md",message:s,className:i=""})=>{const a=G(),o={sm:"w-4 h-4",md:"w-6 h-6",lg:"w-8 h-8",xl:"w-12 h-12"},l={default:{icon:ce,animation:"animate-spin",color:a.classes.accent},dice:{icon:B,animation:"animate-bounce",color:a.classes.accent},saving:{icon:be,animation:"animate-pulse",color:a.classes.accent},loading:{icon:le,animation:"animate-pulse",color:a.classes.accent}},d=l[p]||l.default,x=d.icon;return e.jsxs("div",{className:`flex items-center gap-2 ${i}`,children:[e.jsx(x,{className:`${o[t]} ${d.color} ${d.animation}`}),s&&e.jsx("span",{className:`text-sm ${a.classes.textSecondary} font-medium`,children:s})]})},ke=({children:p,loading:t=!1,loadingText:s,loadingType:i="default",disabled:a,className:o="",...l})=>(G(),e.jsx("button",{...l,disabled:t||a,className:`
        flex items-center justify-center gap-2 transition-all duration-200
        ${t?"cursor-not-allowed opacity-75":""}
        ${o}
      `,children:t?e.jsxs(e.Fragment,{children:[e.jsx(Ee,{type:i,size:"sm"}),s||"Carregando..."]}):p}));class $e{constructor(){this.xorshiftState=Date.now(),this.lcgState=Math.floor(Math.random()*2147483647),this.systemEntropy={time:Date.now(),memory:performance?.memory?.usedJSHeapSize||0,timeOrigin:performance.timeOrigin||0,devicePixelRatio:window.devicePixelRatio||1,screenSize:window.screen.width*window.screen.height||1e3,navigatorData:JSON.stringify(navigator.userAgent).length},this.mouseEntropy={x:0,y:0,timestamp:Date.now()},this.setupMouseEntropyCollection()}setupMouseEntropyCollection(){const t=s=>{this.mouseEntropy={x:s.clientX,y:s.clientY,timestamp:Date.now()}};window.addEventListener("mousemove",t,{passive:!0})}nextXorShift(){let t=this.xorshiftState;return t^=t<<13,t^=t>>17,t^=t<<5,this.xorshiftState=t,(t<0?~t+1:t)%1e6/1e6}nextLCG(){return this.lcgState=(1664525*this.lcgState+1013904223)%2147483647,this.lcgState/2147483647}getCryptoRandom(){if(window.crypto&&window.crypto.getRandomValues){const t=new Uint32Array(1);return window.crypto.getRandomValues(t),t[0]/4294967295}return Math.random()}getSystemEntropy(){const t=Date.now(),s=t-this.systemEntropy.time;return this.systemEntropy.time=t,(t%1e3/1e3+s%100/100+performance.now()%1e3/1e3+this.systemEntropy.navigatorData%1e3/1e3)/4}getMouseEntropy(){const s=Date.now()-this.mouseEntropy.timestamp;return(this.mouseEntropy.x%100/100+this.mouseEntropy.y%100/100+s%1e3/1e3)/3}next(){const t={crypto:.35,xorshift:.2,lcg:.1,mathRandom:.1,mouseEntropy:.1,timeEntropy:.05,systemEntropy:.1},s={crypto:this.getCryptoRandom(),xorshift:this.nextXorShift(),lcg:this.nextLCG(),mathRandom:Math.random(),mouseEntropy:this.getMouseEntropy(),timeEntropy:Date.now()%1e3/1e3,systemEntropy:this.getSystemEntropy()};let i=0;for(const[a,o]of Object.entries(t))i+=s[a]*o;return i%1}rollDice(t){return Math.floor(this.next()*t)+1}testDistribution(t,s=1e4){const i=new Array(t+1).fill(0),a=s/t;for(let x=0;x<s;x++){const g=this.rollDice(t);i[g]++}let o=0;for(let x=1;x<=t;x++){const g=Math.abs(i[x]-a)/a;o+=g}const l=o/t*100,d=100-l;return{counts:i.slice(1),expected:a,avgDeviation:l,qualityScore:d,iterations:s}}}const Se=p=>{try{const t=p.replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(t))throw new Error("Expressão contém caracteres não permitidos");const s=t.match(/(\d+\.?\d*|[+\-*/()])/g);if(!s)throw new Error("Expressão inválida");return De(s)}catch(t){throw new Error(`Erro ao avaliar expressão: ${t.message}`)}},De=p=>{const t=[],s=[],i={"+":1,"-":1,"*":2,"/":2};for(let o of p)if(/^\d+\.?\d*$/.test(o))t.push(parseFloat(o));else if(o==="(")s.push(o);else if(o===")"){for(;s.length&&s[s.length-1]!=="(";)t.push(s.pop());s.pop()}else if(["+","-","*","/"].includes(o)){for(;s.length&&s[s.length-1]!=="("&&i[s[s.length-1]]>=i[o];)t.push(s.pop());s.push(o)}for(;s.length;)t.push(s.pop());const a=[];for(let o of t)if(typeof o=="number")a.push(o);else{const l=a.pop(),d=a.pop();switch(o){case"+":a.push(d+l);break;case"-":a.push(d-l);break;case"*":a.push(d*l);break;case"/":if(l===0)throw new Error("Divisão por zero");a.push(d/l);break;default:throw new Error(`Operador desconhecido: ${o}`)}}return Math.round(a[0]*100)/100};function Re({onRollStart:p,onRollEnd:t}){const[s,i]=c.useState(""),[a,o]=c.useState(null),[l,d]=c.useState([]),[x,g]=c.useState(!1),[y,L]=c.useState(!1),[z,$]=c.useState(null),[f,_]=c.useState(""),N=c.useRef(!1),ee=c.useRef(null),A=c.useMemo(()=>new $e,[]),{ui:b,showToast:v,setLoading:O}=me(),{validateDiceExpression:S}=ue(),{announce:w}=pe(),{playDiceRollSound:F,playDiceLandSound:X}=xe(),I=he(s,500),u=G();c.useEffect(()=>()=>{N.current=!1},[]),c.useEffect(()=>{if(I.trim()){const r=S(I);_(r.isValid?"":r.error)}else _("")},[I,S]);const te=[{label:"1d2",value:"1d2",description:"Sim ou não"},{label:"1d20",value:"1d20",description:"D20 clássico"},{label:"1d50",value:"1d50",description:"Desafio médio"},{label:"1d100",value:"1d100",description:"Percentual"}];c.useCallback(r=>{const n=parseFloat(r);return isNaN(n)?"text-white":n===20?"text-green-400":n===1?"text-red-400":n>=15?"text-blue-400":"text-white"},[]);const j=c.useCallback(async(r=s)=>{if(N.current){v("Aguarde a rolagem anterior terminar","warning");return}const n=S(r);if(!n.isValid){v(n.error,"error"),w(`Erro na expressão: ${n.error}`);return}N.current=!0,O({rolling:!0}),p?.(),F(),o(null),L(!1);let h=0,E=r,D=!1;try{const m=/(\d*)d(\d+)/gi;let R=[];const k=r.replace(m,(J,C,ie)=>{const P=C?parseInt(C,10):1,M=parseInt(ie,10);if(isNaN(P)||isNaN(M)||M<=0)throw D=!0,new Error(`Expressão inválida de dado: ${J}`);let K=0,Q=[];for(let W=0;W<P;W++){const Z=A.rollDice(M);Q.push(Z),K+=Z}return R.push(`${P}d${M} [${Q.join(", ")}]`),K}).replace(/\s/g,"");if(!/^[0-9+\-*/().]+$/.test(k))throw D=!0,new Error("Expressão contém caracteres inválidos após processamento dos dados.");h=Se(k),E=r,R.length>0&&(E+=` (${R.join(" + ")})`),E+=` = ${h}`,w(`Resultado da rolagem: ${h}`)}catch(m){console.error("Erro ao processar expressão de rolagem:",m),h="Erro na Expressão!",E=`Erro ao rolar '${r}': ${m.message}`,D=!0,v("Erro ao processar rolagem","error"),w(`Erro na rolagem: ${m.message}`)}$("?"),g(!0);const T=2e3,Y=100,q=Date.now(),ne=()=>{if(!isNaN(h)&&typeof h=="number"){const m=Date.now()-q,H=1-Math.min(m/T,1),k=Math.max(1,Math.floor(h*(1-H*3))),C=Math.ceil(h*(1+H*3))-k+1;return k+A.rollDice(C)-1}return h},U=setInterval(()=>{const m=Date.now()-q;$(ne()),m>=T-Y&&(clearInterval(U),$(h))},Y);await new Promise(m=>setTimeout(m,T)),clearInterval(U),g(!1),setTimeout(()=>{o(h),$(null),L(!0),D||d(m=>[E,...m].slice(0,10)),N.current=!1,O({rolling:!1}),t?.(),X(),setTimeout(()=>L(!1),2e3)},100)},[s,S,v,w,O,p,t,F,X,A]),se=c.useCallback(r=>{i(r),j(r)},[j]),ae=c.useCallback(()=>{window.confirm("Deseja limpar todo o histórico de rolagens?")&&(d([]),v("Histórico limpo","success"),w("Histórico de rolagens limpo"))},[v,w]),re=c.useCallback(r=>{const n=r.target.value;n.length<=100&&i(n)},[]),oe=c.useCallback(r=>{r.key==="Enter"&&!N.current&&(r.preventDefault(),j())},[j]);return e.jsxs("div",{className:"bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden",children:[e.jsx("div",{className:"p-6 border-b border-gray-800",children:e.jsx("div",{className:"flex items-center justify-between",children:e.jsxs("div",{children:[e.jsxs("h3",{className:"text-2xl font-storm-gust text-white flex items-center gap-3",children:[e.jsx(B,{size:24,className:"text-white"}),"DICE ROLLER"]}),e.jsx("div",{className:"w-20 h-0.5 bg-amber-500 mt-2"})]})})}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2",children:"Rolagens de Dados"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"text",value:s,onChange:re,onKeyPress:oe,disabled:b.loading.rolling,className:`
                w-full px-4 py-3 rounded font-medieval text-amber-100 bg-gray-800/80 border border-amber-600/50 focus:outline-none focus:ring-2 transition-all duration-200 text-sm pr-12 placeholder-amber-400/60
                ${f?"bg-red-950/50 border-2 border-red-500 focus:ring-red-500":"focus:border-amber-500 focus:ring-amber-500"}
                ${b.loading.rolling?"opacity-50 cursor-not-allowed":""}
              `,placeholder:"Ex: 1d20+5, 2d6+3, 3d8",maxLength:100,"aria-invalid":f?"true":"false","aria-describedby":f?"expression-error":"expression-help"}),e.jsx("button",{onClick:()=>j(),disabled:b.loading.rolling||f!=="",className:`
                absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded transition-all duration-200
                ${b.loading.rolling||f?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-105"}
                text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50
              `,"aria-label":"Rolar dados",children:e.jsx(Ne,{size:16})})]}),e.jsx("div",{id:"expression-help",className:"text-xs font-medieval text-amber-300/80 mt-1"}),f&&e.jsxs("div",{id:"expression-error",className:"flex items-center gap-2 mt-2 text-red-400 text-sm",role:"alert",children:[e.jsx(fe,{size:16,className:"text-red-400"}),e.jsxs("span",{children:["Expressão inválida: ",f]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2",children:"Rolagens Rápidas"}),e.jsx("div",{className:"grid grid-cols-4 gap-2",children:te.map(r=>e.jsx("button",{onClick:()=>se(r.value),disabled:b.loading.rolling,className:`
                  px-3 py-2 border rounded text-sm font-medieval font-medium transition-all duration-200
                  ${b.loading.rolling?"bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed opacity-50":"bg-gray-800/80 border-amber-600/50 text-amber-100 hover:bg-amber-900/50 hover:border-amber-500 hover:text-amber-50 hover:scale-105"}
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                `,title:r.description,"aria-label":`Rolar ${r.description}`,children:r.label},r.value))})]}),e.jsx(ke,{onClick:()=>j(),loading:b.loading.rolling,loadingText:"ROLANDO...",loadingType:"dice",disabled:f!=="",className:`
            w-full py-4 font-medieval font-bold rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500/50
            ${f?"bg-gray-600 cursor-not-allowed opacity-50":"bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-[1.02] text-white"}
          `,"aria-label":"Rolar dados com a expressão atual",children:e.jsxs("div",{className:"flex items-center justify-center gap",children:[e.jsx(B,{size:30}),e.jsx("span",{className:"text-sm"})]})}),e.jsxs("div",{ref:ee,className:`
            p-6 ${u.classes.card} border ${u.classes.cardBorder} rounded-lg text-center transition-all duration-700 ease-in-out relative overflow-hidden
            ${a!==null?"opacity-100 transform scale-100":"opacity-30 transform scale-95"}
            ${y?"ring-4 shadow-xl":""}
          `,style:{boxShadow:y?"0 0 20px var(--theme-dice-shadow)":"none",borderColor:y?"var(--theme-dice-color)":"rgb(55, 65, 81)"},role:"status","aria-live":"polite",children:[y&&e.jsx("div",{className:"absolute inset-0 opacity-10 dice-animation",style:{background:"radial-gradient(circle, var(--theme-dice-color) 0%, transparent 70%)"}}),e.jsx("div",{className:"text-xs font-medieval text-amber-400 uppercase tracking-wider mb-2 relative z-10",children:"RESULTADO"}),e.jsx("div",{className:`dice-result text-5xl font-extrabold transition-all duration-500 relative z-10 ${y?"dice-animation":""}`,style:{textShadow:y?"0 0 10px var(--theme-dice-shadow)":"none"},children:a!==null?a:"?"}),a!==null&&typeof a=="number"&&e.jsxs("div",{className:"text-sm font-medieval text-amber-300 mt-1 relative z-10 font-medium",children:[a===1&&"nah bro💀",a===20&&"🎉CRITICO🎉",a>=15&&a<20&&"Boa!!!",a>=10&&a<15&&"Boa",a<10&&a>1&&"bruh"]})]}),e.jsxs("div",{className:`${u.classes.card} border ${u.classes.cardBorder} rounded-lg`,children:[e.jsxs("div",{className:`p-4 border-b ${u.classes.cardBorder} flex items-center justify-between`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(we,{size:16,className:u.classes.textSecondary}),e.jsx("h3",{className:"text-2xl font-storm-gust text-white-100 flex items-center gap-3",children:"Histórico"}),e.jsxs("span",{className:`text-xs ${u.classes.textSecondary}`,children:["(",l.length,"/10)"]})]}),l.length>0&&e.jsxs("button",{onClick:ae,className:`flex items-center gap-1 text-xs ${u.classes.textSecondary} hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1`,"aria-label":"Limpar histórico de rolagens",children:[e.jsx(ge,{size:12}),"Limpar"]})]}),e.jsx("div",{className:"p-4 max-h-48 overflow-y-auto custom-scrollbar",children:l.length===0?e.jsx("p",{className:`${u.classes.textSecondary} italic text-sm text-center py-4`,children:"Nenhuma Rolagem ainda"}):e.jsx("ul",{className:"space-y-2",role:"log","aria-label":"Histórico",children:l.map((r,n)=>e.jsx("li",{className:`
                      ${u.classes.textSecondary} text-sm font-mono ${u.classes.input} p-3 rounded border-l-2 transition-all duration-200
                      ${n===0?"border-orange-500/50 bg-orange-500/5":`${u.classes.cardBorder} hover:border-gray-500/50`}
                    `,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{children:r}),n===0&&e.jsx("span",{className:"text-xs text-orange-400 font-bold ml-2",children:"ÚLTIMO"})]})},`${r}-${n}`))})})]})]}),x&&e.jsx("div",{className:"absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-40 animate-fade-in",children:e.jsxs("div",{className:"text-center relative",children:[e.jsx("div",{className:"absolute inset-0 blur-2xl opacity-70 dice-animation",style:{backgroundColor:"rgba(0,0,0,0.5)",boxShadow:"0 0 40px var(--theme-dice-shadow), 0 0 80px var(--theme-dice-shadow)"}}),e.jsx("div",{className:"dice-result text-9xl font-extrabold mb-6 relative z-10 dice-animation",style:{textShadow:"0 0 20px var(--theme-dice-shadow), 0 0 40px var(--theme-dice-shadow)"},children:z}),e.jsx("div",{className:"text-xl text-gray-300 animate-pulse relative z-10",children:"Boa sorte"}),e.jsx("div",{className:"mt-6 flex justify-center space-x-3 relative z-10",children:[...Array(5)].map((r,n)=>e.jsx("div",{className:"w-3 h-3 rounded-full animate-bounce",style:{animationDelay:`${n*.15}s`,animationDuration:"0.6s",backgroundColor:["#4ecdc4","#44a08d","#ff6b6b","#f59e0b","#8b5cf6"][n],boxShadow:`0 0 10px ${["#4ecdc4","#44a08d","#ff6b6b","#f59e0b","#8b5cf6"][n]}`}},n))}),e.jsx("div",{className:"mt-4 text-xs text-gray-400 relative z-10",children:e.jsxs("div",{className:"flex justify-center space-x-4",children:[e.jsx("span",{className:"text-green-400",children:"🔐 Crypto"}),e.jsx("span",{className:"text-blue-400",children:"⚡ XorShift"}),e.jsx("span",{className:"text-purple-400",children:"🖱️ Mouse"}),e.jsx("span",{className:"text-yellow-400",children:"⏰ Time"}),e.jsx("span",{className:"text-red-400",children:"🎲 LCG"})]})})]})}),z!==null&&!x&&e.jsx("div",{className:"absolute inset-0 pointer-events-none z-40",children:e.jsx("div",{className:"animate-move-to-result text-4xl font-extrabold text-white flex items-center justify-center h-full filter drop-shadow-lg",children:z})}),e.jsx("style",{children:`
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
      `})]})}const ze=de.memo(Re);export{ze as default};
