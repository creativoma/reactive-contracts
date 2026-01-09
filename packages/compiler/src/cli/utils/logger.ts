import pc from 'picocolors';

export function success(message: string): void {
  console.log(pc.green('✓'), message);
}

export function error(message: string): void {
  console.log(pc.red('✗'), message);
}

export function warning(message: string): void {
  console.log(pc.yellow('⚠'), message);
}

export function info(message: string): void {
  console.log(pc.blue('ℹ'), message);
}

export function log(message: string): void {
  console.log(message);
}

export function header(message: string): void {
  console.log('\n' + pc.bold(pc.cyan(message)) + '\n');
}
