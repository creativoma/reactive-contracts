import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reactiveContracts } from './index.js';

// Mock the compiler module
vi.mock('@reactive-contracts/compiler', () => ({
  loadConfig: vi.fn().mockResolvedValue({
    contracts: './contracts/**/*.contract.ts',
    output: {
      frontend: './generated/frontend',
      backend: './generated/backend',
      runtime: './generated/runtime',
    },
  }),
  compileAll: vi.fn().mockResolvedValue({
    success: true,
    results: [],
    errors: [],
    warnings: [],
  }),
  compileContract: vi.fn().mockResolvedValue({
    contract: {},
    validation: { valid: true, errors: [], warnings: [] },
    latency: { status: 'ok', suggestions: [] },
    generated: { frontend: './generated/frontend/Test.ts' },
  }),
  parseContractFile: vi.fn().mockResolvedValue({
    contracts: [{ name: 'TestContract', contract: { definition: { name: 'Test' } } }],
    errors: [],
  }),
  findContractFiles: vi.fn().mockResolvedValue([]),
  isContractFile: vi.fn((file: string) => file.endsWith('.contract.ts')),
}));

describe('reactiveContracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a plugin with correct name', () => {
    const plugin = reactiveContracts();
    expect(plugin.name).toBe('reactive-contracts');
  });

  it('should create a plugin with default options', () => {
    const plugin = reactiveContracts();
    expect(plugin).toBeDefined();
    expect(plugin.name).toBe('reactive-contracts');
    expect(typeof plugin.configResolved).toBe('function');
    expect(typeof plugin.buildStart).toBe('function');
    expect(typeof plugin.configureServer).toBe('function');
    expect(typeof plugin.handleHotUpdate).toBe('function');
  });

  it('should accept custom options', () => {
    const plugin = reactiveContracts({
      configFile: './custom.config.ts',
      hmr: false,
      compileOnBuildStart: false,
      logLevel: 'silent',
    });
    expect(plugin).toBeDefined();
  });

  it('should accept inline config', () => {
    const plugin = reactiveContracts({
      config: {
        contracts: './src/contracts/*.contract.ts',
        output: {
          frontend: './src/generated/frontend',
          backend: './src/generated/backend',
          runtime: './src/generated/runtime',
        },
      },
    });
    expect(plugin).toBeDefined();
  });

  describe('configResolved', () => {
    it('should load config when configResolved is called', async () => {
      const { loadConfig } = await import('@reactive-contracts/compiler');
      const plugin = reactiveContracts();

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);

      expect(loadConfig).toHaveBeenCalledWith(undefined, '/test/project');
    });

    it('should use custom config file path', async () => {
      const { loadConfig } = await import('@reactive-contracts/compiler');
      const plugin = reactiveContracts({
        configFile: './custom.config.ts',
      });

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);

      expect(loadConfig).toHaveBeenCalledWith('./custom.config.ts', '/test/project');
    });
  });

  describe('buildStart', () => {
    it('should compile contracts on build start by default', async () => {
      const { compileAll } = await import('@reactive-contracts/compiler');
      const plugin = reactiveContracts();

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);
      await plugin.buildStart?.();

      expect(compileAll).toHaveBeenCalled();
    });

    it('should not compile on build start when disabled', async () => {
      const { compileAll } = await import('@reactive-contracts/compiler');
      const plugin = reactiveContracts({
        compileOnBuildStart: false,
      });

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);
      await plugin.buildStart?.();

      expect(compileAll).not.toHaveBeenCalled();
    });
  });

  describe('handleHotUpdate', () => {
    it('should handle contract file changes', async () => {
      const { isContractFile, parseContractFile, compileContract } =
        await import('@reactive-contracts/compiler');

      const plugin = reactiveContracts();

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);

      const mockContext = {
        file: '/test/project/contracts/test.contract.ts',
        server: {
          moduleGraph: {
            getModuleById: vi.fn().mockReturnValue(null),
            invalidateModule: vi.fn(),
          },
          ws: {
            send: vi.fn(),
          },
        },
      };

      await plugin.handleHotUpdate?.(mockContext);

      expect(isContractFile).toHaveBeenCalledWith('/test/project/contracts/test.contract.ts');
      expect(parseContractFile).toHaveBeenCalled();
      expect(compileContract).toHaveBeenCalled();
    });

    it('should ignore non-contract files', async () => {
      const { isContractFile, parseContractFile } = await import('@reactive-contracts/compiler');

      (isContractFile as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const plugin = reactiveContracts();

      const mockConfig = {
        root: '/test/project',
      };

      await plugin.configResolved?.(mockConfig);

      const mockContext = {
        file: '/test/project/src/component.tsx',
        server: {
          moduleGraph: {
            getModuleById: vi.fn(),
            invalidateModule: vi.fn(),
          },
          ws: {
            send: vi.fn(),
          },
        },
      };

      await plugin.handleHotUpdate?.(mockContext);

      expect(parseContractFile).not.toHaveBeenCalled();
    });
  });
});

describe('default export', () => {
  it('should export reactiveContracts as default', async () => {
    const { default: defaultExport } = await import('./index.js');
    expect(defaultExport).toBe(reactiveContracts);
  });
});
