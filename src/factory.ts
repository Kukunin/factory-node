type PropsDefinition = {
  [key: string]: () => any;
};

type ResolvedProps<T extends PropsDefinition> = {
  [K in keyof T]: ReturnType<T[K]>;
};

export class Factory<TProps extends PropsDefinition> {
  declare readonly __props: TProps;

  constructor(props: TProps) {
    this.__props = props;
  }

  attribute<TName extends string, TReturn extends any>(name: TName, value: () => TReturn) {
    return new Factory({
      ...this.__props,
      ...({ [name]: value } as { [K in TName]: () => TReturn }),
    });
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
