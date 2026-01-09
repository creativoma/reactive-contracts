import type { Contract, ShapeDefinition, TypeDefinition } from '@reactive-contracts/core';
import type { ValidationResult } from '../types.js';

/**
 * Validate a contract structure
 */
export function validateContract(contract: Contract): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic contract structure
  if (!contract || typeof contract !== 'object') {
    errors.push('Contract must be a valid object');
    return { valid: false, errors, warnings };
  }

  if (contract._brand !== 'Contract') {
    errors.push('Invalid contract: missing _brand property');
    return { valid: false, errors, warnings };
  }

  const { definition } = contract;

  // Validate name
  if (!definition.name || typeof definition.name !== 'string') {
    errors.push('Contract must have a valid name (non-empty string)');
  } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(definition.name)) {
    warnings.push(
      'Contract name should be in PascalCase (e.g., UserProfile, not userProfile or user_profile)'
    );
  }

  // Validate intent
  if (!definition.intent || typeof definition.intent !== 'string') {
    errors.push('Contract must have a valid intent (non-empty string)');
  } else if (definition.intent.length < 10) {
    warnings.push('Intent should be descriptive (at least 10 characters)');
  }

  // Validate shape
  if (!definition.shape || typeof definition.shape !== 'object') {
    errors.push('Contract must have a valid shape definition');
  } else {
    validateShape(definition.shape, '', errors, warnings);
  }

  // Validate constraints
  if (definition.constraints) {
    validateConstraints(definition.constraints, errors, warnings);
  }

  // Validate reactivity
  if (definition.reactivity) {
    validateReactivity(definition.reactivity, definition.shape, errors, warnings);
  }

  // Validate versioning
  if (definition.versioning) {
    validateVersioning(definition.versioning, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate shape definition recursively
 */
function validateShape(
  shape: ShapeDefinition,
  path: string,
  errors: string[],
  warnings: string[]
): void {
  if (!shape || typeof shape !== 'object') {
    errors.push(`Invalid shape at ${path || 'root'}: must be an object`);
    return;
  }

  const keys = Object.keys(shape);
  if (keys.length === 0) {
    warnings.push(`Shape at ${path || 'root'} is empty`);
  }

  for (const key of keys) {
    const fieldPath = path ? `${path}.${key}` : key;
    const value = shape[key];

    if (!value) {
      errors.push(`Field "${fieldPath}" has undefined value`);
      continue;
    }

    // Validate field name
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key)) {
      warnings.push(
        `Field name "${fieldPath}" should be in camelCase (e.g., firstName, not first_name)`
      );
    }

    // Validate field type
    validateTypeDefinition(value, fieldPath, errors, warnings);
  }
}

/**
 * Validate a type definition
 */
function validateTypeDefinition(
  type: TypeDefinition,
  path: string,
  errors: string[],
  warnings: string[]
): void {
  if (typeof type === 'string') {
    // Primitive type or URL type
    const validPrimitives = ['string', 'number', 'boolean', 'Date', 'null', 'undefined'];
    const isURL = type === 'URL' || type.startsWith('URL<');

    if (!validPrimitives.includes(type) && !isURL) {
      errors.push(`Invalid type at ${path}: "${type}" is not a valid primitive or URL type`);
    }

    // Validate URL optimization syntax
    if (isURL && type !== 'URL') {
      const urlMatch = type.match(/^URL<(.+)>$/);
      if (!urlMatch) {
        errors.push(`Invalid URL type at ${path}: must be "URL" or "URL<options>"`);
      }
    }
  } else if (typeof type === 'object' && type !== null) {
    // Check if it's a DerivedField
    if ('_brand' in type && type._brand === 'DerivedField') {
      validateDerivedField(type as any, path, errors, warnings);
    } else {
      // Nested shape
      validateShape(type as ShapeDefinition, path, errors, warnings);
    }
  } else {
    errors.push(`Invalid type at ${path}: must be a string, object, or DerivedField`);
  }
}

/**
 * Validate derived field
 */
function validateDerivedField(
  field: any,
  path: string,
  errors: string[],
  _warnings: string[]
): void {
  if (typeof field.derive !== 'function') {
    errors.push(`Derived field at ${path} must have a derive function`);
  }

  if (field.dependencies && !Array.isArray(field.dependencies)) {
    errors.push(`Derived field dependencies at ${path} must be an array`);
  }

  if (field.preferredLayer && !['client', 'edge', 'origin'].includes(field.preferredLayer)) {
    errors.push(`Derived field preferredLayer at ${path} must be 'client', 'edge', or 'origin'`);
  }

  if (field.dependencies && Array.isArray(field.dependencies)) {
    for (const dep of field.dependencies) {
      if (typeof dep !== 'string') {
        errors.push(`Derived field dependency at ${path} must be a string`);
      }
    }
  }
}

/**
 * Validate contract constraints
 */
