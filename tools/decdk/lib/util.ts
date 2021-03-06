import fs = require('fs-extra');
import jsiiReflect = require('jsii-reflect');
import path = require('path');
import YAML = require('yaml');

/**
 * Reads a YAML/JSON template file.
 */
export async function readTemplate(templateFile: string) {
  const str = await fs.readFile(templateFile, { encoding: 'utf-8' });
  const template = YAML.parse(str, { schema: 'yaml-1.1' });
  return template;
}

export async function loadTypeSystem() {
  const typeSystem = new jsiiReflect.TypeSystem();
  const packageJson = require('../package.json');

  for (const depName of Object.keys(packageJson.dependencies || {})) {
    const jsiiModuleDir = path.dirname(require.resolve(`${depName}/package.json`));
    if (!fs.existsSync(path.resolve(jsiiModuleDir, '.jsii'))) {
      continue;
    }
    await typeSystem.load(jsiiModuleDir);
  }

  return typeSystem;
}

export function stackNameFromFileName(fileName: string) {
  return path.parse(fileName).name.replace('.', '-');
}
