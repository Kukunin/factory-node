import {
  define as defineFactory,
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
    ...args: Parameters<TFactories[TName]['build']>
  ): ReturnType<TFactories[TName]['build']> {
    return this.__factories[name].build(...args) as ReturnType<TFactories[TName]['build']>;
  }

  buildSync<TName extends keyof TFactories>(
    name: TName,
    ...args: Parameters<TFactories[TName]['buildSync']>
  ): ReturnType<TFactories[TName]['buildSync']> {
    return this.__factories[name].buildSync(...args);
  }
}

export const newHolding = () => new Holding({});
