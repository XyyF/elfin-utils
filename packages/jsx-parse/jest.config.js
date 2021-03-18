/**
 * jest.config.js 配置文件
 * 文档：https://jestjs.io/docs/zh-Hans/configuration
 */

module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'json'],
    // jest应该搜索的文件列表 [String]
    roots: [
        '<rootDir>/test/',
    ],
    testRegex: '.+?\\.test\\.js$',
    'verbose': true,
    'moduleDirectories': [
        'node_modules',
    ],
    'modulePaths': [
        '<rootDir>/node_modules',
    ],
    'globals': {
        'NODE_ENV': 'test',
    },
}