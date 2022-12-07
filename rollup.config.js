import includePaths from 'rollup-plugin-includepaths';

let includePathOptions = {
    include: {},
    paths: ['src/'],
    external: [],
    extensions: ['.js', '.ts', '.json', '.html']
};
 
export default {
  output: {
    dir: "output",
    format: "mjs",
  },
      plugins: [includePath(includePathOptions) ],
};
