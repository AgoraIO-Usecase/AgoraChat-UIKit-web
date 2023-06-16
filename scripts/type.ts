import handlebars from 'handlebars';
import fs from 'fs';
import { resolve } from 'path';
import path from 'path';

/**
 * 生成类型定义文件 d.ts
 * @param components
 */
export async function generateDTS(entryPath) {
	console.log('entryPath ---', entryPath);
	const __dirname = path.resolve();
	const template = resolve(__dirname, './scripts/entry.d.ts.hbs');
	const dts = resolve(__dirname, entryPath.replace('.js', '.d.ts'));
	// console.log('entryPath', entryPath, entryPath.replace('.js', '.d.ts'));
	// 组件库数据
	const components = await getComponents(entryPath);
	console.log('components --', components);

	// 生成模版
	generateCode(
		{
			components,
		},
		dts,
		template
	);
}

/**
 * 生成代码
 * @param meta 数据定义
 * @param filePath 目标文件路径
 * @param templatePath 模板文件路径
 */
function generateCode(meta, filePath, templatePath) {
	console.log('templatePath', templatePath);
	// if (fs.existsSync(templatePath)) {
	const content = fs.readFileSync(templatePath).toString();
	const result = handlebars.compile(content)(meta);
	fs.writeFileSync(filePath, result);
	// }
	console.log(`🚀${filePath} 创建成功`);
}
/**
 * 获取组件列表
 * 通过解析entry.ts模块获取组件数据
 */
async function getComponents(input) {
	const entry = await import(input);
	return Object.keys(entry)
		.filter((k) => k !== 'default')
		.map((k) => ({
			name: entry[k].name,
			component: k,
		}));
}
