const assert = require('node:assert');
const { test } = require('node:test');
const { NOADVICE, scanMessage } = require('../js/rules.js');

test('blocks tips and buy/sell advice', () => {
  ['which stock should I buy', 'should I sell my shares now', 'give me a tip', 'कौन सा शेयर खरीदें', 'शेयर टिप दो']
    .forEach(q => assert.ok(NOADVICE.test(q), q));
});
test('does not block heirs, complaints or rights questions', () => {
  ['My husband was a shareholder and passed away', 'पति ने शेयर खरीदे थे, अब वे नहीं रहे', 'broker has put my money on hold', 'how to file a complaint on SCORES', 'I joined a multiple-account plan']
    .forEach(q => assert.ok(!NOADVICE.test(q), q));
});
test('flags a classic recovery-agent scam as high risk', () => {
  const r = scanMessage('We are SEBI registered fund recovery team. Pay a processing fee today and share the OTP to get your money back. Join our WhatsApp group');
  assert.strictEqual(r.level, 'high');
});
test('flags Hindi guaranteed-return bait', () => {
  assert.ok(['medium', 'high'].includes(scanMessage('पक्का मुनाफ़ा, पैसा दोगुना, आज ही टेलीग्राम ग्रुप में जुड़ें').level));
});
test('benign notice stays quiet; empty input handled', () => {
  assert.strictEqual(scanMessage('Your account statement for March is ready.').level, 'none');
  assert.strictEqual(scanMessage('   ').level, 'empty');
});
