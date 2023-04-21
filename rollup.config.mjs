import { defineConfig } from "rollup";
// 让 rollup 能够处理外部依赖
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
// 自动将外部类库声明为 externals
import externals from "rollup-plugin-node-externals";
// 打包ts文件
import typescript from "rollup-plugin-typescript";
// 生成 d.ts 文件
import dts from "rollup-plugin-dts";
// 打包产物清除调试代码
import strip from "@rollup/plugin-strip";

const plugins = [
  typescript({
    sourceMap: false,
  }),
  commonjs(),
  resolve(),
  externals({
    devDeps: false, // devDependencies 类型的依赖就不用加到 externals 了。
  }),
  strip(),
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
          request: "request",
        },
        // 注意如果是umd格式的bundle的话name属性是必须的，这时可以在script标签引入后window下会挂载该属性的变量来使用你的类库方法
        name: "swagger-to-request",
      },
    ],
    external: ["request"],
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
