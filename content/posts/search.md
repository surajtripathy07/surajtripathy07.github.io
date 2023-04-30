---
title: Search
categories: [omscs, ai]
tags: [dfs, bfs, ucs, uniform cost, search, a* search]
permalink: ai/search
date: "2020-05-02"
---

### Why is Search so important in AI?
AI is all about figuring out what to do when you don't know what to do. Regular programming is about writing instructions to make a computer do things when you do know what to do, and AI is when you don't know. Search is one of the key areas where we can figure out what to do by planning a sequence of steps, even when we have no idea what the first step should be until we solve the search problem. Common problems which can be solved via effective search is "Finding minimum number of moves to solve a Rubics cube", "Google Map Routing".
The following Paper is a good read for any Rubic's Cube enthusiast [Finding Optimal Solutions to Rubik's Cube](https://www.cs.princeton.edu/courses/archive/fall06/cos402/papers/korfrubik.pdf), it uses Iterative Deepening A* Search to find optimal solutions to a random Rubik' Cube.

### Problem Statement:

Lets formally define the problem statement as,

*"Given an initial position and goal state, the agent has to define path/actions to reach the goal state in the most optimal and memory efficient way"*. 

Taking the Rubic's cube example, the random suffled rubic's cube would be the Initial State(I) and a solved Rubic's cube would be the Goal State(G), another example could be of a robot which is in one position in a room(I), and has to navigate to another position in a room(G), another well known example could be of finding an optimal path between a start destination(I) and end travel destination(G). There are various search algorithms which can be used to solve all the problems we discussed, we will start with the most basic one and continue improving upon them to get a more sofisticated search algorithm.

## Uninformed search (also called blind search):
 The term means that the strategies have no additional information about states beyond that provided in the problem definition. All they can do is generate successors and distinguish a goal state from a non-goal state.

 All search strategies are distinguished by the order in which nodes are expanded. Strategies that know whether one non-goal state is “more promising” than another are called informed search or heuristic search strategies;

### Tree Search:
If we super impose a search tree in the state space, and try to perform a tree search using the following basic algorithm, we should be able to navigate the state
space and sometime in the future, reach to the goal state afther which we stop.
```python
def TreeSearch(Initial, Goal):
	frontier = {[Initial]}
	loop:
	   if frontier is empty: return FAIL
	   path = remove_choice(frontier)
	   s = path.end
	   if s == Goal: #Goal Test
	   	return path:
	   for a in actions:
	   	add [path + a -> Result(s, a)] to frontier
```
Tree Search isn't one algorithm, its a family of algorithms. The way we remove nodes, i.e the implementation of remove_choice function results in different algorithms. 
Also, as can be seen from the basic implementation, TreeSearch will get stuck in an infinite loop if there is a cyclic dependency in the state space. As the saying goes, algorithms that forget their history are doomed to repeat it. The way to avoid exploring redundant paths is to remember where one has been. To do this, we augment the TREE-SEARCH algorithm with a data structure called the explored set which remembers every expanded node. Newly generated nodes that match previously generated nodes—ones in the explored set or the frontier—can be dis- carded instead of being added to the frontier. The new algorithm, is called GRAPH-SEARCH.
#### GRAPH-SEARCH = TREE-SEARCH + SET(EXPLORED_NODE).

### Breadth First Search:

Breadth-first search is a simple strategy in which the root node is expanded first, then all the successors of the root node are expanded next, then their successors, and so on. If in the TreeSearch we implement the remove_choice function to consider the path which hasn't been considered yet and is the shortest path length, then we get Breadth First Search.
![BFS](/images/BreadthFirstSearch.png)

### Uniform Cost Search:

When all step costs are equal, breadth-first search is optimal because it always expands the shallowest unexpanded node. By a simple extension, we can find an algorithm that is optimal with any step-cost function. Instead of expanding the shallowest node, uniform-cost search expands the node n with the lowest path cost g(n)
In addition to the ordering of the queue by path cost, there are two other significant differences from breadth-first search. The first is that the goal test is applied to a node when it is selected for expansion rather than when it is first generated. The reason is that the first goal node that is generated may be on a suboptimal path. The second difference is that a test is added in case a better path is found to a node currently on the frontier.
Uniform-cost search does not care about the number of steps a path has, but only about their total cost. Therefore, it will get stuck in an infinite loop if there is a path with an infinite sequence of zero-cost actions

When all step costs are the same, uniform-cost search is similar to breadth-first search, except that the latter stops as soon as it generates a goal, whereas uniform-cost search examines all the nodes at the goal’s depth to see if one has a lower cost; thus uniform-cost search does strictly more work by expanding nodes at depth d unnecessarily.
![UCS](/images/UCFSearch.png)

### Depth First Search:

Depth-first search always expands the deepest node in the current frontier of the search tree. The search proceeds immediately to the deepest level of the search tree, where the nodes have no successors. As those nodes are expanded, they are dropped from the frontier, so then the search “backs up” to the next deepest node that still has unexplored successors.

The depth-first search algorithm is an instance of the graph-search algorithm, whereas breadth-first-search uses a FIFO queue, depth-first search uses a LIFO queue. A LIFO queue means that the most recently generated node is chosen for expansion. This must be the deepest unexpanded node because it is one deeper than its parent—which, in turn, was the deepest unexpanded node when it was selected.

### Iterative Deepening DFS:

Iterative deepening search (or iterative deepening depth-first search) is a general strategy, often used in combination with depth-first tree search, that finds the best depth limit. It does this by gradually increasing the limit—first 0, then 1, then 2, and so on—until a goal is found. This will occur when the depth limit reaches d, the depth of the shallowest goal node. The algorithm is shown in Figure 3.18. Iterative deepening combines the benefits of depth-first and breadth-first search. Like depth-first search, its memory requirements are modest: O(bd) to be precise. Like breadth-first search, it is complete when the branching factor is finite and optimal when the path cost is a nondecreasing function of the depth of the node

## Informed search:
  This search technique uses problem-specific knowledge beyond the definition of the problem itself and can find solutions more efficiently than can an uninformed strategy.
	The general approach in Informed Search is called Best First Search. Best First Search is similar to TreeSearch or Graph Search, in which a node is selected for expansion based on an evaluation function, f(n). The function f incorporates a heuristic function as one of its component in determining most likely choice. The Heuristic function is denoted as h(n).

	h(n) = estimated cost of the cheapest path from the state at node n to a goal state.

Heuristic functions are the most common form in which additional knowledge of the problem is imparted to the search algorithm. We consider them to be arbitrary, nonnegative, problem-specific functions, with one constraint: if n is a goal node, then h(n) = 0.

The implementation of best-first graph search is identical to that for uniform-cost search, except for the use of f instead of g to order the priority queue.

### A* Search

The most widely known form of best-first search is called A∗ search (pronounced “A-star search”). It evaluates nodes by combining g(n), the cost to reach the node, and h(n), the cost to get from the node to the goal.

`f(n) = g(n) + h(n).`

![f(n)](/images/a-star.png)

Since g(n) gives the path cost from the start node to node n, and h(n) is the estimated cost of the cheapest path from n to the goal, we have,

`f(n) = estimated cost of the cheapest solution through n.`

Thus, if we are trying to find the cheapest solution, a reasonable thing to try first is the node with the lowest value of g(n) + h(n). It turns out that this strategy is more than just reasonable: provided that the heuristic function h(n) satisfies certain **conditions**, A∗ search is both complete and optimal. The algorithm is identical to UNIFORM-COST-SEARCH except that A∗ uses g + h instead of g.

#### A* Conditions
* **Admissible and Optimal:** The first condition we require for optimality is that h(n) be an admissible heuristic. An admissible heuristic is one that never overestimates the cost to reach the goal. Because g(n) is the actual cost to reach n along the current path, and f (n) = g(n) + h(n), we have as an immediate consequence that f(n) never overestimates the true cost of a solution along the current path through n. An example of admissible heuristic, for a possible route finding problem statment, is the Straight line distance(Euclidean Distance) between the node and the Goal state. Straight-line distance is admissible because the shortest path between any two points is a straight line. So Straight line cannot be an overestimate.

* **Consistent:** A second, slightly stronger condition called consistency (or sometimes monotonicity) is required only for applications of A∗ to graph search. A heuristic h(n) is consistent if, for every node n and every successor n of n generated by any action a, the estimated cost of reaching the goal from n is no greater than the step cost of getting to n plus the estimated cost of reaching the goal from n. 

     `h(n) ≤ step-cost of node n with action-a to reach node n' + h(n ')`

Algorithm for A* would be same as UCS, with just the change of the evaluation function.

Also, the performance of heuristic search algorithms depends on the quality of the heuristic function. One can sometimes construct good heuristics by relaxing the problem defi- nition, by storing precomputed solution costs for subproblems in a pattern database, or by learning from experience with the problem class.

