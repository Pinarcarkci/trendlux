(function(){
  /* ---------- Productdefinities ---------- */
  const P = {
    kozijn:   {tab:'Kozijnen',   name:'Kozijn',    icon:'i-kozijn',   dims:['Breedte','Hoogte'], def:[150,120], mat:['Kunststof','Aluminium'], exL:'Type raam',     ex:['Draai-kiepraam','Vast raam','Combinatie','Weet ik nog niet']},
    deur:     {tab:'Deuren',     name:'Deur',      icon:'i-deur',     dims:['Breedte','Hoogte'], def:[100,215], mat:['Kunststof','Aluminium'], exL:'Soort deur',    ex:['Voordeur','Achterdeur','Tuindeuren (openslaand)']},
    rolluik:  {tab:'Rolluiken',  name:'Rolluik',   icon:'i-rolluik',  dims:['Breedte','Hoogte'], def:[150,140], mat:['Aluminium'],              exL:'Bediening',     ex:['Lint / koord','Elektrisch (schakelaar)','Elektrisch met afstandsbediening','Solar (zonne-energie)']},
    schuifpui:{tab:'Schuifpuien',name:'Schuifpui', icon:'i-schuifpui',dims:['Breedte','Hoogte'], def:[300,230], mat:['Kunststof','Aluminium'], exL:'Uitvoering',    ex:['2-delig','3-delig','4-delig']},
    veranda:  {tab:"Veranda's",  name:'Veranda',   icon:'i-veranda',  dims:['Breedte','Diepte'], def:[500,300], mat:['Aluminium'],              exL:'Dakbedekking',  ex:['Polycarbonaat','Glas','Weet ik nog niet']}
  };
  const COLORS = [
    {n:'Wit (RAL 9016)',        c:'#f1f0ea'},
    {n:'Crèmewit (RAL 9001)',   c:'#e9e0c9'},
    {n:'Antraciet (RAL 7016)',  c:'#383e42'},
    {n:'Zwart (RAL 9005)',      c:'#151515'},
    {n:'Kwartsgrijs (RAL 7039)',c:'#6b665e'},
    {n:'Donkergroen (RAL 6009)',c:'#27352a'},
    {n:'Golden oak (houtnerf)', c:'linear-gradient(135deg,#b07a3c,#8a5a26 50%,#b07a3c)', svg:'#a06d33'},
    {n:'Noten (houtnerf)',      c:'linear-gradient(135deg,#6e4528,#4f2f19 50%,#6e4528)', svg:'#5d3a20'},
    {n:'Andere RAL-kleur',      c:'', cls:'other', svg:'#8d8a84'},
    {n:'Weet ik nog niet',      c:'', cls:'unknown', svg:'#d9d6d0', label:'?'}
  ];

  const $ = id => document.getElementById(id);
  let cur = 'kozijn', colorIdx = 2, items = [];

  /* ---------- Tabs ---------- */
  Object.entries(P).forEach(([k,p])=>{
    const b = document.createElement('button');
    b.type='button'; b.className='tab'; b.role='tab'; b.dataset.k=k;
    b.innerHTML = `<svg><use href="#${p.icon}"/></svg><span>${p.tab}</span>`;
    b.onclick = ()=>select(k);
    $('tabs').appendChild(b);
  });

  /* ---------- Kleuren ---------- */
  COLORS.forEach((c,i)=>{
    const s = document.createElement('button');
    s.type='button'; s.className='sw'+(c.cls?' '+c.cls:''); s.role='radio';
    s.title=c.n; s.setAttribute('aria-label',c.n);
    if(c.c) s.style.background=c.c;
    if(c.label) s.textContent=c.label;
    s.onclick=()=>{colorIdx=i;renderColors();draw();};
    $('swatches').appendChild(s);
  });
  function renderColors(){
    [...$('swatches').children].forEach((s,i)=>s.setAttribute('aria-checked',i===colorIdx));
    $('colorName').textContent = COLORS[colorIdx].n;
    $('ralWrap').style.display = COLORS[colorIdx].cls==='other' ? 'block':'none';
  }

  function fill(sel,arr){ sel.innerHTML = arr.map(o=>`<option>${o}</option>`).join(''); }

  function select(k){
    cur = k; const p = P[k];
    [...$('tabs').children].forEach(t=>t.setAttribute('aria-selected',t.dataset.k===k));
    $('d1Label').textContent = p.dims[0]; $('d2Label').textContent = p.dims[1];
    $('d1').value = p.def[0]; $('d2').value = p.def[1];
    fill($('mat'),p.mat); fill($('extra'),p.ex); $('exLabel').textContent = p.exL;
    $('mat').disabled = p.mat.length===1;
    $('qty').value = 1;
    draw();
  }

  /* ---------- Schematische tekening ---------- */
  function draw(){
    const w = +$('d1').value || P[cur].def[0], h = +$('d2').value || P[cur].def[1];
    const col = COLORS[colorIdx].svg || COLORS[colorIdx].c;
    const maxW=250, maxH=200, s=Math.min(maxW/w,maxH/h);
    const bw=Math.max(40,w*s), bh=Math.max(40,h*s);
    const x=20+(maxW-bw)/2, y=20+(maxH-bh)/2;
    const glass='url(#gl)', st='stroke="rgba(255,255,255,.28)" stroke-width="1"';
    let g='';
    const t=Math.max(7,Math.min(bw,bh)*.07);
    if(cur==='kozijn'){
      g=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${col}" ${st}/>
         <rect x="${x+t}" y="${y+t}" width="${(bw-3*t)/2}" height="${bh-2*t}" fill="${glass}"/>
         <rect x="${x+2*t+(bw-3*t)/2}" y="${y+t}" width="${(bw-3*t)/2}" height="${bh-2*t}" fill="${glass}"/>`;
    } else if(cur==='deur'){
      g=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${col}" ${st}/>
         <rect x="${x+t*1.6}" y="${y+t*1.6}" width="${bw-3.2*t}" height="${bh*.32}" fill="${glass}"/>
         <rect x="${x+t*1.6}" y="${y+bh*.45}" width="${bw-3.2*t}" height="${bh*.45}" fill="none" ${st}/>
         <rect x="${x+bw-t*2.6}" y="${y+bh*.5}" width="${t*.7}" height="${bh*.12}" rx="2" fill="#e2b468"/>`;
    } else if(cur==='rolluik'){
      const box=Math.max(14,bh*.13); let sl='';
      for(let yy=y+box; yy<y+bh-2; yy+=Math.max(6,bh/18)) sl+=`<line x1="${x+4}" x2="${x+bw-4}" y1="${yy}" y2="${yy}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>`;
      g=`<rect x="${x+4}" y="${y+box}" width="${bw-8}" height="${bh-box}" fill="${col}" ${st}/>${sl}
         <rect x="${x}" y="${y}" width="${bw}" height="${box}" rx="3" fill="${col}" ${st}/>
         <rect x="${x}" y="${y+bh-5}" width="${bw}" height="5" fill="${col}" ${st}/>`;
    } else if(cur==='schuifpui'){
      const n = parseInt($('extra').value)||2, pw=(bw-2*t)/n; let ps='';
      for(let i=0;i<n;i++){ const px=x+t+i*pw;
        ps+=`<rect x="${px+t*.4}" y="${y+t}" width="${pw-t*.8}" height="${bh-2*t}" fill="${glass}" stroke="${col}" stroke-width="${t*.8}"/>`;
        const ay=y+bh/2, dir=i%2?-1:1, cx=px+pw/2;
        ps+=`<path d="M${cx-dir*10} ${ay}h${dir*20}m${-dir*6} -5l${dir*6} 5l${-dir*6} 5" stroke="#e2b468" stroke-width="1.8" fill="none" opacity=".8"/>`;
      }
      g=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${col}" ${st}/>${ps}`;
    } else { // veranda bovenaanzicht
      let r=''; const n=Math.max(3,Math.round(bw/26));
      for(let i=1;i<n;i++) r+=`<line x1="${x+i*bw/n}" x2="${x+i*bw/n}" y1="${y+6}" y2="${y+bh-6}" stroke="${col}" stroke-width="3"/>`;
      g=`<rect x="${x-8}" y="${y-10}" width="${bw+16}" height="8" fill="#4a4a50"/>
         <text x="${x+bw/2}" y="${y-14}" fill="#a7a39c" font-size="10" text-anchor="middle" font-family="Manrope">gevel</text>
         <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${glass}" stroke="${col}" stroke-width="6"/>${r}
         <rect x="${x-3}" y="${y+bh-9}" width="9" height="9" fill="${col}" ${st}/><rect x="${x+bw-6}" y="${y+bh-9}" width="9" height="9" fill="${col}" ${st}/>`;
    }
    const ax=x+bw+18, ay=y+bh+20;
    $('preview').innerHTML = `
      <defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f3a44"/><stop offset=".55" stop-color="#1c2329"/><stop offset="1" stop-color="#2a333b"/></linearGradient>
      <marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e2b468"/></marker></defs>
      ${g}
      <line x1="${x}" x2="${x+bw}" y1="${ay}" y2="${ay}" stroke="#e2b468" stroke-width="1.5" marker-start="url(#ah)" marker-end="url(#ah)"/>
      <text x="${x+bw/2}" y="${ay+18}" fill="#f3f1ed" font-size="13" font-weight="600" text-anchor="middle" font-family="Manrope">${w} cm</text>
      <line x1="${ax}" x2="${ax}" y1="${y}" y2="${y+bh}" stroke="#e2b468" stroke-width="1.5" marker-start="url(#ah)" marker-end="url(#ah)"/>
      <text x="${ax+10}" y="${y+bh/2+4}" fill="#f3f1ed" font-size="13" font-weight="600" font-family="Manrope">${h} cm</text>`;
  }
  ['d1','d2'].forEach(id=>$(id).addEventListener('input',draw));
  $('extra').addEventListener('change',draw);

  /* ---------- Aantal ---------- */
  const q=$('qty');
  $('qMinus').onclick=()=>q.value=Math.max(1,(+q.value||1)-1);
  $('qPlus').onclick =()=>q.value=Math.min(99,(+q.value||1)+1);

  /* ---------- Toevoegen aan aanvraag ---------- */
  function currentItem(){
    const w=+$('d1').value, h=+$('d2').value, p=P[cur];
    if(!w||!h||w<20||h<20){ showErr('Vul geldige afmetingen in (minimaal 20 cm).'); return null; }
    let kleur=COLORS[colorIdx].n;
    if(COLORS[colorIdx].cls==='other') kleur = 'RAL: ' + ($('ral').value.trim()||'nog door te geven');
    return {product:p.name, mat:$('mat').value, kleur, w, h, d2:p.dims[1].toLowerCase(), extraL:p.exL, extra:$('extra').value, qty:Math.max(1,+q.value||1)};
  }
  function label(it){ return `${it.qty}× ${it.product} – ${it.w} × ${it.h} cm (breedte × ${it.d2}) – ${it.mat} – ${it.kleur} – ${it.extraL}: ${it.extra}`; }
  function renderItems(){
    $('count').textContent = items.length + (items.length===1?' product':' producten');
    if(!items.length){ $('items').innerHTML='<div class="empty">Nog geen producten toegevoegd. Vul de maten in en klik op <b style="color:var(--gold)">Toevoegen</b>.</div>'; return; }
    $('items').innerHTML = items.map((it,i)=>`<div class="item"><span><b>${it.qty}× ${it.product}</b> · ${it.w} × ${it.h} cm · ${it.mat} · ${it.kleur} · ${it.extra}</span><button type="button" aria-label="Verwijderen" data-i="${i}">×</button></div>`).join('');
    $('items').querySelectorAll('button').forEach(b=>b.onclick=()=>{items.splice(+b.dataset.i,1);renderItems();});
  }
  $('addBtn').onclick=()=>{ const it=currentItem(); if(!it) return; hideErr(); items.push(it); renderItems(); };

  /* ---------- Foto ---------- */
  $('photo').addEventListener('change',e=>{
    const f=e.target.files[0];
    if(f && f.size>10*1024*1024){ e.target.value=''; showErr('De foto is groter dan 10 MB. Kies een kleinere foto.'); return; }
    $('fileText').innerHTML = f ? `<b style="color:var(--gold)">${f.name}</b><br><small style="color:var(--muted)">Klik om te wijzigen</small>` : '<b>Foto toevoegen</b> (optioneel)';
  });

  /* ---------- Versturen ---------- */
  function showErr(m){ $('err').textContent=m; $('err').style.display='block'; }
  function hideErr(){ $('err').style.display='none'; }

  $('aanvraag').addEventListener('submit',e=>{
    hideErr();
    if(!items.length){ const it=currentItem(); if(it){ items.push(it); renderItems(); } else { e.preventDefault(); return; } }
    const f=e.target;
    const bad=[...f.querySelectorAll('.contact-grid [required]')].find(el=>!el.checkValidity());
    if(bad){ e.preventDefault(); showErr(bad.id==='privacy' ? 'Ga akkoord met het gebruik van uw gegevens om verder te gaan.' : 'Controleer het veld: ' + bad.name + '.'); bad.focus(); return; }
    // producten als aparte regels in de e-mail
    $('hiddenItems').innerHTML='';
    items.forEach((it,i)=>{ const h=document.createElement('input'); h.type='hidden'; h.name='Product '+(i+1); h.value=label(it); $('hiddenItems').appendChild(h); });
    $('subj').value = 'Nieuwe aanvraag via trendlux.nl – ' + f.Naam.value + ' (' + f.Plaats.value + ')';
    if(location.protocol.startsWith('http')) $('nextUrl').value = location.origin + location.pathname + '?verzonden=1#offerte';
  });

  /* ---------- Bedankt-melding na terugkeer ---------- */
  if(new URLSearchParams(location.search).get('verzonden')==='1'){
    $('formBody').style.display='none'; $('done').style.display='block';
    
  }
  $('again').onclick=e=>{ e.preventDefault(); history.replaceState(null,'',location.pathname+'#offerte'); $('done').style.display='none'; $('formBody').style.display='block'; };

  const qp = new URLSearchParams(location.search).get('product');
  renderColors(); select(P[qp] ? qp : 'kozijn');
})();
