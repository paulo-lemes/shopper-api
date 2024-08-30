import type { Config } from "@jest/types";

process.env.APP_DIRNAME = __dirname;

const config: Config.InitialOptions = {
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleDirectories: ["node_modules", "src"],
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};

export default config;
