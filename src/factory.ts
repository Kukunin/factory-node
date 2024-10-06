type PropsDefinition = {
  [key: string]: () => unknown;
};

type ResolvedProps<T extends PropsDefinition> = {
  [K in keyof T]: ReturnType<T[K]>;
};

type Merge<T> = T extends object ? { [K in keyof T]: T[K] } : never;

export class Factory<TProps extends PropsDefinition> {
  constructor(private readonly __props: TProps) {}

  attribute<TName extends string, TReturn>(name: TName, value: () => TReturn) {
    return new Factory({
      ...this.__props,
      [name]: value,
    } as Merge<TProps & { [K in TName]: () => TReturn }>);
  }

  async build(overrides: Partial<ResolvedProps<TProps>> = {}): Promise<ResolvedProps<TProps>> {
    return this.buildSync(overrides);
  }

  buildSync(overrides: Partial<ResolvedProps<TProps>> = {}): ResolvedProps<TProps> {
    return Object.entries(this.__props).reduce(
      (attributes, [key, value]) => ({
        ...attributes,
        [key]: key in overrides ? overrides[key] : value(),
      }),
      {},
    ) as ResolvedProps<TProps>;
  }
}

export const define = () => new Factory({});
