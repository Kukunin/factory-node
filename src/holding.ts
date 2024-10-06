import { define as defineFactory, AnyFactory } from './factory';

type FactoriesDefinition = {
  [key: string]: AnyFactory;
};

class Holding<TFactories extends FactoriesDefinition> {
  declare readonly __factories: TFactories;

  constructor(factories: TFactories) {
    this.__factories = factories;
  }

  factory<TName extends string, TReturn extends AnyFactory>(
    name: TName,
    definition: (factory: AnyFactory) => TReturn,
  ) {
    const factory = definition(defineFactory());
    return new Holding({
      ...this.__factories,
      ...({ [name]: factory } as { [K in TName]: TReturn }),
    });
  }

  build<TName extends keyof TFactories>(
    name: TName,
    overrides: Parameters<TFactories[TName]['build']>[0] = {},
  ): Promise<ReturnType<TFactories[TName]['build']>> {
    return this.__factories[name].build(overrides) as Promise<ReturnType<TFactories[TName]['build']>>;
  }

  buildSync<TName extends keyof TFactories>(
    name: TName,
    overrides: Parameters<TFactories[TName]['build']>[0] = {},
  ): ReturnType<TFactories[TName]['build']> {
    return this.__factories[name].buildSync(overrides) as ReturnType<TFactories[TName]['build']>;
  }
}

export const define = () => new Holding({});
