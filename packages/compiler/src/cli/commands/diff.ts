import { warning } from '../utils/logger.js';

export async function diff(): Promise<void> {
  warning('The diff command is coming in beta!');
  console.log('\nThis feature will show changes since the last compilation.');
  console.log('Stay tuned for the beta release.');
}
