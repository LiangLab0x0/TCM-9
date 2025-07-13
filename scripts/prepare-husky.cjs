// Skip husky install if not inside a git repo or in CI
const { execSync } = require('child_process');
const isCI = Boolean(process.env.CI);
try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  if (!isCI) {
    execSync('npx husky', { stdio: 'inherit' });
    console.log('husky installed ✔');
  } else {
    console.log('CI env detected, skip husky');
  }
} catch {
  console.log('No .git directory, skip husky');
}