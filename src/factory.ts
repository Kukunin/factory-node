interface FactoryDSL {
  attribute: (name: string, value: () => any) => void;
}

interface DefinitionDSL {
  factory: (name: string, factory: (dsl: FactoryDSL) => void) => void;
}

interface Factory {
  build: (name: string) => any;
}

interface FactoryDefinition {
  attributes: { [name: string]: () => any };
}

export const define = (definition: (dsl: DefinitionDSL) => void): Factory => {
  const factories: { [name: string]: FactoryDefinition } = {};

  definition({
    factory: (name, factoryFn) => {
      const factory: FactoryDefinition = {
        attributes: {},
      }

      factoryFn({
        attribute: (name, valueFn) => {
          factory.attributes[name] = valueFn;
        }
      })

      factories[name] = factory
    }
  });

  return {
    build: (name) => {
      const factory = factories[name];
      return Object.entries(factory.attributes).reduce((attributes, [key, value]) => ({
        ...attributes,
        [key]: value(),
      }), {})
    },
  };
};
