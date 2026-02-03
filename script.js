const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener("resize", () => drawMap(currentPath));
resizeCanvas();

/* ================= BUILDINGS ================= */
const graph = {
  Entrance: { Library: 0.05, Parking: 0.04 },
  Library: { PCSagar: 0.04 },
  PCSagar: { Library: 0.04, Heritage: 0.04 },
  Heritage: {
    PCSagar: 0.04,
    ShavigeMalleshwara: 0.03,
    HallOfAdmission: 0.03,
    Canteen: 0.04
  },
  ShavigeMalleshwara: {
    Mechanical: 0.06,
    Canteen: 0.03,
    HallOfAdmission: 0.03
  },
  Mechanical: {
    ShavigeMalleshwara: 0.06,
    Parking: 0.05,
    EEE: 0.03
  },
  EEE: {
    Mechanical: 0.03,
    Chemical: 0.03,
    AIRobotics: 0.03
  },
  AIRobotics: { EEE: 0.03, Mechanical: 0.03 },
  Chemical: { EEE: 0.03, CDSagar: 0.04 },
  CDSagar: { Chemical: 0.04, Ground: 0.05 },
  Ground: {
    CDSagar: 0.05,
    Garden: 0.04,
    BusinessBlock: 0.04,
    GirlsHostel: 0.03
  },
  Garden: { Ground: 0.04, GirlsHostel: 0.03, Canteen: 0.04 },
  Canteen: {
    ShavigeMalleshwara: 0.03,
    Heritage: 0.04,
    Garden: 0.04,
    HallOfAdmission: 0.03
  },
  Parking: { Entrance: 0.04, Mechanical: 0.05 },
  HallOfAdmission: {
    DentalScience: 0.03,
    ShavigeMalleshwara: 0.03,
    Heritage: 0.03,
    Canteen: 0.03
  },
  DentalScience: { HallOfAdmission: 0.03 },
  ComDesign: { DentalScience: 0.03 },

  BusinessBlock: { Architecture: 0.03, CSE: 0.03 },
  Architecture: { DayanandSagarSchool: 0.03 },
  DayanandSagarSchool: { CSE: 0.03, GirlsHostel: 0.03 },
  CSE: { ElectronicsBlock: 0.04, GirlsHostel: 0.03 },
  GirlsHostel: { ElectronicsBlock: 0.04, Ground: 0.03, Garden: 0.03 },
  ElectronicsBlock: {},

  NelsonMandela: {
  ComDesign: 0.02,
  Garden: 0.08
},
NelsonMandela: {
  ComDesign: 0.03
},

ComDesign: {
  DentalScience: 0.03
},

DentalScience: {
  HallOfAdmission: 0.03
},

HallOfAdmission: {
  Canteen: 0.03
},

Canteen: {
  Garden: 0.04
},

BusinessSchool: {
  BusinessBlock: 0.03,
  Architecture: 0.03
},

BusinessSchool: {
  DayanandSagarSchool: 0.03
},
BusinessSchool: {
  DayanandSagarSchool: 0.03,
  GirlsHostel: 0.03      // ✅ NEW direct path
},
BusinessBlock: {
  Architecture: 0.03,
  CSE: 0.03,
  BusinessSchool: 0.03,
  GirlsHostel: 0.03   // ✅ ADD THIS
},
GirlsHostel: {
  ElectronicsBlock: 0.04,
  Ground: 0.03,
  Garden: 0.03,
  CSE: 0.03           // ✅ ADD THIS
},
BusinessBlock: {
  Architecture: 0.03,
  CSE: 0.03,
  BusinessSchool: 0.03   // ✅ ADD THIS
},
BusinessSchool: {
  DayanandSagarSchool: 0.03,
  GirlsHostel: 0.03,
  BusinessBlock: 0.03    // ✅ ADD THIS
},
GirlsHostel: {
  ElectronicsBlock: 0.04,
  Ground: 0.03,
  Garden: 0.03,
  BusinessSchool: 0.03   // ✅ NEW reverse path
},
DayanandSagarSchool: {
  CSE: 0.03,
  GirlsHostel: 0.03,
  BusinessSchool: 0.03
}
};
/* ================= TWO WAY ================= */
Object.keys(graph).forEach(a=>{
  Object.keys(graph[a]).forEach(b=>{
    if(!graph[b]) graph[b]={};
    if(!graph[b][a]) graph[b][a]=graph[a][b];
  });
});

