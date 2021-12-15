import assert from "assert";

export type Node<T> = {
    name: string;
    val?: T;
    children: string[];
    parents: string[];
}

export type Edge = {parent: string, child: string};

export type GraphTraversalValidationFunction = <T>(nextNodeName: string, path: string[], allPaths: string[]) => boolean;

export type Graph<T> = {
    addNode: (name: string, val?: T) => Graph<T>,
    addConnection: (child: string, parent: string, symmetrical: boolean) => Graph<T>,
    shortestPath: (from: string, to: string, validationStrategy?: GraphTraversalValidationFunction, type?: 'bfs' | 'dfs') => string[],
    allPaths: (from: string, to: string, validationStrategy?: GraphTraversalValidationFunction, type?: 'bfs' | 'dfs') => string[][],
    inner: () => {nodesMap: Map<string, Node<T>>}
}


export const defaultGraphValidationStrategy: GraphTraversalValidationFunction = (nextNodeName, path) => {
    return !path.includes(nextNodeName);
}

export const createGraph = <T>(rootName?:string, rootVal?: T) => {
    const map = new Map<string, Node<T>>();

    if (rootName) {
        map.set(rootName, {name: rootName, val: rootVal, parents: [], children: []})
    }

    const getNode = (name) => {
        const n = map.get(name);
        assert(!!n, `Cannot find node with name ${name}`);
        return map.get(name)
    }

    const traverse = (start: string, end: string, validationFn, type: 'bfs' | 'dfs') => {
        const nextInLine = [{name: start, path: [start]}];

        const paths = [];

        while (nextInLine.length) {
            const {name, path} = type === 'bfs' ? nextInLine.shift() : nextInLine.pop();
            const currNode = getNode(name);

            if (name === end) {
                paths.push(path);
            } else {
                const next = currNode.children
                    .filter(childName => validationFn(childName, path, paths))
                    .map((childName) => {
                    return {name: childName, path: [...path, childName]}
                });
                nextInLine.push(...next);
            }
        }

        return paths;
    }


    const graph: Graph<T> = {
        addNode: (name, val) => {
            const node = {name, val, children: [], parents: []};
            if (map.has(name)) {
                return graph;
                // throw new Error(`Node ${name} exists`);
            }
            map.set(name, node);
            return graph;
        },
        addConnection: (childName, parentName, symmetrical) => {
            const child = map.get(childName);
            const parent = map.get(parentName);
            assert(!!child, `Child ${childName} does not exist`);
            assert(!!parent, `Parent ${parentName} does not exist`);

            parent.children.push(childName);
            child.parents.push(parentName);

            if (symmetrical) {
                parent.parents.push(childName);
                child.children.push(parentName);
            }
            return graph;
        },
        allPaths: (from, to, strategy = defaultGraphValidationStrategy, type = 'bfs') => {
            return traverse(from, to, strategy, type);
        },
        shortestPath: (from, to, strategy = defaultGraphValidationStrategy, type = 'bfs') => {
            const paths = traverse(from, to, strategy, type);

            const [shortest] = paths.sort((a, b) => a.length - b.length);
            return shortest;
        },
        inner: () => ({nodesMap: map})
    }

    return graph;
}