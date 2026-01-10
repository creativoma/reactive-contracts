#!/usr/bin/env node

// Import the compiled CLI
import('../index.cli.js').catch((error) => {
  console.error('Failed to start CLI:', error);
  process.exit(1);
});