/* ================= UI ================= */
const startSel=document.getElementById("start");
const endSel=document.getElementById("end");
Object.keys(buildings).forEach(b=>{
  startSel.add(new Option(b,b));
  endSel.add(new Option(b,b));
});

let currentPath=[];
let dotIndex=0;

/* ================= VOICE ================= */
function speakDistanceTime(d,t){
  const msg=new SpeechSynthesisUtterance(
    `The distance is ${d} kilometers. Estimated walking time is ${t} minutes.`
  );
  msg.lang="en-IN";
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function speakTurnByTurn(path){
  if(path.length<2) return;
  speechSynthesis.cancel();
  let i=0;
  function next(){
    let text = i===0 ? `Start from ${path[i]}` :
      i===path.length-1 ? `You have reached ${path[i]}` :
      `Go to ${path[i]}`;
    const u=new SpeechSynthesisUtterance(text);
    u.lang="en-IN";
    u.onend=()=>{ i++; if(i<path.length) setTimeout(next,500); };
    speechSynthesis.speak(u);
  }
  next();
}

/* ================= FIND PATH ================= */
function findPath(){
  const start=startSel.value;
  const end=endSel.value;
  let dist={},prev={},vis={};

  Object.keys(buildings).forEach(n=>dist[n]=Infinity);
  dist[start]=0;

  while(true){
    let u=null;
    for(let n in dist)
      if(!vis[n]&&(u===null||dist[n]<dist[u])) u=n;
    if(!u||u===end) break;
    vis[u]=true;
    for(let v in graph[u]){
      let alt=dist[u]+graph[u][v];
      if(alt<dist[v]){ dist[v]=alt; prev[v]=u; }
    }
  }

  currentPath=[];
  for(let u=end;u;u=prev[u]) currentPath.unshift(u);

  const d=dist[end].toFixed(2);
  const t=Math.round(dist[end]*12);

  document.getElementById("distance").innerText=d+" km";
  document.getElementById("time").innerText=t+" min";
  document.getElementById("buildingImage").src="images/"+buildings[end].img;
  document.getElementById("buildingName").innerText=end;

  speakDistanceTime(d,t);
  speakTurnByTurn(currentPath);

  dotIndex=0;
  animateDot();
}

/* ================= DRAW ================= */
function drawMap(path=[]){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawCampusOutline();

  if(path.length>1){
    ctx.strokeStyle="#00bfff";
    ctx.lineWidth=6;
    ctx.beginPath();
    path.forEach((p,i)=>{
      const t=transformPoint(buildings[p].x,buildings[p].y);
      i?ctx.lineTo(t.x,t.y):ctx.moveTo(t.x,t.y);
    });
    ctx.stroke();
  }

  Object.entries(buildings).forEach(([n,b])=>{
    const p=transformPoint(b.x,b.y);
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(p.x,p.y,6,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="#ccc";
    ctx.font="12px Arial";
    ctx.textAlign="center";
    ctx.fillText(n,p.x,p.y+16);
  });
}

/* ================= DOT ================= */
function animateDot(){
  drawMap(currentPath);
  if(currentPath.length<2) return;
  const p=transformPoint(
    buildings[currentPath[dotIndex]].x,
    buildings[currentPath[dotIndex]].y
  );
  ctx.fillStyle="red";
  ctx.beginPath();
  ctx.arc(p.x,p.y,8,0,Math.PI*2);
  ctx.fill();
  dotIndex++;
  if(dotIndex<currentPath.length)
    requestAnimationFrame(()=>setTimeout(animateDot,400));
}


drawMap();

