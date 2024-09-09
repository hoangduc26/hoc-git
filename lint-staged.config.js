module.exports = {
  // this will check Typescript files
  "src/**/*.(ts|tsx|js)": () => "yarn tsc --noEmit",

  // This will lint and format TypeScript and JavaScript files
  "src/**/*.(ts|tsx|js|json)": (filenames) => [
    `yarn eslint --fix ${filenames.join(" ")}`,
    `yarn prettier --write ${filenames.join(" ")}`,
  ],
  "src/**/*.scss": (filenames) => [
    `yarn lint:style --fix ${filenames.join(" ")}`,
  ],
};
