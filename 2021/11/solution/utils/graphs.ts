export type LlNode = {val: any, next?: LlNode};
export const llNode = (val: any): LlNode => ({val});

export type GraphNode = {val: any, children: GraphNode[]};
export const graphNode = (val: any): GraphNode => ({val, children: []});
