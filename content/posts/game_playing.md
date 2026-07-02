---
title: Game Playing
categories: [omscs, ai]
tags: [alphabeta, minimax, algo]
date: "2020-05-03"
draft: true
---

Game playing is a domain of AI which helps an AI play human games; it exposes an AI to a multi-agent scenario and asks it to make optimal choices that maximize its reward (winning). Most games are timebound, so games, like the real world, require the ability to make a decision even when calculating the optimal decision is infeasible. Games also penalize inefficiency severely.

Taking Tic-Tac-Toe as an example, if we start by mapping the decisions of the game (placing X or O on available squares) onto a tree, the tree will end up having 9! nodes, and this is a relatively small tree compared to other games like chess. So we need efficient algorithms to return the optimal move, given a time bound for each move.

Algorithms:
### MiniMax Algorithm

The minimax algorithm evaluates the position and recursively progresses to the end of the decision tree by alternately selecting the best choice (corresponding to the AI's move), which maximizes the chance of victory, and the worst choice (corresponding to the likely choice the opponent will make), which minimizes the chance of victory, thereby choosing the best path. The corresponding alternate steps are called the Max step and the Min step.

### Alpha-Beta Pruning

The problem with minimax is that the number of states it has to examine is exponential in the depth of the tree. With alpha-beta pruning we can effectively cut that in half. The trick is that it is possible to compute the correct minimax decision without looking at every node in the game tree.
The particular technique we examine is called alpha-beta pruning. When applied to a standard minimax tree, it returns the same move as minimax would, but prunes away branches that cannot possibly influence the final decision.

Alpha-beta pruning depends on two parameters: alpha, corresponding to the value of the best (i.e., highest-value) choice we have found so far at any choice point along the path for MAX, and beta, corresponding to the value of the best (i.e., lowest-value) choice we have found so far at any choice point along the path for MIN.
Alpha-beta search updates the values of α and β as it goes along, and prunes the remaining branches at a node (i.e., terminates the recursive call) as soon as the value of the current node is known to be worse than the current α or β value for MAX or MIN, respectively.

We use an evaluation function to evaluate the current state; this evaluation function gives us the value of each decision. An evaluation function should result in higher values for decisions that lead to victory and lower values for losing or worse moves. Evaluation functions are heuristics we use to evaluate a path when the time available to make a move limits us from exploring the entire graph.

### Stochastic Games

In real life, many unpredictable external events can put us into unforeseen situations. Many games mirror this unpredictability by including a random element, such as the throwing of dice. We call these stochastic games. The decision tree of such a game includes a new type of node called the chance node, in addition to the Min and Max nodes discussed in minimax. The branches leading from each chance node denote the probability of each branch, which sums to 1.

While calculating the optimal decision, the chance node holds the expected value of its children (i.e. [P1 * value of child 1 + P2 * value of child 2], where P1 and P2 are the probabilities of selecting child 1 or child 2).

We have a generalized minimax algorithm called ExpectiMiniMax, which accounts for chance nodes in its evaluation.

### Summary
* A game can be defined by the initial state (how the board is set up), the legal actions in each state, the result of each action, a terminal test (which says when the game is over), and a utility function that applies to terminal states.
* In two-player zero-sum games with perfect information, the minimax algorithm can select optimal moves by a depth-first enumeration of the game tree.
* The alpha–beta search algorithm computes the same optimal move as minimax, but achieves much greater efficiency by eliminating subtrees that are provably irrelevant.
* Usually, it is not feasible to consider the whole game tree (even with alpha–beta), so we need to cut the search off at some point and apply a heuristic evaluation function that estimates the utility of a state.
* Games of chance can be handled by an extension to the minimax algorithm that evaluates a chance node by taking the average utility of all its children, weighted by the probability of each child.
