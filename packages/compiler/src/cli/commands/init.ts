import fse from 'fs-extra';
import { existsSync } from 'node:fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { header, success, error, info } from '../utils/logger.js';
import * as spinner from '../utils/spinner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get templates directory
// When this code runs, it's compiled in dist/index.cli.js
// Templates are in dist/templates/
// So from dist/index.cli.js, templates are in ../templates/
function getTemplatesDir(): string {
  // __dirname when running compiled code points to dist/ directory
  // Templates are copied to dist/templates/ during build
  const templatesPath = path.join(__dirname, 'templates');

  if (!existsSync(templatesPath)) {
    throw new Error(
      `Templates directory not found at ${templatesPath}. Please rebuild the package.`
    );
  }

  return templatesPath;
}

export async function init(): Promise<void> {
  try {
    header('Initializing Reactive Contracts');

    const cwd = process.cwd();

    // 1. Create directories
    spinner.start('Creating directory structure...');
    await fse.ensureDir(path.join(cwd, 'contracts'));
    await fse.ensureDir(path.join(cwd, 'generated', 'frontend'));
    await fse.ensureDir(path.join(cwd, 'generated', 'backend'));
    await fse.ensureDir(path.join(cwd, 'generated', 'runtime'));
    spinner.succeed('Created directory structure');

    // 2. Copy config template
    spinner.start('Creating config file...');
    const configPath = path.join(cwd, 'rcontracts.config.ts');
    if (await fse.pathExists(configPath)) {
      spinner.stop();
      info('Config file already exists, skipping');
    } else {
      const templatePath = path.join(getTemplatesDir(), 'rcontracts.config.template.ts');
      await fse.copy(templatePath, configPath);
      spinner.succeed('Created rcontracts.config.ts');
    }

    // 3. Update .gitignore
    spinner.start('Updating .gitignore...');
    const gitignorePath = path.join(cwd, '.gitignore');
    let gitignoreContent = '';

    if (await fse.pathExists(gitignorePath)) {
      gitignoreContent = await fse.readFile(gitignorePath, 'utf-8');
    }

    if (!gitignoreContent.includes('generated/')) {
      const gitignoreTemplate = await fse.readFile(
        path.join(getTemplatesDir(), 'gitignore.template'),
        'utf-8'
      );
      const updatedContent = gitignoreContent
        ? `${gitignoreContent}\n\n# Reactive Contracts\n${gitignoreTemplate}`
        : gitignoreTemplate;
      await fse.writeFile(gitignorePath, updatedContent);
      spinner.succeed('Updated .gitignore');
    } else {
      spinner.stop();
      info('.gitignore already includes generated/, skipping');
    }

    // 4. Create sample contract
    spinner.start('Creating sample contract...');
    const sampleContractPath = path.join(cwd, 'contracts', 'sample.contract.ts');
    if (await fse.pathExists(sampleContractPath)) {
      spinner.stop();
      info('Sample contract already exists, skipping');
    } else {
      const sampleTemplatePath = path.join(getTemplatesDir(), 'sample-contract.template.ts');
      await fse.copy(sampleTemplatePath, sampleContractPath);
      spinner.succeed('Created sample contract');
    }

    success('Initialization complete!');
    console.log('\nNext steps:');
    console.log('  1. Review the sample contract in contracts/sample.contract.ts');
    console.log('  2. Customize rcontracts.config.ts if needed');
    console.log('  3. Run: npx rcontracts compile');
    console.log('  4. Check the generated/ directory for output');
  } catch (err) {
    spinner.fail('Initialization failed');
    error(`Failed to initialize: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
