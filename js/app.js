let lang='hi',view='home',S={};
const t=a=>Array.isArray(a)?a[lang=='hi'?0:1]:a,$=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ld=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const go=v=>{view=v;S={};draw();scrollTo(0,0)};
const tog=()=>{lang=lang=='hi'?'en':'hi';document.documentElement.lang=lang;draw()};
const say=s=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang=lang=='hi'?'hi-IN':'en-IN';speechSynthesis.speak(u)}catch(e){}};
const opt=(a,k)=>a.map((o,i)=>`<button class="opt ${S[k]===i?'on':''}" onclick="S.${k}=${i};draw()">${t(o)}</button>`).join('');
const fld=(k,l,ph)=>`<div class="row"><label>${t(l)}<input value="${esc(S[k])}" placeholder="${esc(t(ph||''))}" oninput="S.${k}=this.value"></label></div>`;
const SCAM=[['कोई भी "रिकवरी एजेंट" जो फ़ीस, OTP या PIN माँगे, वह ठग है। असली शिकायत प्रक्रिया में आपसे पैसे नहीं माँगे जाते।','Anyone posing as a "recovery agent" who asks for a fee, OTP or PIN is a scammer. Genuine complaint channels never ask you to pay to file.']];
const warn=()=>`<div class="warn"><b>${t(['ठगी से सावधान','Scam alert'])}</b><br>${t(SCAM[0])}</div>`;
const msg=a=>{$('#msg').innerHTML=`<div class="note">${t(a)}</div>`};

function home(){return `<h1>${t(['आपका हक़, आपकी भाषा में','Your rights, in your language'])}</h1>
<p class="sub">${t(['बोलकर या लिखकर बताइए क्या हुआ। हम शिकायत, नॉमिनी और परिवार के दावे में कदम-दर-कदम साथ देंगे।','Tell us what happened by voice or text. We guide you step by step through complaints, nominees and family claims.'])}</p>
<div class="ask"><textarea id="q" aria-label="query" placeholder="${t(['जैसे: "मेरे पति गुज़र गए, शेयर कैसे मिलेंगे?"','e.g. "My husband passed away, how do I get his shares?"'])}"></textarea><button class="mic" onclick="mic()" aria-label="mic">🎤</button></div>
<button class="btn" onclick="route()">${t(['आगे बढ़ें','Continue'])}</button><div id="msg"></div>
<div class="tiles">
<button class="tile" onclick="go('scam')"><i>🛡️</i><div><b>${t(['यह मैसेज / कॉल ठगी तो नहीं?','Is this message or call a scam?'])}</b><span>${t(['चिपकाएँ और जाँचें, फ़ोन पर ही','Paste and check, on your phone only'])}</span></div></button>
<button class="tile" onclick="go('heir')"><i>🕊️</i><div><b>${t(['परिवार में किसी का निधन हुआ','A family member has passed away'])}</b><span>${t(['शेयर, फ़ंड और डिविडेंड का दावा','Claim shares, funds and dividends'])}</span></div></button>
<button class="tile" onclick="go('complaint')"><i>📝</i><div><b>${t(['शिकायत लिखनी है','I need to file a complaint'])}</b><span>${t(['ब्रोकर या DP के खिलाफ़ ड्राफ़्ट','Draft against a broker or DP'])}</span></div></button>
<button class="tile" onclick="go('nominee')"><i>👨‍👩‍👧</i><div><b>${t(['नॉमिनी की जाँच','Check my nominees'])}</b><span>${t(['कौन सा खाता असुरक्षित है','Find unprotected accounts'])}</span></div></button></div>`}

