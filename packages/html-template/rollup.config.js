import { uglify } from "rollup-plugin-uglify";

// rollup.config.js
export default {
  // 核心选项
  input: 'src/index.js',     // 必须
  plugins: [uglify()],
  output: {  // 必须 (如果要输出多个，可以是一个数组)
    // 核心选项
    file: 'src/index.min.js',    // 必须
    format: 'iife',  // 必须
  },
};