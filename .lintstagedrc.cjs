module.exports = {
  '*.{js,ts,jsx,tsx,json,md}': (files) => {
    const list = files.join(' ');
    return [`prettier --write ${list}`, `git add ${list}`];
  }
};