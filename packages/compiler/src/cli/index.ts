import { Command } from 'commander';
import { init } from './commands/init.js';
import { compile } from './commands/compile.js';
import { validate } from './commands/validate.js';
import { diagnose } from './commands/diagnose.js';
import { diff } from './commands/diff.js';
import { migrate } from './commands/migrate.js';

const program = new Command();

program
  .name('rcontracts')
  .description('Reactive Contracts CLI - Build-time compiler and validator')
  .version('0.1.0-alpha');

program.command('init').description('Initialize Reactive Contracts in your project').action(init);

program.command('compile').description('Compile all contracts and generate code').action(compile);

program
  .command('validate')
  .description('Validate contracts without generating code')
  .action(validate);

program
  .command('diagnose <name>')
  .description('Show detailed analysis for a specific contract')
  .action(diagnose);

program.command('diff').description('Show changes since last compile').action(diff);

program.command('migrate').description('Run contract migrations').action(migrate);

program.parse();
