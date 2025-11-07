const crypto = require('crypto');
const { execSync } = require('child_process');

const remote = (() => {
  try { return execSync('git config --get remote.origin.url').toString().trim(); }
  catch { return 'no-remote'; }
})();

const epoch = (() => {
  try { return execSync('git log --reverse --format=%ct | head -n1').toString().trim(); }
  catch { return '0'; }
})();

const start = process.env.PROJECT_START_YYYYMMDDHHmm || '';
const raw = `${remote}|${epoch}|${start}`;
const seed = crypto.createHash('sha256').update(raw).digest('hex').slice(0,12);

console.log(JSON.stringify({ remote, epoch, start, seed }, null, 2));
