import { defineConfig } from "rollup";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import dts from "rollup-plugin-dts";

const plugins = [
  babel(),
  typescript({
    sourceMap: false,
  }),
  resolve(),
];
export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: `dist/index.cjs.js`,
        // commonjs格式
        format: "cjs",
      },
      {
        file: `dist/index.es.js`,
        // es module
        format: "es",
      },
      {
        file: `dist/index.umd.js`,
        // 通用格式可以用于node和browser等多个场景
        format: "umd",
        // 外部引入的模块需要显式告知使用的三方模块的命名，结合下面的external使用
        globals: {
          axios: "superagent",
        },
        // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
        name: "swagger-to-request",
      },
    ],
    external: ["superagent"],
    plugins,
  },
  {
    input: "src/type.d.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "es",
        plugins: [],
      },
    ],
    plugins: [dts()],
  },
]);
