import { config } from "dotenv";
import { resolve } from "path";

config();

export default {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  transformIgnorePatterns: [],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFiles: [resolve("node_modules", "dotenv", "config")],
};
