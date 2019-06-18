import { writeFile } from "fs";
import { argv } from "yargs";

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require("dotenv").config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const targetPath = `./src/environments/environment.${environment}.ts`;
let isProd = false;
if (
  environment === "prod.apmis" ||
  environment === "prod.tertiary" ||
  environment === "prod.navlagos"
) {
  isProd = true;
}

let envConfigFile = `
export const environment = {
  production: ${isProd},
  platform: "${process.env.APMIS_PLATFORM_NAME}",
  logo: "${process.env.APMIS_LOGO}",
  secondary_logo: "",
  title: "${process.env.APMIS_TITLE}"
};
`;
if (environment === "prod.apmis") {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.APMIS_PLATFORM_NAME}",
    logo: "${process.env.APMIS_LOGO}",
    secondary_logo: "",
    title: "${process.env.APMIS_TITLE}"
  };
  `;
} else if (environment === "prod.tertiary") {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.TERTIARY_PLATFORM_NAME}",
    logo: "${process.env.TERTIARY_LOGO}",
    secondary_logo: "${process.env.SECONDARY_TERTIARY_LOGO}",
    title: "${process.env.TERTIARY_TITLE}"
  };
  `;
} else if (environment === "prod.navlagos") {
  envConfigFile = `
  export const environment = {
    production: ${isProd},
    platform: "${process.env.NAF_HMS_LAGOS_NAME}",
    logo: "${process.env.NAV_HMS_LOGO}",
    secondary_logo: "${process.env.SECONDARY_NAV_HMS_LOGO}",
    title: "${process.env.NAF_LAGOS_TITLE}"
  };
  `;
}

writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
  }
});
