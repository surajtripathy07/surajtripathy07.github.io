---
title: Constraint Satisfaction (Draft)
categories: [omscs, ai]
date: "2020-05-07"
draft: true
---

# CSP

A constraint satisfaction problem consists of:
- a set of variables
- a domain for each variable
- a set of constraints

A model of a CSP is an assignment of values to variables that
satisfies all of the constraints.

## Variations in CSP

- discrete, finite domains
- continuous domains

## Types of constraints

**Unary**: restricts the value of a single variable. For example, in the map-coloring problem it could be the case that South Australians won't tolerate the color green; we can express that with the unary constraint ⟨SA, SA ≠ green⟩.

**Binary**: relates two variables. For example, SA ≠ NSW is a binary constraint. A binary CSP is one with only binary constraints; it can be represented as a constraint graph.

**Ternary**: x < y < z (y is between x and z).

**Global constraint**: involves an arbitrary number of variables; it need not involve all the variables in a problem. One of the most common global constraints is Alldiff, which says that all of the variables involved in the constraint must have different values.
