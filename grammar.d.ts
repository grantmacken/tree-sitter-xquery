declare interface IGrammar {
  name: string;
  extras?: ($: IRules & IExternals) => any;
  inline?: ($: IRules & IExternals) => any;
  conflicts?: ($: IRules & IExternals) => any;
  externals?: ($: IExternals) => any;
  word?: ($: IRules & IExternals) => any;
  supertypes?: ($: IRules & IExternals) => any;
  reserved?: ($: IRules & IExternals) => any;
  precedences?: ($: IRules & IExternals) => any;
  rules: IRules;
}

declare function grammar(g: IGrammar): any;

declare type TRule = (($: IRules & IExternals) => any) | string | RegExp;

declare interface IPrecFunc {
  (rule: TRule): TRule;
  (val: number | string, rule: TRule): TRule;
}

declare interface ITokenFunc {
  (rule: TRule): TRule;
}

declare function seq(...rules: TRule[]): TRule;
declare function choice(...rules: TRule[]): TRule;
declare function repeat(rule: TRule): TRule;
declare function repeat1(rule: TRule): TRule;
declare function optional(rule: TRule): TRule;
declare function alias(rule: TRule, name: TRule): TRule;
declare function field(name: string, rule: TRule): TRule;
declare const prec: IPrecFunc & {
  left: IPrecFunc;
  right: IPrecFunc;
  dynamic: (val: number, rule: TRule) => TRule;
};
declare const token: ITokenFunc & { immediate: ITokenFunc }
