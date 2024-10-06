type PropsDefinition = {
  [key: string]: () => unknown;
};

type ResolvedProps<T extends PropsDefinition> = {
  [K in keyof T]: ReturnType<T[K]>;
};

type Merge<T> = T extends object ? { [K in keyof T]: T[K] } : never;

type BuildArgs<TProps extends PropsDefinition> = [...string[]] | [...string[], Partial<ResolvedProps<TProps>>]

type InitializeWithFn<T extends PropsDefinition> = (props: ResolvedProps<T>) => unknown;

type UpdateInitializeWith<
  TProps extends PropsDefinition,
  TOld extends InitializeWithFn<TProps>,
  TNew extends PropsDefinition
> = (props: ResolvedProps<TNew>) => ReturnType<TOld> extends ResolvedProps<PropsDefinition>
  ? ResolvedProps<TNew>
  : ReturnType<TOld>;

export class Factory<
  TProps extends PropsDefinition,
  TInitializeWith extends InitializeWithFn<TProps> = (props: ResolvedProps<TProps>) => ResolvedProps<TProps>
> {
  constructor(
    protected readonly __props: TProps,
    protected readonly __traits: Record<string, Partial<TProps>>,
    private readonly __initializeWith: TInitializeWith
  ) {}

  attribute<TName extends string, TReturn>(
    name: TName,
    value: () => TReturn
  ) {
    const newProps = { ...this.__props, [name]: value } as Merge<TProps & { [K in TName]: () => TReturn }>;
    return new Factory(
      newProps,
      this.__traits,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.__initializeWith as any
    ) as Factory<
      Merge<TProps & { [K in TName]: () => TReturn }>,
      UpdateInitializeWith<TProps, TInitializeWith, Merge<TProps & { [K in TName]: () => TReturn }>>
    >;
  }

  trait(name: string, traitFn: (factory: TraitFactory<TProps>) => TraitFactory<TProps>): Factory<TProps, TInitializeWith> {
    const traitFactory = new TraitFactory({}) as TraitFactory<TProps>;
    const props = traitFn(traitFactory).getProps();
    return new Factory(this.__props, { ...this.__traits, [name]: props }, this.__initializeWith);
  }

  initializeWith<TNewResult>(
    initializeWith: (props: ResolvedProps<TProps>) => TNewResult
  ): Factory<TProps, typeof initializeWith> {
    return new Factory(this.__props, this.__traits, initializeWith);
  }

  async build(...args: BuildArgs<TProps>): Promise<ReturnType<TInitializeWith>> {
    return this.buildSync(...args);
  }

  buildSync(...args: BuildArgs<TProps>): ReturnType<TInitializeWith> {
    const { traitNames, overrides } = this.parseArgs(...args);
    const finalProps = this.applyTraits(...traitNames);

    const result = Object.entries(finalProps).reduce(
      (attributes, [key, value]) => ({
        ...attributes,
        [key]: key in overrides ? overrides[key] : value(),
      }),
      {},
    ) as ResolvedProps<TProps>;
    return this.__initializeWith(result) as ReturnType<TInitializeWith>;
  }

  private applyTraits(...traitNames: string[]): PropsDefinition {
    return traitNames.reduce((props, traitName) => {
      const trait = this.__traits[traitName];
      if (!trait) {
        throw new Error(`Unknown ${traitName} trait`);
      }
      return { ...props, ...trait };
    }, this.__props);
  }

  private parseArgs(...args: BuildArgs<TProps>): { traitNames: string[], overrides: Partial<ResolvedProps<TProps>> } {
    const traitNames = [...args] as string[];
    const lastArg = traitNames[traitNames.length - 1];
    const overrides = (lastArg && typeof lastArg !== 'string' ? traitNames.pop() : {}) as Partial<ResolvedProps<TProps>>;
    return { traitNames, overrides };
  }
}

class TraitFactory<TProps extends PropsDefinition> {
  constructor(protected readonly __props: Partial<TProps>) {}

  attribute<TName extends keyof TProps>(name: TName, value: TProps[TName]): TraitFactory<TProps> {
    return new TraitFactory({ ...this.__props, [name]: value }) as TraitFactory<TProps>;
  }

  trait(): never {
    throw new Error('Traits cannot be nested');
  }

  getProps() {
    return this.__props;
  }
}

export const define = () => new Factory({}, {}, (result) => result);

export type EmptyFactory = ReturnType<typeof define>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryAttributes<F> = F extends Factory<infer TProps, any> ? ResolvedProps<TProps> : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FactoryBuildResult<F> = F extends Factory<any, infer TInitializeWith> ? ReturnType<TInitializeWith> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFactory = Factory<any, any>;
