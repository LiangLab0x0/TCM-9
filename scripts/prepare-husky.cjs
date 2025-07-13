// 安全稳妥：CI 或 HUSKY=0 时直接退出；否则在 git 环境执行 husky install
const { execSync } = require('child_process');
const isCI = !!process.env.CI || process.env.HUSKY === '0';
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  if (!isCI) {
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('husky installed ✔');
  } else {
    console.log('CI / HUSKY=0 detected, skip husky');
  }
} catch {
  console.log('not a git repo, skip husky');
}