import { define as defineFactory, Factory } from './factory';

type FactoriesDefinition = {
  [key: string]: Factory<any>;
};

class Holding<TFactories extends FactoriesDefinition> {
  declare readonly __factories: TFactories;

  constructor(factories: TFactories) {
    this.__factories = factories;
  }

  factory<TName extends string, TReturn extends Factory<any>>(
    name: TName,
    definition: (factory: Factory<{}>) => TReturn,
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
  ): ReturnType<TFactories[TName]['build']> {
    return this.__factories[name].build(overrides) as ReturnType<TFactories[TName]['build']>;
  }
}

export const define = () => new Holding({});
