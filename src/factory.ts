interface FactoryDSL {
  attribute: (name: string, value: () => any) => void
}

interface DefinitionDSL {
  factory: (name: string, factory: (dsl: FactoryDSL) => void) => void
}

interface Factory {
  build: (name: string, overrides?: any) => any
}

export const define = (definition: (dsl: DefinitionDSL) => void): Factory => {
  return {} as any
}