function route(){const q=($('#q').value||'').toLowerCase();
if(NOADVICE.test(q))return msg([['मैं शेयर खरीदने-बेचने की सलाह या टिप नहीं देता। मैं सिर्फ़ आपके अधिकार और शिकायत प्रक्रिया में मदद करता हूँ। कोई "पक्की कमाई" का वादा करे तो सावधान रहें।','I don’t give stock tips or buy/sell advice. I only help with your rights and grievance process. Be wary of anyone promising "guaranteed returns".']][0]);
if(/pass|death|died|deceased|late |मृत्यु|निधन|गुज़र|गुजर|नहीं रहे/.test(q))return go('heir');
if(/nominee|नॉमिनी|नामित/.test(q))return go('nominee');
if(SCAMQ.test(q))return go('scam');
if(/broker|paisa|पैसा|रोक|complain|शिकायत|fraud|scam|ठग|धोखा|refund/.test(q))return go('complaint');
msg(['समझ नहीं आया। नीचे से एक विकल्प चुनें।','Not sure I got that. Please pick one option below.'])}
function mic(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!R)return msg(['इस ब्राउज़र में आवाज़ नहीं चलती। कृपया लिखें।','Voice is not supported here. Please type.']);
const r=new R();r.lang=lang=='hi'?'hi-IN':'en-IN';$('.mic').classList.add('live');
r.onresult=e=>{$('#q').value=e.results[0][0].transcript;route()};r.onerror=r.onend=()=>$('.mic')&&$('.mic').classList.remove('live');r.start()}

const ENT=[['ब्रोकर','Broker'],['डिपॉज़िटरी पार्टिसिपेंट (DP)','Depository participant (DP)'],['म्यूचुअल फ़ंड / AMC','Mutual fund / AMC'],['लिस्टेड कंपनी','Listed company']];
const ISS=[['पैसा या शेयर रोका गया','Money or shares withheld'],['बिना पूछे ट्रेड हुआ','Unauthorised trade'],['पिछली शिकायत का जवाब नहीं','No reply to earlier complaint'],['धोखाधड़ी / फ़र्ज़ी ग्रुप','Fraud / fake tip group']];
function complaint(){const ok=S.e!==undefined&&S.i!==undefined&&S.name;
let h=`<h2>${t(['शिकायत सहायक','Complaint assistant'])}</h2><p class="sub">${t(['3 आसान सवाल, फिर तैयार ड्राफ़्ट।','3 simple questions, then a ready draft.'])}</p>
<h3>${t(['1. किसके खिलाफ़?','1. Against whom?'])}</h3><div class="opts">${opt(ENT,'e')}</div>
<h3>${t(['2. क्या हुआ?','2. What happened?'])}</h3><div class="opts">${opt(ISS,'i')}</div>
<h3>${t(['3. आपका विवरण','3. Your details'])}</h3>${fld('name',['आपका नाम','Your name'])}${fld('amt',['राशि (₹), अगर पता हो','Amount (₹), if known'])}${fld('dt',['तारीख','Date'])}${fld('det',['थोड़ा और बताएँ','Anything else'])}
<button class="btn" onclick="S.done=1;draw()">${t(['ड्राफ़्ट बनाएँ','Create draft'])}</button>`;
if(S.done&&!ok)h+=`<div class="note">${t(['कृपया ऊपर के विकल्प चुनें और नाम लिखें।','Please choose the options above and enter your name.'])}</div>`;
if(S.done&&ok){const e=t(ENT[S.e]),i=t(ISS[S.i]),n=esc(S.name),a=S.amt?', ₹'+esc(S.amt):'',d=esc(S.dt||'—'),x=esc(S.det||'—');
const L=lang=='hi'?`सेवा में,\nशिकायत निवारण अधिकारी\n${e}\n\nविषय: ${i} के संबंध में शिकायत\n\nमैं ${n}, आपकी सेवाओं का उपयोगकर्ता हूँ। दिनांक ${d} को यह समस्या हुई: ${i}${a}।\nविवरण: ${x}\n\nकृपया इसकी लिखित पावती दें और समाधान करें। संबंधित दस्तावेज़ संलग्न हैं।\n\nधन्यवाद,\n${n}`:`To,\nThe Grievance Officer\n${e}\n\nSubject: Complaint regarding ${i}\n\nI, ${n}, am a user of your services. On ${d} the following issue occurred: ${i}${a}.\nDetails: ${x}\n\nPlease acknowledge this complaint in writing and resolve it. Relevant documents are attached.\n\nRegards,\n${n}`;
window.RA=L;
h+=`<h3>${t(['आपका ड्राफ़्ट','Your draft'])}</h3><pre class="draft">${L}</pre>
<div class="opts noprint" style="margin-top:12px"><button class="btn" onclick="print()">${t(['प्रिंट / PDF','Print / PDF'])}</button><button class="btn alt" onclick="say(RA)">🔊 ${t(['सुनें','Listen'])}</button></div>
<h3>${t(['आगे का रास्ता','What to do next'])}</h3><div class="card">${t(['1. यह पत्र पहले संबंधित संस्था को भेजें और पावती सँभालकर रखें।<br>2. जवाब न मिले या संतुष्टि न हो तो SEBI SCORES (scores.sebi.gov.in) पर शिकायत दर्ज करें।<br>3. फिर भी हल न हो तो स्मार्ट ODR (smartodr.in) आज़माएँ।<br><span class="src">समय-सीमाएँ बदलती रहती हैं, SEBI की वेबसाइट पर जाँच लें।</span>','1. Send this letter to the entity first and keep proof of receipt.<br>2. If there is no reply or you are unhappy, file on SEBI SCORES (scores.sebi.gov.in).<br>3. If still unresolved, try Smart ODR (smartodr.in).<br><span class="src">Timelines change. Confirm on the SEBI website.</span>'])}</div>${warn()}`}
return h}

