import {
  define as defineFactory,
  FactoryAttributes,
  FactoryBuildResult,
  AnyFactory,
  EmptyFactory
} from './factory';

type FactoriesDefinition = {
  [key: string]: AnyFactory;
};

class Holding<TFactories extends FactoriesDefinition> {
  declare readonly __factories: TFactories;

  constructor(factories: TFactories) {
    this.__factories = factories;
  }

  define<TName extends string, TFactory extends AnyFactory>(
    name: TName,
    definition: (factory: EmptyFactory) => TFactory,
  ) {
    const factory = definition(defineFactory());
    return new Holding({
      ...this.__factories,
      ...({ [name]: factory } as { [K in TName]: TFactory }),
    });
  }

  build<TName extends keyof TFactories>(
    name: TName,
    overrides: Partial<FactoryAttributes<TFactories[TName]>> = {},
  ): Promise<FactoryBuildResult<TFactories[TName]>> {
    return this.__factories[name].build(overrides);
  }

  buildSync<TName extends keyof TFactories>(
    name: TName,
    overrides: Partial<FactoryAttributes<TFactories[TName]>> = {},
  ): FactoryBuildResult<TFactories[TName]> {
    return this.__factories[name].buildSync(overrides);
  }
}

export const newHolding = () => new Holding({});
