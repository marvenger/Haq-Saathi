/* Haq Saathi rules engine. Pure functions, no network, no storage.
   Every verdict is explainable: each flag maps to a named rule below. */

// Guardrail: refuse buy/sell/hold advice and stock tips. Word boundaries avoid
// false hits on "shareholder", "multiple", or "पति ने शेयर खरीदे थे" (heirs).
const NOADVICE = /\b(should i|can i|when to|what to)\s+(buy|sell|hold)\b|\b(buy|sell|hold)\b.{0,30}\b(stock|shares?|nifty|ipo|crypto)\b|\b(stock|share|hot|market)\s+tips?\b|\b(give|need|want|any)\s+(me\s+)?(a\s+)?tips?\b|which\s+(stock|share)|best\s+(stock|share)|target\s+price|\bkharid|\bbech\b|खरीदूँ|खरीदूं|खरीदें|खरीदना चाहिए|बेचूँ|बेचूं|बेचें|बेचना चाहिए|कौन ?सा शेयर|कौन ?से शेयर|शेयर (की )?टिप|टिप दो/i;

// Routes a typed/spoken question about a suspicious message to Scam Shield.
const SCAMQ = /whatsapp|telegram|link|sms|message|call|caller|guarantee|double|agent|मैसेज|कॉल|लिंक|ग्रुप|गारंटी|एजेंट|दोगुना/i;

// [id, pattern, weight, Hindi explanation, English explanation]
const SCAM_RULES = [
  ['guaranteed', /guarantee|assured\s+return|risk[- ]?free|100%\s*(profit|return)|double\s+(your\s+)?money|गारंटी|पक्का मुनाफ़ा|दोगुना|दुगना/i, 3,
    'पक्के या दोगुने मुनाफ़े का वादा। असली निवेश में रिटर्न की गारंटी नहीं होती।', 'Promises guaranteed or doubled returns. Genuine investments cannot guarantee returns.'],
  ['otp', /\botp\b|\bpin\b|\bcvv\b|password|ओटीपी|पिन|पासवर्ड/i, 4,
    'OTP, PIN या पासवर्ड माँगा जा रहा है। इन्हें किसी को न बताएँ।', 'Asks for an OTP, PIN or password. Never share these with anyone.'],
  ['fee', /(processing|registration|release|recovery|refund|tax|advance|clearance)\s*(fee|charge)|pay\s.{0,25}(fee|charge)|फ़ीस|फीस|शुल्क|चार्ज जमा/i, 4,
    'पैसा निकालने या शिकायत के लिए पहले फ़ीस माँगी जा रही है। यह ठगी का आम तरीका है।', 'Asks for a fee before releasing money or helping. This is the classic advance-fee trick.'],
  ['recovery', /recover(y)?\s+(your\s+)?(lost\s+)?(money|funds)|fund\s+recovery|पैसे?\s*(वापस|रिकवर)|रिकवरी/i, 3,
    '"पैसा वापस दिलाने" का दावा। नुकसान उठा चुके लोगों को दोबारा निशाना बनाया जाता है।', 'Claims to recover lost money. People who already lost money are targeted again.'],
  ['urgency', /today only|right now|immediately|within\s+\d+\s*(hours?|hrs|minutes?)|last chance|limited\s+(seats|slots)|hurry|आज ही|तुरंत|आखिरी मौका|सीमित सीट/i, 2,
    'जल्दबाज़ी का दबाव। ठग सोचने का समय नहीं देते।', 'Creates urgency. Scammers do not give you time to think.'],
  ['group', /(whatsapp|telegram)\s+(group|channel)|vip\s+(group|channel)|join\s+(our|my)\s+group|टेलीग्राम|व्हाट्सऐप ग्रुप|ग्रुप में जुड़ें/i, 2,
    'WhatsApp/Telegram ग्रुप में जुड़ने का न्योता। फ़र्ज़ी टिप ग्रुप ठगी का बड़ा ज़रिया हैं।', 'Invites you to a WhatsApp/Telegram group. Fake tip groups are a major fraud channel.'],
  ['tips', /sure[- ]?shot|jackpot|multibagger|insider|operator|inside\s+(tip|information)|जैकपॉट|ऑपरेटर/i, 3,
    '"पक्की टिप" या अंदरूनी जानकारी का दावा। यह बाज़ार में हेराफेरी की निशानी है।', 'Claims sure-shot or insider tips. A common sign of market manipulation.'],
  ['authority', /(sebi|rbi|nse|bse|cdsl|nsdl|police|cbi)\s*(officer|official|registered|approved|notice|team)|सेबी|आरबीआई|सीबीआई/i, 2,
    'सरकारी संस्था के नाम का इस्तेमाल। नाम सच है या नहीं, खुद अधिकृत वेबसाइट पर जाँचें।', 'Uses the name of a regulator or authority. Verify on the official website yourself.'],
  ['link', /https?:\/\/|bit\.ly|\.apk\b|download\s+(the\s+)?app|लिंक/i, 2,
    'अनजान लिंक या ऐप डाउनलोड करने को कहा गया है।', 'Asks you to open an unknown link or install an app.'],
  ['crypto', /crypto|usdt|bitcoin|forex|क्रिप्टो/i, 2,
    'क्रिप्टो/फ़ॉरेक्स का लालच। ऐसे प्लेटफ़ॉर्म अक्सर अनियंत्रित और फ़र्ज़ी होते हैं।', 'Crypto/forex bait. Such platforms are often unregulated or fake.'],
];

function scanMessage(text) {
  const s = String(text || '').trim();
  if (!s) return { level: 'empty', score: 0, flags: [] };
  const flags = SCAM_RULES.filter(r => r[1].test(s)).map(r => ({ id: r[0], w: r[2], hi: r[3], en: r[4] }));
  const score = flags.reduce((a, f) => a + f.w, 0);
  const level = score >= 6 ? 'high' : score >= 3 ? 'medium' : score >= 1 ? 'low' : 'none';
  return { level, score, flags };
}

if (typeof module !== 'undefined') module.exports = { NOADVICE, SCAMQ, SCAM_RULES, scanMessage };
