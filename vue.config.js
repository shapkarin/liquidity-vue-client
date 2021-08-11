const path = require('path')

module.exports = {
	devServer: {
		disableHostCheck: true,
	},

	configureWebpack: {
		resolve: {
			symlinks: true,
			alias: {
				vue$: path.resolve('./node_modules/vue/dist/vue.esm-bundler.js'),
				'@': path.resolve(__dirname, 'src/*'),
			},
			extensions: ['.js', '.ts', '.vue'],
		},
		entry: ['./node_modules/regenerator-runtime/runtime.js', './src/main.ts'],
	},

	// pluginOptions: {
	// 	i18n: {
	// 		locale: 'en',
	// 		fallbackLocale: 'ru',
	// 		localeDir: 'locales',
	// 		enableLegacy: false,
	// 		runtimeOnly: false,
	// 		compositionOnly: false,
	// 		fullInstall: true,
	// 	},
	// },
}