function validateConstraints(constraints: any, errors: string[], _warnings: string[]): void {
  // Validate latency constraint
  if (constraints.latency) {
    const { max, fallback } = constraints.latency;

    if (!max || typeof max !== 'string') {
      errors.push('Latency constraint must have a max value (e.g., "100ms")');
    } else {
      // Validate time format
      if (!/^\d+(ms|s|m)$/.test(max)) {
        errors.push(`Invalid latency max format: "${max}". Use format like "100ms", "1s", or "1m"`);
      }
    }

    if (fallback && !['cachedVersion', 'degraded', 'error'].includes(fallback)) {
      errors.push('Latency fallback must be "cachedVersion", "degraded", or "error"');
    }
  }

  // Validate freshness constraint
  if (constraints.freshness) {
    const { maxAge, staleWhileRevalidate } = constraints.freshness;

    if (!maxAge || typeof maxAge !== 'string') {
      errors.push('Freshness constraint must have a maxAge value');
    } else if (!/^\d+(ms|s|m|h|d)$/.test(maxAge)) {
      errors.push(
        `Invalid freshness maxAge format: "${maxAge}". Use format like "5m", "1h", or "1d"`
      );
    }

    if (staleWhileRevalidate && !/^\d+(ms|s|m|h|d)$/.test(staleWhileRevalidate)) {
      errors.push(
        `Invalid staleWhileRevalidate format: "${staleWhileRevalidate}". Use format like "5m", "1h", or "1d"`
      );
    }
  }

  // Validate availability constraint
  if (constraints.availability) {
    const { uptime, gracefulDegradation } = constraints.availability;

    if (!uptime || typeof uptime !== 'string') {
      errors.push('Availability constraint must have an uptime value');
    } else if (!/^\d+(\.\d+)?%$/.test(uptime)) {
      errors.push(`Invalid uptime format: "${uptime}". Use format like "99.9%"`);
    }

    if (gracefulDegradation !== undefined && typeof gracefulDegradation !== 'boolean') {
      errors.push('Availability gracefulDegradation must be a boolean');
    }
  }
}

/**
 * Validate reactivity configuration
 */
function validateReactivity(
  reactivity: any,
  shape: ShapeDefinition,
  errors: string[],
  warnings: string[]
): void {
  const allFields = new Set<string>();
  collectFieldPaths(shape, '', allFields);

  // Validate realtime fields
  if (reactivity.realtime) {
    if (!Array.isArray(reactivity.realtime)) {
      errors.push('Reactivity realtime must be an array of field paths');
    } else {
      for (const field of reactivity.realtime) {
        if (typeof field !== 'string') {
          errors.push('Realtime field must be a string');
        } else if (!allFields.has(field)) {
          warnings.push(`Realtime field "${field}" does not exist in shape`);
        }
      }
    }
  }

  // Validate static fields
  if (reactivity.static) {
    if (!Array.isArray(reactivity.static)) {
      errors.push('Reactivity static must be an array of field paths');
    } else {
      for (const field of reactivity.static) {
        if (typeof field !== 'string') {
          errors.push('Static field must be a string');
        } else if (!allFields.has(field)) {
          warnings.push(`Static field "${field}" does not exist in shape`);
        }
      }
    }
  }

  // Validate polling config
  if (reactivity.polling) {
    if (!Array.isArray(reactivity.polling)) {
      errors.push('Reactivity polling must be an array');
    } else {
      for (const config of reactivity.polling) {
        if (!config.field || typeof config.field !== 'string') {
          errors.push('Polling config must have a field property');
        } else if (!allFields.has(config.field)) {
          warnings.push(`Polling field "${config.field}" does not exist in shape`);
        }

        if (!config.interval || typeof config.interval !== 'string') {
          errors.push('Polling config must have an interval property');
        } else if (!/^\d+(ms|s|m)$/.test(config.interval)) {
          errors.push(
            `Invalid polling interval format: "${config.interval}". Use format like "30s" or "5m"`
          );
        }
      }
    }
  }

  // Validate event-driven config
  if (reactivity.eventDriven) {
    if (!Array.isArray(reactivity.eventDriven)) {
      errors.push('Reactivity eventDriven must be an array');
    } else {
      for (const config of reactivity.eventDriven) {
        if (!config.field || typeof config.field !== 'string') {
          errors.push('EventDriven config must have a field property');
        } else if (!allFields.has(config.field)) {
          warnings.push(`EventDriven field "${config.field}" does not exist in shape`);
        }

        if (!config.on || !Array.isArray(config.on)) {
          errors.push('EventDriven config must have an "on" array of event names');
        } else if (config.on.length === 0) {
          warnings.push(`EventDriven config for "${config.field}" has no events`);
        }
      }
    }
  }
}

/**
 * Validate versioning configuration
 */
function validateVersioning(versioning: any, errors: string[], warnings: string[]): void {
  if (!versioning.version || typeof versioning.version !== 'string') {
    errors.push('Versioning must have a version string');
  } else if (!/^\d+\.\d+\.\d+$/.test(versioning.version)) {
    warnings.push(`Version "${versioning.version}" should follow semver format (e.g., "1.0.0")`);
  }

  if (versioning.deprecated && !Array.isArray(versioning.deprecated)) {
    errors.push('Versioning deprecated must be an array of field paths');
  }

  if (versioning.migration && typeof versioning.migration !== 'function') {
    errors.push('Versioning migration must be a function');
  }
}

/**
 * Helper to collect all field paths from shape
 */
function collectFieldPaths(shape: ShapeDefinition, prefix: string, result: Set<string>): void {
  for (const [key, value] of Object.entries(shape)) {
    const path = prefix ? `${prefix}.${key}` : key;
    result.add(path);

    if (
      typeof value === 'object' &&
      value !== null &&
      !('_brand' in value) &&
      typeof value !== 'string'
    ) {
      collectFieldPaths(value as ShapeDefinition, path, result);
    }
  }
}
