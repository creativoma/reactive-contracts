import ora, { type Ora } from 'ora';

let currentSpinner: Ora | null = null;

export function start(text: string): Ora {
  if (currentSpinner) {
    currentSpinner.stop();
  }
  currentSpinner = ora(text).start();
  return currentSpinner;
}

export function succeed(text: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(text);
    currentSpinner = null;
  }
}

export function fail(text: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text);
    currentSpinner = null;
  }
}

export function stop(): void {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }
}
