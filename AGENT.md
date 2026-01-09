{
  "role": "Senior Software Engineer & Technical Architect",
  "mission": "Implement this open-source project from scratch based on the README.md specification",
  
  "context": {
    "instruction": "Read and analyze the README.md file in this repository thoroughly. It contains the complete product specification including: problem statement, core concepts, API design, configuration options, and usage examples.",
    "source_of_truth": "README.md",
    "project_type": "TypeScript library/framework for frontend development"
  },

  "implementation_phases": [
    {
      "phase": 1,
      "name": "Project Foundation",
      "tasks": [
        "Initialize monorepo structure with pnpm workspaces",
        "Set up TypeScript configuration with strict mode",
        "Configure ESLint, Prettier, and Husky for code quality",
        "Set up Vitest for unit testing",
        "Set up Playwright for E2E testing where applicable",
        "Configure Changesets for versioning",
        "Create CI/CD pipeline with GitHub Actions",
        "Set up package.json with correct exports, types, and module configuration"
      ]
    },
    {
      "phase": 2,
      "name": "Core Implementation",
      "tasks": [
        "Implement core types and interfaces as defined in README API Reference",
        "Build the main runtime/compiler/engine based on Core Concepts section",
        "Implement all primitive functions and utilities",
        "Ensure tree-shaking compatibility",
        "Add comprehensive JSDoc documentation",
        "Write unit tests for all core functionality (aim for >90% coverage)"
      ]
    },
    {
      "phase": 3,
      "name": "Framework Integration",
      "tasks": [
        "Implement React bindings/hooks/components as specified",
        "Create framework adapter pattern for future Vue/Svelte support",
        "Build any CLI tools mentioned in the README",
        "Implement configuration file parsing",
        "Add development mode with helpful warnings and errors"
      ]
    },
    {
      "phase": 4,
      "name": "Developer Experience",
      "tasks": [
        "Create compiler/build plugins (Vite, Webpack, esbuild) if applicable",
        "Implement detailed error messages with suggestions (as shown in README examples)",
        "Build TypeScript language service plugin for IDE support if applicable",
        "Create development server/dashboard if mentioned",
        "Add source maps support"
      ]
    },
    {
      "phase": 5,
      "name": "Documentation & Examples",
      "tasks": [
        "Create docs site structure with Starlight or similar",
        "Write Getting Started guide",
        "Document all API functions with examples",
        "Create example projects demonstrating key features",
        "Add migration guides if relevant",
        "Record short demo videos or GIFs for key features"
      ]
    }
  ],

  "technical_requirements": {
    "language": "TypeScript 5.4+",
    "runtime": "Node.js 20+ LTS",
    "package_manager": "pnpm 9+",
    "module_system": "ESM-first with CJS compatibility",
    "target": "ES2022",
    
    "code_standards": {
      "style": "Functional programming preferred, classes only when necessary",
      "naming": "camelCase for functions/variables, PascalCase for types/classes",
      "exports": "Named exports preferred, default exports for main entry",
      "errors": "Custom error classes with actionable messages",
      "async": "Prefer async/await, avoid callbacks"
    },

    "testing": {
      "framework": "Vitest",
      "coverage_target": ">90%",
      "types": ["Unit tests", "Integration tests", "Type tests with tsd"],
      "e2e": "Playwright for any visual/browser features"
    },

    "bundle": {
      "tool": "tsup or unbuild",
      "formats": ["esm", "cjs"],
      "minification": "Production builds only",
      "sourcemaps": "Always include",
      "size_budget": "Core package < 10KB gzipped"
    }
  },

  "repository_structure": {
    "pattern": "monorepo",
    "layout": [
      "packages/core - Main library",
      "packages/react - React bindings",
      "packages/cli - CLI tool (if applicable)",
      "packages/vite-plugin - Vite plugin (if applicable)",
      "packages/typescript-plugin - TS language service plugin (if applicable)",
      "apps/docs - Documentation site",
      "apps/playground - Interactive playground",
      "examples/ - Example projects"
    ]
  },

  "deliverables": {
    "required": [
      "Fully functional core package implementing all features in README",
      "React integration package with hooks/components",
      "Comprehensive test suite",
      "TypeScript declarations",
      "README with badges, installation, and quick start",
      "CONTRIBUTING.md",
      "LICENSE (MIT or Apache 2.0)",
      "GitHub issue/PR templates",
      "Working CI/CD pipeline"
    ],
    "stretch": [
      "Interactive documentation site",
      "VS Code extension",
      "Playground/sandbox",
      "Performance benchmarks",
      "Vue/Svelte adapters"
    ]
  },

  "constraints": [
    "Zero runtime dependencies in core package where possible",
    "Must work in all modern browsers (Chrome, Firefox, Safari, Edge)",
    "Must be fully tree-shakeable",
    "No breaking changes to API defined in README without discussion",
    "All public APIs must have TypeScript types",
    "Must pass strict TypeScript compilation",
    "No any types in public API",
    "Accessibility must be a first-class concern where applicable"
  ],

  "workflow": {
    "branching": "main (stable), develop (integration), feature/* (work)",
    "commits": "Conventional Commits format",
    "prs": "Require tests, types, and documentation updates",
    "releases": "Semantic versioning via Changesets"
  },

  "success_criteria": [
    "All examples from README.md work as documented",
    "TypeScript catches errors shown in README at compile time",
    "Test coverage >90%",
    "Bundle size within budget",
    "Zero TypeScript errors in strict mode",
    "Documentation covers all public APIs",
    "At least one complete example project"
  ],

  "agent_instructions": {
    "start": "Begin by reading README.md completely. Extract all types, APIs, and behaviors specified.",
    "approach": "Work incrementally. Implement core types first, then primitives, then higher-level APIs.",
    "testing": "Write tests alongside implementation, not after.",
    "communication": "Create GitHub issues for design decisions or ambiguities found in spec.",
    "quality": "Prefer correct over fast. This is foundational infrastructure.",
    "creativity": "README defines WHAT. You decide HOW. Make good engineering decisions.",
    "blockers": "If README is ambiguous, make a reasonable choice and document it."
  }
}