const YN=[['हाँ, नॉमिनी है','Yes, nominee exists'],['नहीं है','No nominee'],['पता नहीं','Not sure']];
function heir(){S.a=S.a||{};S.k=S.k||{};
const A=[['डीमैट / शेयर','Demat / shares','d'],['म्यूचुअल फ़ंड','Mutual funds','m'],['बैंक खाता','Bank account','b'],['अनक्लेम्ड डिविडेंड','Unclaimed dividends','i']];
let h=`<h2>${t(['परिवार का दावा','Family claim guide'])}</h2><p class="sub">${t(['हमें खेद है। हम आपको सही क्रम में दस्तावेज़ और कदम बताएँगे।','We are sorry for your loss. We will list the documents and steps in the right order.'])}</p>
<h3>${t(['1. कहाँ संपत्ति हो सकती है?','1. Where might assets be?'])}</h3><div class="opts">${A.map(x=>`<button class="opt ${S.a[x[2]]?'on':''}" onclick="S.a['${x[2]}']=!S.a['${x[2]}'];draw()">${t(x)}</button>`).join('')}</div>
<h3>${t(['2. क्या नॉमिनी दर्ज है?','2. Is a nominee registered?'])}</h3><div class="opts">${opt(YN,'n')}</div>`;
const sel=A.filter(x=>S.a[x[2]]);
if(S.n!==undefined&&sel.length){
const D=[['dc',['मृत्यु प्रमाण पत्र (प्रमाणित प्रतियाँ)','Death certificate (attested copies)']],['id',['आपका पहचान व KYC (आधार/पैन)','Your ID and KYC (Aadhaar/PAN)']],['rel',S.n==0?['प्रमाण कि आप दर्ज नॉमिनी हैं','Proof that you are the registered nominee']:['कानूनी वारिस प्रमाण या उत्तराधिकार दस्तावेज़','Legal heir certificate or succession papers']],['bk',['खाते / फ़ोलियो का स्टेटमेंट','Account or folio statements']]];
const P={d:[['डीमैट: मृतक के DP (ब्रोकर) से ट्रांसमिशन फ़ॉर्म माँगें और ऊपर के दस्तावेज़ जमा करें।','Demat: ask the deceased’s DP (broker) for the transmission request form and submit the documents above.'],'CDSL / NSDL'],m:[['म्यूचुअल फ़ंड: CAMS या KFintech से फ़ोलियो पता करें, फिर संबंधित AMC में ट्रांसमिशन अनुरोध दें।','Mutual funds: ask CAMS or KFintech to trace folios, then file a transmission request with the AMC.'],'AMFI / SEBI'],b:[['बैंक: शाखा में मृत्यु प्रमाण पत्र के साथ दावा दें।','Bank: submit a claim at the branch with the death certificate.'],'RBI'],i:[['अनक्लेम्ड डिविडेंड: IEPF पोर्टल (iepf.gov.in) पर मृतक का नाम खोजें और दावा फ़ॉर्म भरें।','Unclaimed dividends: search the name on the IEPF portal (iepf.gov.in) and file the claim form.'],'IEPF']};
const n=D.filter(d=>S.k[d[0]]).length,pc=Math.round(n/D.length*100);
h+=`<h3>${t(['आपके दस्तावेज़ (जो हैं उन्हें टिक करें)','Your documents (tick what you have)'])}</h3><div class="bar" role="progressbar" aria-valuenow="${pc}"><div style="width:${pc}%"></div></div><p class="sub">${t(['तैयारी','Readiness'])}: ${pc}%</p>`+D.map(d=>`<button class="chk ${S.k[d[0]]?'on':''}" onclick="S.k['${d[0]}']=!S.k['${d[0]}'];draw()"><em>${S.k[d[0]]?'✓':''}</em><span>${t(d[1])}</span></button>`).join('')+
`<h3>${t(['आपके कदम','Your steps'])}</h3>`+sel.map(x=>`<div class="card">${t(P[x[2]][0])}<br><span class="src">${t(['स्रोत','Source'])}: ${P[x[2]][1]}</span></div>`).join('');
window.RA=sel.map(x=>t(P[x[2]][0])).join(' ');
const wa='https://wa.me/?text='+encodeURIComponent(t(['परिवार के दावे की सूची:\n','Family claim checklist:\n'])+D.map(d=>(S.k[d[0]]?'[x] ':'[ ] ')+t(d[1])).join('\n')+'\n'+sel.map(x=>'- '+t(P[x[2]][0])).join('\n'));
h+=`<div class="opts noprint"><a class="btn" style="text-decoration:none;display:inline-flex;align-items:center" href="${wa}" target="_blank" rel="noopener">${t(['WhatsApp पर बेटे/बेटी को भेजें','Send to family on WhatsApp'])}</a><button class="btn alt" onclick="say(RA)">🔊 ${t(['सुनें','Listen'])}</button></div><div class="note">${t(['हर संस्था की प्रक्रिया थोड़ी अलग हो सकती है। कदम से पहले उनसे पुष्टि कर लें।','Each institution’s process may differ. Confirm with them before acting.'])}</div>${warn()}`}
return h}

