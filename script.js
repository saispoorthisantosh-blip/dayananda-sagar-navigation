const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener("resize", () => drawMap(currentPath));
resizeCanvas();

/* ================= BUILDINGS ================= */
const buildings = {
  Entrance:{x:500,y:40,img:"entrance.jpg"},
  Library:{x:360,y:110,img:"library.jpg"},
  PCSagar:{x:400,y:160,img:"pcsagar.jpg"},
  Heritage:{x:400,y:220,img:"heritage.jpg"},
  ShavigeMalleshwara:{x:460,y:240,img:"shavigemalleshwara.jpg"},
  Canteen:{x:520,y:290,img:"canteen.jpg"},
  HallOfAdmission:{x:400,y:300,img:"hallofadmission.jpg"},
  DentalScience:{x:400,y:360,img:"dentalscience.jpg"},
  ComDesign:{x:400,y:420,img:"comdesign.jpg"},
  NelsonMandela:{x:400,y:480,img:"nelsonmandela.jpg"},
  Garden:{x:540,y:520,img:"garden.jpg"},
  Ground:{x:650,y:520,img:"ground.jpg"},
  BusinessBlock:{x:680,y:580,img:"businessblock.jpg"},
  BusinessSchool:{x:680,y:640,img:"businessschool.jpg"},
  Architecture:{x:760,y:640,img:"architecture.jpg"},
  DayanandSagarSchool:{x:620,y:700,img:"dayanandsagarschool.jpg"},
  GirlsHostel:{x:520,y:650,img:"girlshostel.jpg"},
  CSE:{x:520,y:720,img:"cse.jpg"},
  ElectronicsBlock:{x:470,y:770,img:"electronicsblock.jpg"},
  Mechanical:{x:720,y:210,img:"mechanical.jpg"},
  AIRobotics:{x:700,y:260,img:"aiandrobotics.jpg"},
  EEE:{x:740,y:300,img:"eee.jpg"},
  Chemical:{x:740,y:360,img:"chemical.jpg"},
  CDSagar:{x:740,y:430,img:"cdsagar.jpg"},
  Parking:{x:620,y:150,img:"parking.jpg"}
};

/* ================= AUTO FIT ================= */
function getBounds() {
  const xs = Object.values(buildings).map(b => b.x);
  const ys = Object.values(buildings).map(b => b.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

function transformPoint(x, y) {
  const pad = 90;
  const b = getBounds();
  const scale = Math.min(
    (canvas.width - pad * 2) / (b.maxX - b.minX),
    (canvas.height - pad * 2) / (b.maxY - b.minY)
  );
  return {
    x: (x - b.minX) * scale + pad,
    y: (y - b.minY) * scale + pad
  };
}

/* ================= OUTLINE ================= */
function drawCampusOutline() {
  const b = getBounds();
  const tl = transformPoint(b.minX - 60, b.minY - 60);
  const tr = transformPoint(b.maxX + 60, b.minY - 60);
  const br = transformPoint(b.maxX + 60, b.maxY + 60);
  const bl = transformPoint(b.minX - 60, b.maxY + 60);

  ctx.strokeStyle = "#1e90ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
  ctx.stroke();
}

/* ================= GRAPH (UPDATED ONLY) ================= */
const graph = {
  Entrance:{Library:0.05},

  Library:{PCSagar:0.04},

  PCSagar:{Heritage:0.04},

  Heritage:{ShavigeMalleshwara:0.03},

  ShavigeMalleshwara:{Mechanical:0.06},

  Mechanical:{EEE:0.03},

  EEE:{Chemical:0.03},

  Chemical:{CDSagar:0.04},

  CDSagar:{Ground:0.05},

  /* CENTRAL */


  Library: {
  PCSagar: 0.04
},

PCSagar: {
  Library: 0.04,
  Heritage: 0.04
},

Garden: {
  Ground: 0.04,
  GirlsHostel: 0.03,
  Canteen:0.04
},

Ground: {
  Garden: 0.04,
  CDSagar: 0.05,
  BusinessBlock: 0.04,
  GirlsHostel: 0.03
},

CDSagar: {
  Ground: 0.05,
  Chemical: 0.04
},

Chemical: {
  CDSagar: 0.04,
  EEE: 0.03
},

EEE: {
  Chemical: 0.03,
  AIRobotics: 0.03
},

AIRobotics: {
  EEE: 0.03,
  Mechanical: 0.03
},

Canteen: {
  ShavigeMalleshwara: 0.03,
  Heritage:0.04,
  Garden:0.04
},

Entrance: {
  Library: 0.05,
  Parking: 0.04
},
Parking: {
  Mechanical: 0.05,
  Entrance: 0.04
},


  Canteen: {
  ShavigeMalleshwara: 0.03
},

ShavigeMalleshwara: {
  Canteen: 0.03,
  Mechanical: 0.06
},

Mechanical: {
  ShavigeMalleshwara: 0.06,
  Parking: 0.05
},

Parking: {
  Mechanical: 0.05
},

  HallOfAdmission:{
  DentalScience:0.03,
  ShavigeMalleshwara:0.03,
  Heritage:0.03          // ✅ ADD THIS
},
Heritage:{
  PCSagar:0.04,
  ShavigeMalleshwara:0.03,
  HallOfAdmission:0.03 ,
  Canteen:0.04  // ✅ ADD THIS
},
Garden:{
  Ground:0.04,
  GirlsHostel:0.03   // ✅ ADD THIS
},

ShavigeMalleshwara:{
  Mechanical:0.06,
  HallOfAdmission:0.03      // ✅ ADD THIS
},

  ComDesign:{DentalScience:0.03},

  DentalScience:{HallOfAdmission:0.03},

  HallOfAdmission:{Canteen:0.03},

  Canteen:{},

  /* BUSINESS SIDE */
  BusinessBlock:{Architecture:0.03},

  Architecture:{DayanandSagarSchool:0.03},

  DayanandSagarSchool:{CSE:0.03},

  CSE:{GirlsHostel:0.03},

  GirlsHostel:{ElectronicsBlock:0.04},

  ElectronicsBlock:{},

  Parking:{}
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
