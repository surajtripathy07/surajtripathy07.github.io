---
layout: internal_post
title: Constraint Satisfaction(Draft)
categories: [omscs, ai]
permalink: ai/game_playing
date: "2020-05-07"
---

# CSP
A constraint satisfaction problem consists of:
a set of variables
a domain for each variable
a set of constraints

A model of a CSP is an assignment of values to variables that
satisfies all of the constraints.

## Variations in CSP
discrete, finite domains
continous domains

type of constraints:
Unary
which restricts the value of a single variable. For example, in the map-coloring problem it could be the case that South Australians won’t tolerate the color green; we can express that with the unary constraint ⟨(SA),SA ̸= green

Binary
A binary constraint relates two variables. For example, SA ̸= NSW is a binary constraint. A binary CSP is one with only binary constraints; it can be represented as a constraint graph, as in Figure 6.1(b).

Ternary
x< y < z (y is between x, z)

Global Constraint.
A constraint involving an arbitrary number of variables is called a global constraint, it need not involve all the variables in a problem.
One of the most common global constraints is Alldiff, which says that all of the variables involved in the constraint must have different values
