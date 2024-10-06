type PropsDefinition = {
  [key: string]: () => unknown;
};

type ResolvedProps<T extends PropsDefinition> = {
  [K in keyof T]: ReturnType<T[K]>;
};

type Merge<T> = T extends object ? { [K in keyof T]: T[K] } : never;

export type AnyFactory = Factory<{ [K in never]: never }>;

type BuildArgs<TProps extends PropsDefinition> = [...string[]] | [...string[], Partial<ResolvedProps<TProps>>]

export class Factory<TProps extends PropsDefinition> {
  constructor(protected readonly __props: TProps, protected readonly __traits: Record<string, Partial<TProps>> = {}) {}

  attribute<TName extends string, TReturn>(name: TName, value: () => TReturn) {
    return new Factory(
      { ...this.__props, [name]: value },
      this.__traits
    ) as unknown as Factory<Merge<TProps & { [K in TName]: () => TReturn }>>
  }

  trait(name: string, traitFn: (factory: TraitFactory<TProps>) => TraitFactory<TProps>): Factory<TProps> {
    const traitFactory = new TraitFactory({}) as TraitFactory<TProps>;
    const props = traitFn(traitFactory).getProps();
    return new Factory(this.__props, { ...this.__traits, [name]: props });
  }

  async build(...args: BuildArgs<TProps>): Promise<ResolvedProps<TProps>> {
    return this.buildSync(...args);
  }

  buildSync(...args: BuildArgs<TProps>): ResolvedProps<TProps> {
    const { traitNames, overrides } = this.parseArgs(...args);
    const finalProps = this.applyTraits(...traitNames);

    return Object.entries(finalProps).reduce(
      (attributes, [key, value]) => ({
        ...attributes,
        [key]: key in overrides ? overrides[key] : value(),
      }),
      {},
    ) as ResolvedProps<TProps>;
  }

  private applyTraits(...traitNames: string[]): PropsDefinition {
    return traitNames.reduce((props, traitName) => {
      const trait = this.__traits[traitName];
      if (!trait) {
        throw new Error(`Unknown ${traitName} trait`);
      }
      console.log('Applying trait', traitName);
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

export const define = () => new Factory({});
