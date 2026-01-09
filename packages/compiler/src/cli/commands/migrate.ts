import { warning } from '../utils/logger.js';

export async function migrate(): Promise<void> {
  warning('The migrate command is coming in beta!');
  console.log('\nThis feature will run contract migrations.');
  console.log('Stay tuned for the beta release.');
}
