// Demo JS for KAZANACAM™
const DATA = {
  grades: Array.from({length:8},(_,i)=>({id:i+1,label:(i+1)+". Sınıf"})),
  lessons: ["Türkçe","Matematik","Fen Bilimleri","Sosyal Bilgiler","İngilizce"],
  topics: {
    "6-Türkçe":[
      {id:"6-tr-1", title:"6. Sınıf Türkçe — 1. Yazılı (Okuma)", excerpt:"Paragraf soruları; kısa cevaplar", mebSource:"https://www.meb.gov.tr/"},
      {id:"6-tr-2", title:"6. Sınıf Türkçe — Dil Bilgisi", excerpt:"Fiiller, cümle türleri", mebSource:"https://www.meb.gov.tr/"}
    ],
    "6-Matematik":[
      {id:"6-m-1", title:"6. Sınıf Matematik — Tam Sayılar", excerpt:"Toplama, çıkarma, problemler", mebSource:"https://www.meb.gov.tr/"}
    ]
  },
  mebSamples: {
    "6-tr-1": { html: "<h4>Okuma Parçası (Demo)</h4><p>Sabah güneşi şehri aydınlatıyordu...</p><h5>Cevap</h5><p>Ana duygu: umut.</p>"}
  },
  motivations_tr: [
    "Her gün küçük bir adım, büyük başarıya götürür.",
    "Denenmeden kazanılacak zafer yok — denemeye devam et!",
    "Öğrenmek eğlencelidir; merakını kaybetme."
  ],
  motivations_en: [
    "Small steps every day lead to big wins.",
    "No victory without trying — keep going!",
    "Learning is fun; never lose your curiosity."
  ]
};

const gradesEl = document.getElementById('grades');
const lessonsEl = document.getElementById('lessons');
const topicGrid = document.getElementById('topicGrid');
const topicPanel = document.getElementById('topicPanel');
const topicTitle = document.getElementById('topicTitle');
const topicMeta = document.getElementById('topicMeta');
const mebPreview = document.getElementById('mebPreview');
const motivationEl = document.getElementById('motivation');
const langSelect = document.getElementById('langSelect');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');
const yearEl = document.getElementById('year');

let state = { grade:6, lesson:"Türkçe", topic:null, lang:'tr' };

function renderGrades(){
  gradesEl.innerHTML = '';
  DATA.grades.forEach(g=>{
    const d = document.createElement('div'); d.className='grade';
    if(g.id===state.grade) d.classList.add('active');
    d.textContent = g.label;
    d.onclick = ()=> { state.grade=g.id; render(); };
    gradesEl.appendChild(d);
  });
}

function renderLessons(){
  lessonsEl.innerHTML = '';
  DATA.lessons.forEach(ls=>{
    const el = document.createElement('div'); el.className='lesson';
    el.innerHTML = `<div>${ls}</div><div class="tag">${countTopics(state.grade,ls)} konu</div>`;
    el.onclick = ()=>{ state.lesson=ls; render(); };
    lessonsEl.appendChild(el);
  });
}

function countTopics(grade, lesson){
  return (DATA.topics[`${grade}-${lesson}`]||[]).length;
}

function renderTopics(filter=''){
  topicGrid.innerHTML = '';
  const arr = DATA.topics[`${state.grade}-${state.lesson}`] || [];
  const filtered = arr.filter(t=> (t.title+' '+t.excerpt).toLowerCase().includes(filter.toLowerCase()));
  if(filtered.length===0){ topicGrid.innerHTML = `<div class="muted">Bu sınıf/ders için henüz konu yok.</div>`; return;}
  filtered.forEach(t=>{
    const div = document.createElement('div'); div.className='topic';
    div.innerHTML = `<div class="meta">${t.mebSource ? 'MEB' : ''}</div><h4>${t.title}</h4><div class="tag">${t.excerpt}</div>`;
    div.onclick = ()=> openTopic(t);
    topicGrid.appendChild(div);
  });
}

function openTopic(t){
  state.topic = t;
  topicPanel.hidden = false;
  topicTitle.textContent = t.title;
  topicMeta.textContent = `${state.grade}. Sınıf • ${state.lesson}`;
  mebPreview.innerHTML = DATA.mebSamples[t.id] ? DATA.mebSamples[t.id].html : '<p class="muted">Demo içerik yok.</p>';
}

function pickMotivation(){
  const list = state.lang==='tr' ? DATA.motivations_tr : DATA.motivations_en;
  motivationEl.textContent = list[Math.floor(Math.random()*list.length)];
}

function buildCalendar(){
  const cal = document.getElementById('calendar');
  cal.innerHTML = '';
  for(let i=1;i<=7;i++){
    const d = document.createElement('div'); d.className='day';
    d.textContent = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][i-1];
    cal.appendChild(d);
  }
}

langSelect.addEventListener('change', (e)=>{
  state.lang = e.target.value;
  // basic translations (demo)
  if(state.lang==='en'){
    document.getElementById('search').placeholder = 'Search: grade 6 turkish...';
    document.getElementById('filter').placeholder = 'Filter topics...';
    document.getElementById('slogan').textContent = 'Success Starts With You!';
  } else {
    document.getElementById('search').placeholder = 'Ara: 6. sınıf türkçe...';
    document.getElementById('filter').placeholder = 'Konu filtrele...';
    document.getElementById('slogan').textContent = 'Başarı Seninle Başlar!';
  }
  pickMotivation();
});

document.getElementById('filter').addEventListener('input',(e)=> renderTopics(e.target.value));
searchEl.addEventListener('input',(e)=> {
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderTopics(); return; }
  const results=[];
  Object.keys(DATA.topics).forEach(k=>{
    DATA.topics[k].forEach(t=>{
      if((t.title+' '+t.excerpt).toLowerCase().includes(q)) results.push({key:k,topic:t});
    });
  });
  topicGrid.innerHTML='';
  if(results.length===0) topicGrid.innerHTML = `<div class="muted">Aradığınız içerik yok.</div>`;
  results.forEach(r=>{
    const d = document.createElement('div'); d.className='topic';
    d.innerHTML = `<div class="meta">${r.key}</div><h4>${r.topic.title}</h4><div class="tag">${r.topic.excerpt}</div>`;
    d.onclick = ()=> openTopic(r.topic);
    topicGrid.appendChild(d);
  });
});

document.getElementById('printBtn').addEventListener('click', ()=> window.print());
document.getElementById('toggleTheme').addEventListener('click', ()=> document.body.classList.toggle('dark'));

function init(){
  renderGrades();
  renderLessons();
  renderTopics();
  pickMotivation();
  buildCalendar();
  yearEl.textContent = new Date().getFullYear();
}
init();
