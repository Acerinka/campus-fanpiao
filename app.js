'use strict';
const dishes=[
{id:1,name:'招牌红烧肉饭',hall:'东苑',loc:'一楼 03 窗口',price:12,wait:6,taste:'酱香',badge:'人气招牌',rating:4.8,votes:42,note:'慢炖肉块裹着浓酱，拌饭刚刚好。',warn:'肥瘦相间，喜欢瘦肉的同学可以提前跟阿姨说。',author:'今天也要光盘',review:'肉炖得很软，酱汁拌饭很香。十二点以后肥肉会多一些。'},
{id:2,name:'番茄牛肉面',hall:'北区',loc:'二楼 06 窗口',price:14,wait:8,taste:'酸甜',badge:'本周上新',fresh:true,rating:4.7,votes:28,note:'鲜番茄熬汤，酸甜味里带点牛肉香。',warn:'面条现煮，午间赶课请预留等候时间。',author:'不喝最后一口汤',review:'汤里能吃到番茄块，牛肉也软。我喜欢硬一点的面，下次会提前说。'},
{id:3,name:'川香麻辣香锅',hall:'南园',loc:'一楼 08 窗口',price:16,wait:12,taste:'麻辣',badge:'重口味必点',rating:4.6,votes:36,note:'花椒香很足，藕片和土豆特别入味。',warn:'微辣也有明显麻感。单人份约 16 元，加肉另计。',author:'土豆加一份',review:'锅气足，两个人一起点更好搭配。微辣也挺辣，记得拿杯水。'},
{id:4,name:'葱油鸡腿饭',hall:'东苑',loc:'二楼 02 窗口',price:13,wait:4,taste:'葱香',badge:'出餐快',rating:4.7,votes:31,note:'嫩鸡腿配热葱油，下课赶时间也吃得好。',warn:'葱油香味浓，对生葱敏感可以请窗口少放。',author:'踩点选手',review:'午休只有半小时也来得及，鸡腿的分量挺实在。'},
{id:5,name:'香菇豆腐饭',hall:'北区',loc:'一楼 05 窗口',price:8,wait:3,taste:'清淡',badge:'十元以内',rating:4.5,votes:24,note:'香菇厚实、豆腐软嫩，一份八元。',warn:'整体调味偏淡，饭量大的同学可能需要加饭。',author:'月末也吃好',review:'调味轻，豆腐是嫩的，适合想吃点清淡的那天。'},
{id:6,name:'金汤咖喱鸡饭',hall:'南园',loc:'二楼 01 窗口',price:12,wait:5,taste:'微辣',badge:'本周上新',fresh:true,rating:4.6,votes:19,note:'绵软土豆配浓咖喱，带一点温和辛香。',warn:'咖喱酱偏浓稠，喜欢汤汁多的话可以提前说。',author:'饭要多一点',review:'土豆很绵，咖喱微辣，拌饭味道刚好。'}
];
const paths={pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/>',search:'<circle cx="10" cy="10" r="6.3"/><path d="m15 15 5 5"/>',sliders:'<path d="M3 7h8m5 0h5M3 17h3m5 0h10"/><circle cx="13.5" cy="7" r="2.5"/><circle cx="8.5" cy="17" r="2.5"/>',dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="16" r="1"/><circle cx="12" cy="12" r="1"/>',heart:'<path d="M20.4 4.8c-2.5-2-6.1-1-8.4 1.7-2.3-2.7-5.9-3.7-8.4-1.7-3.3 2.8-1.1 7.4 1.4 9.9L12 21l7-6.3c2.5-2.5 4.7-7.1 1.4-9.9Z"/>',spark:'<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="m4 6 12-3 2 3m-2 7h2"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
const el=id=>document.getElementById(id);
const icon=name=>`<i data-i="${name}" aria-hidden="true"><svg viewBox="0 0 24 24">${paths[name]}</svg></i>`;
document.querySelectorAll('i[data-i]').forEach(i=>i.outerHTML=icon(i.dataset.i));
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem('fanpiao-v1-'+key))??fallback}catch{return fallback}}
function persist(key,value){try{localStorage.setItem('fanpiao-v1-'+key,JSON.stringify(value));return true}catch{return false}}
let saved=read('saved',[]),reviews=read('reviews',{}),freshOnly=false,savedView=false,score=5,lastDraw=null;
const initial={hall:'不限',taste:'不限',budget:'不限',wait:'不限'};
let filters={...initial},draft={...initial};
const groups={taste:['口味','不限','酱香','酸甜','麻辣','葱香','清淡','微辣'],budget:['预算','不限','10 元以内','12 元以内','15 元以内'],wait:['等候时间','不限','5 分钟以内','8 分钟以内']};
const shortcuts={'本周上新':'spark','十元以内':'wallet','五分钟出餐':'clock'};
const dialog=el('dialog');
const added=d=>reviews[d.id]||[];
function stats(d){const rs=added(d),count=d.votes+rs.length;return {count,avg:((d.rating*d.votes+rs.reduce((a,r)=>a+r.score,0))/count).toFixed(1)}}
function list(){
 if(savedView)return dishes.filter(d=>saved.includes(d.id));
 const q=el('search').value.trim().toLowerCase();
 const items=dishes.filter(d=>(!savedView||saved.includes(d.id))&&(!q||`${d.name} ${d.hall}食堂 ${d.loc} ${d.taste}`.toLowerCase().includes(q))&&(!freshOnly||d.fresh)&&(filters.hall==='不限'||d.hall===filters.hall)&&(filters.taste==='不限'||d.taste===filters.taste)&&(filters.budget==='不限'||d.price<=parseInt(filters.budget))&&(filters.wait==='不限'||d.wait<=parseInt(filters.wait)));
 const order=el('sort').value;
 if(order==='rating')items.sort((a,b)=>stats(b).avg-stats(a).avg);
 if(order==='price')items.sort((a,b)=>a.price-b.price);
 if(order==='queue')items.sort((a,b)=>a.wait-b.wait);
 return items;
}
function card(d){let s=stats(d),liked=saved.includes(d.id);return `<article class="card"><button class="card-open" data-detail="${d.id}" aria-label="查看${d.name}详情"><img class="foodimg" src="dish-${d.id}.jpg" alt="${d.name}" loading="lazy"><span class="badge ${d.fresh?'green':''}">${d.badge}</span><div class="card-body"><div class="nameprice"><h3>${d.name}</h3><span class="price"><small>¥</small>${d.price}</span></div><div class="location">${icon('pin')}${d.hall}食堂 · ${d.loc}</div><p class="notes">${d.note}</p><div class="card-bottom"><span><b class="rating"><span class="star">★</span> ${s.avg}</b> · ${s.count} 评</span><span>排队约 ${d.wait} 分钟</span></div></div></button><button class="heart ${liked?'saved':''}" data-save="${d.id}" aria-label="${liked?'移出':'加入'}想吃清单：${d.name}" aria-pressed="${liked}">${icon('heart')}</button></article>`}
function render(){
 const items=list(),n=Object.keys(groups).filter(k=>filters[k]!=='不限').length;
 el('saved-count').textContent=saved.length?`(${saved.length})`:'';
 el('hero').hidden=savedView;
 for(const selector of ['.hall-strip','.filters','.search','.resultmeta label']){
  document.querySelector(selector).hidden=savedView;
 }
 document.querySelectorAll('[data-hall]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hall===filters.hall)));
 el('menuheading').textContent=savedView?'想吃清单':'校园菜单';
 el('section-kicker').textContent=savedView?'MY SHORTLIST':'CANTEEN MENU';
 for(const name of ['discover','saved'])el('nav-'+name).classList.toggle('active',(name==='saved')===savedView);
 const quickActive={'本周上新':freshOnly,'十元以内':filters.budget==='10 元以内','五分钟出餐':filters.wait==='5 分钟以内'};
 el('chips').innerHTML=Object.entries(shortcuts).map(([k,i])=>`<button data-chip="${k}" aria-pressed="${quickActive[k]}" class="${quickActive[k]?'active':''}">${icon(i)}${k}</button>`).join('');
 el('filter-open').classList.toggle('on',!!n);el('filter-open').querySelector('span').textContent=n?`更多筛选 (${n})`:'更多筛选';
 const conditions=[filters.hall!=='不限'&&filters.hall+'食堂',freshOnly&&'本周上新',...Object.keys(groups).map(k=>filters[k]!=='不限'&&filters[k]),el('search').value.trim()].filter(Boolean);
 el('results').textContent=savedView?`收藏了 ${items.length} 道菜品`:[...conditions,`${items.length} 道菜品`].join(' · ');
 el('clear-selection').hidden=savedView||!conditions.length;
 const noSaved=savedView&&!saved.length;
 el('cards').innerHTML=items.length?items.map(card).join(''):`<div class="empty"><strong>${noSaved?'还没有想吃的菜':'没有找到合适的菜品'}</strong><p>${noSaved?'看到心动的菜，点一下爱心就能存到这里。':'试试其他口味，或放宽预算与等候时间。'}</p><button class="secondary" data-reset>${noSaved?'去发现菜品':'清除筛选'}</button></div>`;
}
function reset(){freshOnly=false;filters={...initial};el('search').value='';el('sort').value='default'}
function route(){savedView=location.hash==='#saved';render();window.scrollTo(0,0)}
window.addEventListener('hashchange',route);
function modal(html){el('dialog-content').innerHTML=`<button class="close" data-close aria-label="关闭">×</button>${html}`;if(!dialog.open)dialog.showModal();dialog.scrollTop=0}
function detail(id,draw=false){
 const d=dishes.find(x=>x.id===id),s=stats(d),liked=saved.includes(id);
 const rs=[...added(d).slice().reverse().map(r=>({author:'我的点评',score:r.score,body:r.text})),{author:d.author,score:Math.round(d.rating),body:d.review}];
 modal(`<img class="modalpic" src="dish-${id}.jpg" alt="${d.name}"><div class="modalbody"><div class="eyebrow">${draw?'饭票抽选 · 今天吃这道':'窗口食单 · '+d.badge}</div><div class="nameprice"><h2 id="dialog-title">${d.name}</h2><strong class="price"><small>¥</small>${d.price}</strong></div><div class="location">${icon('pin')}${d.hall}食堂 · ${d.loc}</div><div class="card-bottom"><b class="rating"><span class="star">★</span> ${s.avg} · ${s.count} 评</b><span>${d.taste} · 排队约 ${d.wait} 分钟</span></div><p>${d.note}</p><div class="tip"><b>点单提醒</b>　${d.warn}</div><div class="actions">${draw?'<button class="redbtn" data-again>换一道</button>':`<button class="redbtn" data-write="${id}">写点评</button>`}<button class="secondary" data-save="${id}" data-inside="${draw?'draw':'detail'}">${icon('heart')}${liked?'已加入想吃':'加入想吃'}</button>${draw?`<button class="secondary" data-detail="${id}">菜品详情</button>`:''}</div><h3>同学怎么说</h3>${rs.map(r=>`<div class="review"><small>${esc(r.author)} · <span class="star">★</span> ${r.score}</small><p>${esc(r.body)}</p></div>`).join('')}</div>`);
}
function drawDish(){
 const pool=dishes.filter(d=>d.id!==lastDraw);
 lastDraw=pool[Math.floor(Math.random()*pool.length)].id;
 detail(lastDraw,true);
}
function filterModal(){modal(`<div class="modalbody"><div class="eyebrow">MEAL PREFERENCES</div><h2 id="dialog-title">筛选菜品</h2>${Object.entries(groups).map(([k,[label,...options]])=>`<div class="filtergroup"><strong>${label}</strong><div class="optionrow">${options.map(v=>`<button class="option ${draft[k]===v?'active':''}" aria-pressed="${draft[k]===v}" data-group="${k}" data-value="${v}">${v}</button>`).join('')}</div></div>`).join('')}<div class="actions"><button class="redbtn" data-apply>查看结果</button><button class="secondary" data-clear>重置条件</button></div></div>`)}
function writeReview(id){const d=dishes.find(x=>x.id===id);score=5;modal(`<form class="modalbody" id="review-form" data-id="${id}"><div class="eyebrow">TASTING NOTES</div><h2 id="dialog-title">点评${d.name}</h2><h3>这道菜你打几分？</h3><div class="stars">${[1,2,3,4,5].map(n=>`<button type="button" class="chosen" data-score="${n}" aria-label="${n} 分" aria-pressed="${n===5}">★</button>`).join('')}<output id="score-text">5 分</output></div><label for="review-text">你的用餐体验</label><textarea rows="4" id="review-text" required maxlength="180" placeholder="味道、分量或排队体验怎么样？"></textarea><p class="hint">最多 180 字</p><div class="actions"><button class="redbtn">保存点评</button><button type="button" class="secondary" data-detail="${id}">返回菜品</button></div></form>`)}
let timer;function notify(msg){el('toast').textContent=msg;el('toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>el('toast').classList.remove('show'),1600)}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const a=b.dataset;
 if('close' in a)dialog.close();
 else if('detail' in a)detail(+a.detail);
 else if(b.id==='browse'){el('menuheading').focus({preventScroll:true});el('menu').scrollIntoView()}
 else if('hall' in a){filters.hall=filters.hall===a.hall?'不限':a.hall;render()}
 else if('chip' in a){
  if(a.chip==='本周上新')freshOnly=!freshOnly;
  if(a.chip==='十元以内')filters.budget=filters.budget==='10 元以内'?'不限':'10 元以内';
  if(a.chip==='五分钟出餐')filters.wait=filters.wait==='5 分钟以内'?'不限':'5 分钟以内';
  render();el('chips').querySelector(`[data-chip="${a.chip}"]`).focus({preventScroll:true});
 }
 else if('save' in a){const id=+a.save,liked=saved.includes(id);saved=liked?saved.filter(v=>v!==id):[...saved,id];const stored=persist('saved',saved);render();if(a.inside)detail(id,a.inside==='draw');notify(stored?(liked?'已移出想吃清单':'已加入想吃清单'):'保存失败，刷新后可能丢失')}
 else if('write' in a)writeReview(+a.write);
 else if('score' in a){score=+a.score;document.querySelectorAll('[data-score]').forEach(n=>{n.classList.toggle('chosen',+n.dataset.score<=score);n.setAttribute('aria-pressed',String(+n.dataset.score===score))});el('score-text').textContent=score+' 分'}
 else if(b.id==='draw'||'again' in a)drawDish();
 else if(b.id==='filter-open'){draft={...filters};filterModal()}
 else if('group' in a){draft[a.group]=a.value;filterModal();dialog.querySelector(`[data-group="${a.group}"][data-value="${a.value}"]`)?.focus()}
 else if('clear' in a){draft={...initial,hall:filters.hall};filterModal()}
 else if('apply' in a){filters={...draft};dialog.close();render()}
 else if('reset' in a){if(dialog.open)dialog.close();if(savedView&&!saved.length)location.hash='discover';reset();render()}
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='review-form')return;e.preventDefault();
 const input=el('review-text'),txt=input.value.trim();if(!txt){input.setCustomValidity('写下你的用餐体验');input.reportValidity();return}
 const id=+e.target.dataset.id;reviews={...reviews,[id]:[...(reviews[id]||[]),{score,text:txt}]};const stored=persist('reviews',reviews);render();detail(id);notify(stored?'点评已保存':'保存失败，刷新后可能丢失');
});
document.addEventListener('input',e=>{if(e.target.id==='review-text')e.target.setCustomValidity('')});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
el('search').addEventListener('input',render);el('sort').addEventListener('change',render);route();
