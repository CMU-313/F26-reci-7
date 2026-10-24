# Reflection

**Name / Andrew ID:**
Billy McGrath / wpmcgrat

**Recitation group members (Task 2):**
we didnt get to task 2 in recitation itself so we didnt have group members there

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

the property "is unaffected by input order and duplicates" does not kill any of the mutants provided but it is meant to catch any issues that arise from changing the order of the input or providing duplicates of the input and makes sure that it still matches the expected result. This would catch a bug which involves providing the same input twice or more to the mergeIntervals feature and overwhelming it.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

four of the mutants survived before changing the generator in the second part because it would generate start values greater than the end values. It was fixed by changing the generator from generating two independent values to treating the second generated number as a length rather than an endpoint so the second value will always be greater than the first.

  ✘ every input interval lies inside some output interval  (failed in 5/5 runs)
      Counterexample: [[[0,-1]]]
      RangeError: invalid interval [0, -1]
  ✘ covers exactly the same points as the input  (failed in 5/5 runs)
      Counterexample: [[[1,0]],0]
      RangeError: invalid interval [1, 0]
  ✘ is unaffected by input order and duplicates  (failed in 5/5 runs)
      Counterexample: [[[0,-1]]]
      RangeError: invalid interval [0, -1]
  ✘ is idempotent  (failed in 5/5 runs)
      Counterexample: [[[0,-1]]]
      RangeError: invalid interval [0, -1]

  ✔ assumesSorted           killed  by: every input interval lies inside some output interval; covers exactly the same points as the input; is unaffected by input order and duplicates
      Counterexample: [[[1,1],[0,0]]]
      AssertionError: expected [ [ +0, +0 ] ] to deeply equal []
  ✔ lexicographicSort       killed  by: every input interval lies inside some output interval; covers exactly the same points as the input; returns already-disjoint sorted input unchanged
      Counterexample: [[[2,2],[10,10]]]
      AssertionError: expected [ [ 2, 2 ] ] to deeply equal []
  ✔ touchingNotMerged       killed  by: every input interval lies inside some output interval; is unaffected by input order and duplicates
      Counterexample: [[[0,1],[1,1]]]
      AssertionError: expected 1 to be less than 1
  ✔ mergesIntegerNeighbors  killed  by: returns already-disjoint sorted input unchanged
      Counterexample: [[[-19,-19],[-18,-18]]]
      AssertionError: expected [ [ -19, -18 ] ] to deeply equal [ [ -19, -19 ], [ -18, -18 ] ]
  ✔ keepsLastEnd            killed  by: every input interval lies inside some output interval; covers exactly the same points as the input; is unaffected by input order and duplicates
      Counterexample: [[[0,1],[0,0]]]
      AssertionError: expected [ [ +0, 1 ] ] to deeply equal []
  ✔ dropsLast               killed  by: every input interval lies inside some output interval; covers exactly the same points as the input; is idempotent; returns already-disjoint sorted input unchanged
      Counterexample: [[[0,0]]]
      AssertionError: expected [ [ +0, +0 ] ] to deeply equal []
  ✔ aliasesInput            killed  by: every input interval lies inside some output interval
      Counterexample: [[[0,8],[11,11],[0,8],[-12,-10],[17,25],[3,6]]]
      AssertionError: expected [ [ +0, 8 ], [ 11, 11 ], …(4) ] to deeply equal [ [ +0, +0 ], [ 11, 11 ], …(4) ]

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

    ✔ mergesIntegerNeighbors  killed  by: returns already-disjoint sorted input unchanged
      Counterexample: [[[-19,-19],[-18,-18]]]
      AssertionError: expected [ [ -19, -18 ] ] to deeply equal [ [ -19, -19 ], [ -18, -18 ] ]

This input exposes the bug because instead of remaining two seperate non-overlapping intervals the mutant incorrectly merges them into a single interval. This specifically is shown through the specification as it specifies that if already disjoint-sorted then it should not be changed and with this input the mutant would merge it erroneously, exposing the bug.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

the slash orient command from my team's project would probably be the closest thing to benefiting from property-based testing since you want the result to be somewhat consistent and to have the important things never be dropped so a metamorphic property which checks to make sure everything needed is present and in the correct order each time and an invariant property that makes sure that it never hallucinates something important would also be very useful. You would need a generator that provides some kind of sample files or data that could function as a stand in for whatever kind of repo an end user would utilize it in so a native generator would be completely ineffective.