/**
 * Mock Contract Client
 *
 * Configura el cliente de contratos para usar un mock server local.
 * En producción, esto apuntaría a tu API real.
 */

import { configureContractClient } from '@reactive-contracts/react';

// Configurar el cliente para usar nuestro mock server
export function setupMockContractClient() {
  configureContractClient({
    baseUrl: 'http://localhost:3001/api/contracts',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('📝 Contract client configured for mock server at http://localhost:3001');
}
