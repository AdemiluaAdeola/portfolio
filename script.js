// Theme toggle (persist to localStorage)
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const themeKey = 'aa_theme';

function applyTheme(t){
  if(t === 'dark'){ root.classList.add('dark'); }
  else { root.classList.remove('dark'); }
  localStorage.setItem(themeKey, t);
  themeToggle.textContent = (t === 'dark' ? '🌞' : '🌗');
}
const stored = localStorage.getItem(themeKey) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(stored);

themeToggle.addEventListener('click', () => {
  const cur = localStorage.getItem(themeKey) === 'dark' ? 'light' : 'dark';
  applyTheme(cur);
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Hire button opens mailto
document.getElementById('hireBtn').addEventListener('click', ()=> {
  window.location.href = 'mailto:adeola@example.com?subject=Opportunity%20to%20work%20together';
});

// Tiny placeholder CV generator if user hasn't replaced the link
document.getElementById('downloadCv').addEventListener('click', (e)=>{
  const btn = e.currentTarget;
  if(btn.getAttribute('href') === '#'){
    e.preventDefault();
    const text = "CV - Adeola Ademilua\nFrontend Developer / Student\nReplace this with your real CV PDF.";
    const blob = new Blob([text], {type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    btn.href = url;
    setTimeout(()=> URL.revokeObjectURL(url), 4000);
    btn.click();
  }
});

// Typewriter cycle
(function typeCycle(){
  const el = document.getElementById('typewriterText');
  const phrases = ['UI animations • quizzes • student tools', 'React interfaces • tiny AI helpers', 'clean code • playful UX'];
  let idx = 0, char = 0, forward = true;
  function tick(){
    const current = phrases[idx];
    if(forward){
      char++;
      el.textContent = current.slice(0,char);
      if(char === current.length){ forward=false; setTimeout(tick,1000); return; }
    } else {
      char--;
      el.textContent = current.slice(0,char);
      if(char === 0){ forward=true; idx=(idx+1)%phrases.length; }
    }
    setTimeout(tick, forward?40:24);
  }
  tick();
})();

// Reveal on scroll for .fade-in-up
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.fade-in-up').forEach(el=> io.observe(el));

// Populate skills (dynamic)
const skillsData = [
  {title:'JavaScript', meta:'ES6+, DOM, fetch', tag:'JS'},
  {title:'React', meta:'Hooks • Vite', tag:'RE'},
  {title:'HTML & CSS', meta:'Responsive, animations', tag:'HT'},
  {title:'Django', meta:'APIs, auth', tag:'DJ'},
  {title:'AI Tools', meta:'NLP • Prompting', tag:'AI'}
];
const skillsList = document.getElementById('skillsList');
skillsData.forEach(s=>{
  const div = document.createElement('div');
  div.className = 'skill glow';
  div.innerHTML = `<div class="badge">${s.tag}</div><div><div style="font-weight:800">${s.title}</div><div class="muted small">${s.meta}</div></div>`;
  skillsList.appendChild(div);
});

// Projects: local data + optional GitHub fetch
const localProjects = [
  {title:'AlphaQuiz', stack:'React • Node', desc:'Adaptive quiz system with spaced repetition and auto-generated MCQs from notes.', tags:['education','ai']},
  {title:'NoteSummarizer', stack:'Django • Python', desc:'Upload lecture notes and get concise outlines + exam-style questions.', tags:['nlp','product']},
  {title:'StudyBuddy Widget', stack:'Vanilla JS', desc:'Embeddable timed quiz widget for blogs.', tags:['widget','ui']}
];

const projectsGrid = document.getElementById('projectsGrid');
function renderProjects(list){
  projectsGrid.innerHTML = '';
  list.forEach(p=>{
    const art = document.createElement('article');
    art.className = 'project';
    art.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div style="font-weight:800">${p.title}</div>
        <div class="muted small">${p.stack || (p.language||'Project')}</div>
      </div>
      <p class="muted" style="margin-top:8px">${p.desc || (p.description||'')}</p>
      <div class="proj-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    `;
    projectsGrid.appendChild(art);
  });
  // add small tag styling
  document.querySelectorAll('.tag').forEach(t => t.style.cssText = 'font-size:12px;padding:6px 8px;border-radius:8px;background:rgba(11,102,255,0.06);margin-right:6px;display:inline-block;');
}

// Load local by default
renderProjects(localProjects);

// UI handlers for loading
document.getElementById('loadLocal').addEventListener('click', ()=> renderProjects(localProjects));
document.getElementById('fetchGit').addEventListener('click', async ()=>{
  const user = document.getElementById('githubUser').value.trim();
  if(!user){ alert('Enter a GitHub username'); return; }
  try{
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=30&sort=pushed`);
    if(!res.ok) throw new Error('GitHub fetch failed');
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork).slice(0,8).map(r => ({
      title: r.name,
      desc: r.description || '',
      stack: r.language || 'Repo',
      tags: [r.language || 'repo']
    }));
    renderProjects(filtered);
  }catch(err){
    console.error(err);
    alert('Could not fetch GitHub repos. Check username or rate limits.');
  }
});
