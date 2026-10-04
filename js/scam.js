/* Scam Shield view. Text never leaves the device and is never stored. */
function scam() {
  const L = {
    high: [['बहुत ज़्यादा जोखिम: ठगी की पूरी संभावना', 'High risk: this looks like a scam'], 'warn'],
    medium: [['सावधान: कई खतरे के संकेत', 'Be careful: several warning signs'], 'warn'],
    low: [['कुछ संकेत मिले, पर पक्का नहीं', 'A few signs, but not conclusive'], 'note'],
    none: [['कोई संकेत नहीं मिला, फिर भी सावधान रहें', 'No signs found, but stay careful'], 'note'],
  };
  const r = S.r;
  let h = `<h2>${t(['ठगी जाँच', 'Scam Shield'])}</h2><p class="sub">${t(['कोई मैसेज, कॉल की बात या ग्रुप का न्योता चिपकाएँ। जाँच आपके फ़ोन पर ही होती है, कुछ सेव या भेजा नहीं जाता।', 'Paste a message, call script or group invite. The check runs on your phone. Nothing is saved or sent.'])}</p>
<textarea id="sm" aria-label="message" oninput="S.m=this.value">${esc(S.m)}</textarea>
<div class="opts" style="margin-top:12px"><button class="btn" onclick="S.r=scanMessage(S.m);draw()">${t(['जाँचें', 'Check'])}</button>
<button class="btn alt" onclick="S={};draw()">${t(['साफ़ करें', 'Clear'])}</button></div>`;
  if (r && r.level === 'empty') h += `<div class="note">${t(['पहले कुछ लिखें या चिपकाएँ।', 'Please paste or type something first.'])}</div>`;
  if (r && r.level !== 'empty') {
    const [lab, cls] = L[r.level];
    h += `<div class="${cls}" role="status"><p class="verdict">${t(lab)}</p>${r.flags.map(f => `<p class="flag">• ${t([f.hi, f.en])}</p>`).join('')}</div>`;
    if (r.level === 'high' || r.level === 'medium') h += `<h3>${t(['अभी क्या करें', 'What to do now'])}</h3><div class="card">${t([
      '1. कोई पैसा न भेजें, OTP/PIN न बताएँ, लिंक न खोलें।<br>2. सलाहकार या कंपनी SEBI की वेबसाइट (sebi.gov.in) पर पंजीकृत है या नहीं, खुद जाँचें।<br>3. पैसा जा चुका हो तो तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें, और अपने बैंक को बताएँ।<br>4. कार्रवाई से पहले परिवार के किसी सदस्य से बात करें।',
      '1. Do not send money, share an OTP/PIN or open the link.<br>2. Check yourself whether the adviser or firm is registered on the SEBI website (sebi.gov.in).<br>3. If money has gone, call 1930 or report at cybercrime.gov.in at once, and tell your bank.<br>4. Talk to a family member before acting.'])}</div>`;
    h += `<div class="note">${t(['यह एक सरल नियम-आधारित जाँच है। यह कुछ ठगियाँ चूक सकती है और असली मैसेज को भी शक में ले सकती है। "कोई संकेत नहीं" का मतलब "सुरक्षित" नहीं है।', 'This is a simple rules-based check. It can miss scams and can flag genuine messages. "No signs" does not mean "safe".'])}</div>`;
  }
  return h;
}
