const STORE='corpulMeu.entries.v4';
const OBJECT_STORE='corpulMeu.objects.v1';
let entries=JSON.parse(localStorage.getItem(STORE)||localStorage.getItem('corpulMeu.entries.v3')||localStorage.getItem('corpulMeu.entries.v2')||localStorage.getItem('corpulMeu.entries.v1')||'[]');
const DEFAULT_OBJECTS={
 IN:['250 ml apa','Cafea','Mic dejun','Pranz','Gustare','Medicament'],
 OUT:['Urinare','Scaun','Transpiratie'],
 STARE:['Durere de cap','Balonare','Oboseala','Energie','Foame','Anxietate'],
 ACTIVITATE:['Somn','Trezire','Mers','Sport','Munca','Stres']
};
let objects=JSON.parse(localStorage.getItem(OBJECT_STORE)||'null')||structuredClone(DEFAULT_OBJECTS);
let tab='journal', selectedDate=localDate(), modal=false, editor=false, currentType='IN';
function localDate(d=new Date()){let x=new Date(d.getTime()-d.getTimezoneOffset()*60000);return x.toISOString().slice(0,10)}
function save(){localStorage.setItem(STORE,JSON.stringify(entries))}
function saveObjects(){localStorage.setItem(OBJECT_STORE,JSON.stringify(objects))}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function nav(content){return `<main class=shell>${content}</main><button class=plus data-action="open">+</button><nav class=nav>${[['journal','Jurnal'],['calendar','Calendar'],['insights','Insights'],['settings','Setari']].map(([k,v])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${v}</button>`).join('')}</nav>${modal?composer():''}${editor?objectEditor():''}`}
function render(){document.querySelector('#app').innerHTML=tab==='journal'?journal():tab==='calendar'?calendar():tab==='insights'?insights():settings()}
function journal(){
 let now=new Date(),days=[]; for(let n=-4;n<=0;n++){let d=new Date(now);d.setDate(now.getDate()+n);days.push(localDate(d))}
 let list=entries.filter(e=>e.date===selectedDate).sort((a,b)=>a.time.localeCompare(b.time));
 return nav(`<div class=eyebrow>Jurnal personal</div><h1>Corpul meu</h1><div class=days>${days.map(d=>`<button class="day ${d===selectedDate?'on':''}" data-date="${d}"><div class=muted>${new Date(d+'T12:00').toLocaleDateString('ro-RO',{weekday:'short'})}</div><b>${d.slice(8)}</b></button>`).join('')}</div><div class="row between" style="margin-top:20px"><b>Cronologie</b><span class=muted>${list.length} inregistrari</span></div>${list.length?list.map(entryCard).join(''):'<div class="card empty">Nicio inregistrare. Apasa +.</div>'}`)}
function entryCard(e){return `<div class=card style="padding:14px 15px"><div style="display:grid;grid-template-columns:58px 72px 1fr 24px;gap:8px;align-items:center"><div style="font-size:12px;font-weight:800;color:#64748b">${esc(e.time)}</div><span class="pill ${e.type}" style="font-size:12px;text-align:center">${e.type}</span><div style="font-size:14px;font-weight:700;text-align:left">${esc(e.name)}</div><button class=delete data-delete="${e.id}">x</button></div>${e.intensity?`<div class=muted style="margin-left:138px;margin-top:5px">Intensitate ${esc(e.intensity)}/10</div>`:''}${e.notes?`<div class=muted style="margin-left:138px;margin-top:3px">${esc(e.notes)}</div>`:''}</div>`}
function composer(){return `<div class=modal><div class=shell><div class="row between"><button class=secondary data-action="close">Inchide</button><b>Inregistrare noua</b><span></span></div><div class=types style="margin-top:20px">${Object.keys(objects).map(t=>`<button type=button data-type="${t}" class="${currentType===t?'on':''}">${t}</button>`).join('')}</div><div class=card><div class=eyebrow>Ora</div><input id=time type=time value="${new Date().toTimeString().slice(0,5)}"></div><div class=card><div class="row between"><div class=eyebrow>Obiectul inregistrarii</div><button type=button class=smallbtn data-action="editobjects">Edit</button></div><select id=name style="margin-top:10px">${objects[currentType].map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></div>${currentType==='STARE'?'<div class=card><div class="row between"><span class=eyebrow>Intensitate</span><b id=iv>5/10</b></div><input id=ir type=range min=1 max=10 value=5></div>':''}<div class=card><div class=eyebrow>Notite</div><textarea id=notes rows=3 placeholder="Detalii optionale"></textarea></div><button class=primary data-action="save">Salveaza</button></div></div>`}
function objectEditor(){let list=objects[currentType];return `<div class=modal style="z-index:8"><div class=shell><div class="row between"><button class=secondary data-action="closeeditor">Inapoi</button><b>Editeaza obiecte - ${currentType}</b><span></span></div><div class=card><div class=eyebrow>Adauga obiect nou</div><div class=row style="margin-top:8px"><input id=newobject placeholder="ex. 500 ml apa"><button class=smallbtn data-action="addobject">Adauga</button></div></div><div class=card>${list.map((x,i)=>`<div class=row style="margin-bottom:8px"><input data-object-index="${i}" value="${esc(x)}"><button class=smallbtn data-save-object="${i}">Salveaza</button><button class=delete data-delete-object="${i}">x</button></div>`).join('')}</div></div></div>`}
function calendar(){return nav('<div class=eyebrow>Istoric</div><h1>Calendar</h1><div class="card empty">Pentru test, alege o zi din Jurnal.</div>')}
function insights(){return nav('<div class=eyebrow>Tipare personale</div><h1>Insights</h1><div class="card empty">Insights apar dupa ce aduni evenimente repetate.</div><div class="card warn">Asocierile nu demonstreaza cauzalitate si nu reprezinta diagnostic medical.</div>')}
function settings(){return nav(`<div class=eyebrow>Date</div><h1>Setari</h1><div class=card><b>${entries.length} inregistrari locale</b><p class=muted>Datele sunt pastrate local in acest browser.</p></div>`)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.type){currentType=b.dataset.type;render();return}
 if(b.dataset.tab){tab=b.dataset.tab;render();return}
 if(b.dataset.date){selectedDate=b.dataset.date;render();return}
 if(b.dataset.delete){entries=entries.filter(x=>x.id!==b.dataset.delete);save();render();return}
 if(b.dataset.action==='open'){currentType='IN';modal=true;render();return}
 if(b.dataset.action==='close'){modal=false;editor=false;render();return}
 if(b.dataset.action==='editobjects'){editor=true;render();return}
 if(b.dataset.action==='closeeditor'){editor=false;render();return}
 if(b.dataset.action==='addobject'){let v=document.querySelector('#newobject').value.trim();if(v&&!objects[currentType].includes(v)){objects[currentType].push(v);saveObjects();render()}return}
 if(b.dataset.saveObject!==undefined){let i=Number(b.dataset.saveObject),inp=document.querySelector(`[data-object-index="${i}"]`),v=inp.value.trim();if(v){objects[currentType][i]=v;saveObjects();render()}return}
 if(b.dataset.deleteObject!==undefined){let i=Number(b.dataset.deleteObject);if(confirm('Stergi acest obiect?')){objects[currentType].splice(i,1);saveObjects();render()}return}
 if(b.dataset.action==='save'){let sel=document.querySelector('#name'),name=sel?.value?.trim();if(!name){alert('Adauga mai intai un obiect pentru aceasta categorie.');return}entries.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:selectedDate,time:document.querySelector('#time').value,type:currentType,name,intensity:currentType==='STARE'?(document.querySelector('#ir')?.value||5):null,notes:document.querySelector('#notes')?.value||''});save();modal=false;currentType='IN';render();return}
});
document.addEventListener('input',e=>{if(e.target.id==='ir')document.querySelector('#iv').textContent=e.target.value+'/10'});
render();
