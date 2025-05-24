export interface StyleObject {
  selectors?: Array<string | SelectorObject>;
  style?: Record<string, string>;
  mediaText?: string;
  atRuleType?: string;
}

export interface SelectorObject {
  name: string;
  private?: boolean;
}

export interface ClassObject {
  name: string;
  [key: string]: unknown;
}

export interface ComponentObject {
  type?: string;
  tagName?: string;
  content?: string;
  attributes?: Record<string, string>;
  style?: Record<string, string>;
  classes?: Array<string | ClassObject>;
  components?: ComponentObject[];
  [key: string]: unknown;
}

export interface ColumnSystemOptions {
  gridLabel?: string;
  flexLabel?: string;
  category?: string;
  blockManager?: boolean;
  blocks?: {
    flexRow?: boolean;
    gridRow?: boolean;
  };
  styleManager?: boolean;
}

export interface PageInfo {
  id: string;
  name: string;
}