function nominee(){const R=[['डीमैट खाता','Demat account'],['म्यूचुअल फ़ंड फ़ोलियो','Mutual fund folio'],['बैंक खाता','Bank account'],['PPF / EPF','PPF / EPF']],ST=[['नॉमिनी जुड़ा है','Added'],['नहीं जुड़ा','Missing'],['पता नहीं','Not sure']],s=ld('nom')||{};
const ok=R.filter((r,i)=>s[i]===0).length,gap=R.length-ok;
return `<h2>${t(['नॉमिनी ट्रैकर','Nominee tracker'])}</h2><p class="sub">${t(['खाता नंबर या पैन नहीं चाहिए। सिर्फ़ "है / नहीं" आपके फ़ोन में सेव होता है।','No account numbers or PAN needed. Only "yes / no" is saved on your phone.'])}</p>`+
R.map((r,i)=>`<div class="row"><b>${t(r)}</b><div class="opts" style="margin-top:6px">${ST.map((x,j)=>`<button class="opt ${s[i]===j?'on':''}" onclick="setN(${i},${j})">${t(x)}</button>`).join('')}</div></div>`).join('')+
`<div class="card"><b>${t(['सुरक्षित','Protected'])}: ${ok}/${R.length}</b><div class="bar"><div style="width:${ok/R.length*100}%"></div></div>${gap?`<p>${t(['अधूरे खातों में नॉमिनी जोड़ें। इसके बिना परिवार को दावे में महीनों लग सकते हैं। अपने DP, AMC या बैंक से पूछें।','Add nominees to the open items. Without one, families can face long delays. Ask your DP, AMC or bank.'])}</p>`:`<p>${t(['बहुत बढ़िया, सब कुछ दर्ज है।','Well done, everything is covered.'])}</p>`}</div>`}
function setN(i,j){const s=ld('nom')||{};s[i]=j;sv('nom',s);draw()}

function draw(){const v={home,complaint,heir,nominee,scam}[view]();
$('#app').innerHTML=(view!='home'?`<button class="back" onclick="go('home')">← ${t(['वापस','Back'])}</button>`:'')+v;
$('#ft').innerHTML=t(['कोई निवेश सलाह नहीं · आपका डेटा सिर्फ़ आपके फ़ोन में · हम SMS या OTP नहीं पढ़ते','No investment advice · Your data stays on your device · We never read SMS or OTPs'])}
draw();
