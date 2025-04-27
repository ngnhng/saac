import { parse, stringify } from "yaml";

export interface Resource {
  name: string;
  subtitle?: string;
  icon?: string;
  description?: string;
  children?: Resource[];
}

export interface Relation {
  from: string;
  to: string;
  label: string;
  description?: string;
}

export interface Perspective {
  name: string;
  relations: Relation[];
}

export interface ArchitectureModel {
  imports?: { from: string; namespace: string }[];
  resources: Resource[];
  perspectives: Perspective[];
}

export function parseArchitectureYaml(yamlContent: string): ArchitectureModel {
  try {
    return parse(yamlContent) as ArchitectureModel;
  } catch (error) {
    console.error("Failed to parse architecture YAML:", error);
    throw error;
  }
}

export function serializeArchitectureModel(model: ArchitectureModel): string {
  return stringify(model);
}
