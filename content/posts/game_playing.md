---
layout: internal_post
title: Game Playing
categories: [omscs, ai]
tags: [alphabeta, minimax, algo]
permalink: ai/game_playing
date: "2020-05-03"
---

Game Playing is a domain of AI which helps an AI play human games, it eexposes an AI to a multi agent scenario and asks it to make optimal choices which would result in maximizing of reward(winning). Most games are timebound, so Games, like the real world, therefore require the ability to make some decision even when calculating the optimal decision is infeasible. Games also penalize inefficiency severely.

Taking Tic-Tac-Toe as an example, if we start by mapping the decisions of the game (mapping X or 0 on available squares) on a tree, the tree will end up having 9! nodes, and this is a relatively small tree, when we think about other games like Chess. So we need efficient algorithms to be able to return with the optimal move, given a timebound for each move.
![TicTacToe Tree](/images/tictactoe-tree.png)

Algorithms:
### MiniMax Algorithm

Minimax algorithm evaluates the position and recursively progresses to the end of the decision tree by alternativly selecting the best choice (corresponding to the AI's move) which maximizes the chance of Victory and the worst choice(corresponding to the likely choice the Opponent will make) which Minimizes the chance of Victory, and there by chooses the best path. The corresponding alternate steps are called Max-Step and Min-Step.


![MiniMax Algorithm](/images/minimax.png)
The above image has been taken from Artificial intelligence: A Modern Approach, Third Edition, Chapter 5 Adversarial Search Pg.No 166.


### Alpha Beta Pruning

The problem with MiniMax is that the number of states it has to examine is exponential in the depth of the tree. With Alpha Beta pruning we can effectively cut that in half. The trick is that it is possible to compute the correct minimax decision without looking at every node in the game tree.
The particular technique we examine is called alpha–beta pruning. When applied to a standard minimax tree, it returns the same move as minimax would, but prunes away branches that cannot possibly influence the final decision.

Alpha Beta pruning relies depends on two parameter alpha corresponding to value of the best (i.e., highest-value) choice we have found so far at any choice point along the path for MAX, and beta corresponding to value of the best (i.e., lowest-value) choice we have found so far at any choice point along the path for MIN.
Alpha–beta search updates the values of α and β as it goes along and prunes the remaining branches at a node (i.e., terminates the recursive call) as soon as the value of the current node is known to be worse than the current α or β value for MAX or MIN, respectively.

We use Evaluation Function to evaluate the current state, this Evaluation Function gives us value of each decision. An Evaluation function should result in higher values for decisions which results in Victory and less values for Winning or Worse Moves. Evaluation Functions are heuristics which we use to evaluate a path when the time to make a move limits us from exploring the entire graph.

![AlphaBeta Algorithm](/images/alpha_beta.png)
The above image has been taken from Artificial intelligence: A Modern Approach, Third Edition, Chapter 5 Adversarial Search Pg.No 170.

### Stocastic Games

In real life, many unpredictable external events can put us into unforeseen situations. Many games mirror this unpredictability by including a random element, such as the throwing of dice. We call these stochastic games. The decision tree of such a game includes a new type of Node called the Chance Node, other than the Min and Max Nodes discussed in MiniMax. The branches leading from each chance node denote the probability on each branch which sums up to 1. 

While calculating the optimal decision the Chance Node holds the Expected Value of its Children (i.e [P1 * Value of Child 1 + P2 * Value of Child 2], where P1 and P2 are probabilities of selecting Child 1 or Child 2)
![Stocastic Tree](/images/stocastic_tree.png)

We have a generalized MiniMax algorithim called ExpectiMiniMax which takes care of the Chance Nodes in its evaluation.
![ExpectiMinimax](/images/expectimax.png)

### Summary
* A game can be defined by the initial state (how the board is set up), the legal actions in each state, the result of each action, a terminal test (which says when the game is over), and a utility function that applies to terminal states.
* In two-player zero-sum games with perfect information, the minimax algorithm can select optimal moves by a depth-first enumeration of the game tree.
* The alpha–beta search algorithm computes the same optimal move as minimax, but achieves much greater efficiency by eliminating subtrees that are provably irrelevant.
* Usually, it is not feasible to consider the whole game tree (even with alpha–beta), so we need to cut the search off at some point and apply a heuristic evaluation function that estimates the utility of a state.
* Games of chance can be handled by an extension to the minimax algorithm that eval- uates a chance node by taking the average utility of all its children, weighted by the probability of each child.
