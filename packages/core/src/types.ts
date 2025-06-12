export interface ModuleMetadata {
  /**
   * Unique identifier for the module
   */
  id: string;
  /**
   * Semantic version of the module
   */
  version: string;
  /**
   * Human readable name
   */
  name: string;
  /**
   * Short description of the module
   */
  description: string;
  /**
   * Types this module accepts as input
   */
  inputs: string[];
  /**
   * Types this module outputs
   */
  outputs: string[];
  /**
   * JSON schema describing the configuration UI
   */
  uiSchema: Record<string, unknown>;
  /**
   * Optional list of incompatible module ids
   */
  incompatible?: string[];
}
