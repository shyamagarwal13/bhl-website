# Full-spectrum accounting of engineering spend

**Behold Labs — core hypothesis**

## The claim

AI has not made software cheaper to produce. It has made **one stage** of production
cheaper, changed the quality of what that stage emits, and moved cost into stages nobody is
metering. Software delivery is a pipeline that runs over time, so a measurement taken at one
stage in one quarter cannot recover the answer even in principle.

## What today's number assumes

Almost every AI ROI figure in circulation reduces to one subtraction:

```
saving  =  (engineer-hours saved × loaded rate)  −  token and licence spend
```

It is easy to compute from data every company already has, which is why the category feels
settled. It also rests on three assumptions, and we believe all three are false.

**A1 — Single stage.** That only the cost of *writing* changed.
**A2 — Single period.** That the costs and the savings land in the same quarter.
**A3 — Equivalence.** That a unit of AI output converts to value at the same rate as a unit
of human output.

## The decomposition

Write the net effect over a horizon *T* as:

```
ΔV(T)  =  ΔF(T)  −  Σ ΔC_s(T)  −  D(T)  −  S(T)
                     s
```

| Term | Meaning | Naive number's treatment |
|---|---|---|
| **ΔF(T)** | Change in value actually delivered | Assumed proportional to output |
| **Σ ΔC_s(T)** | Cost change at **every** stage *s*, not only the accelerated one | Only *s* = write |
| **D(T)** | Defect and rework cost carried forward. A function of **quality**, not volume | Assumed zero |
| **S(T)** | Second-order effects on the organisation itself | Absent |

The naive figure is `−ΔC_write` evaluated at one quarter. Everything else is set to zero by
omission rather than by argument.

Two properties matter and neither survives a single-stage snapshot. **D is dynamic**: the
cost of low-quality code is not paid when it is written, it accrues, and it lands in a later
quarter than the one that booked the saving. **The stages are coupled**: writing is upstream
of review, test, debugging and operation, and those stages have fixed human capacity, so
raising the arrival rate at one raises cost at all of them.

## Why quality breaks the arithmetic (A3)

Substitution accounting is valid only when the substitute is equivalent. A merged pull
request produced with an agent and one produced by hand are not interchangeable units. We
have measured the gap: velocity rose sharply and briefly while complexity rose persistently,
and the complexity is what produced the later slowdown. When output of unequal quality is
counted at the same rate, the saving is a loan drawn against a later quarter and booked
today as profit.

## Stage by stage (A1)

| Stage | What the ROI number counts | What it misses |
|---|---|---|
| **Planning & scoping** | Nothing | Cheap implementation changes what gets proposed. More speculative work enters the pipeline, and abandoned work is 100% cost at 0% value: a direct hit to ΔF. |
| **Writing code** | Hours saved, token spend | Complexity added per unit of delivered function. Whether the repo carries committed AI configuration, which in our data separates teams whose quality cost roughly doubled from teams where it did not. |
| **Code review** | Nothing | Review is a shared resource with fixed capacity. When a mandate doubled merged pull requests, per-reviewer load roughly doubled with it. Effectiveness also falls as volume rises, and effectiveness acts as a *multiplier* on carried defect cost rather than an addition to it. |
| **Test & CI** | Sometimes CI minutes | More changes means more pipeline runs, more flakes, more waiting. Cheap to meter, almost never attributed back to the tool that caused it. |
| **Debugging & incidents** | Nothing | Code nobody wrote is code nobody remembers. Time-to-understand becomes a first-class cost, paid by whoever is on call rather than by the team that shipped fast. |
| **Operation & maintenance** | Nothing | More surface shipped per quarter means more to run, patch and roll back. |

## Second-order effects (S)

These would exist even if AI output were identical in quality to human output, because what
changed is the *process*, not only the tool.

- **Comprehension was a by-product and is now a purchase.** Understanding a codebase used to
  arrive for free with the act of writing it. Delegate the writing and comprehension has to
  be bought separately, through review, through documentation, or through an incident at 3am.
- **Reviewer capacity is a commons.** Every team that raises its merge rate draws down a
  shared pool. The team that ships fast books the gain; the cost is spread across everyone
  who reads.
- **Ownership thins.** Authorship and accountability travelled together. When one is
  delegated, the other has to be assigned deliberately or it disappears.
- **The apprenticeship path narrows.** Junior engineers learned by writing the easy work
  that agents now absorb. This cost arrives years later and in the hiring budget.

None of these appear on a budget line, which is precisely why a quarterly ROI review cannot
see them.

## An illustration

Assumptions, not findings: 40 engineers at $200k loaded, writing is 40% of engineering time,
review is 20%.

- **Reported.** Licences and tokens cost $250k/year. Throughput on the writing stage rises
  18%. An 18% gain on 40% of capacity is 7.2% of $8M, so $576k saved against $250k spent.
  Net reported: **+$326k**.
- **Not counted (Σ ΔC).** At 18% more merged pull requests, review time rises roughly in
  step. 18% of the $1.6M spent on review is **$288k**, consuming 88% of the reported gain on
  its own.
- **Not counted (D).** Repos without committed AI configuration showed roughly twice the
  rise in cognitive complexity of repos that had it (ASE 2026). That lands as slower future
  change, in a quarter nobody will attribute to this decision. We have the effect size and
  not yet a dollar figure, which is itself part of the problem.
- **Not counted (D again).** Review effectiveness falls as volume rises, and effectiveness
  multiplies carried defect cost rather than adding to it, so even a modest drop changes the
  expected cost of every defect the period produced. Direction from the 2× mandate study;
  magnitude still being measured.

The sign of the net figure is not the point. The point is that a number presented as +$326k
is assembled from one of four terms, and the omitted terms are the same order of magnitude
as the answer.

## What we do about it

Price every term from the systems that already hold the evidence: repositories, provider
billing, CI, and review history. Where a signal only exists in people's heads, ask, briefly
and rarely. Calibrate to the organisation, because a regulated bank and a consumer startup
do not share a cost function and our own work shows averages across adopters hide wide
differences between teams.

Where review dominates the downstream cost, the decomposition above specialises to the form
on our site, `V = (F × T) − [P + L(t) × (1 − E) + R]`. We instrumented that case first
because review is where we have the most data, not because review is the only stage that
matters.

## What would change our mind

The hypothesis is wrong if downstream costs prove **transient**, absorbed within a quarter or
two as teams adapt; if complexity growth does **not** predict future change cost, making D a
measure of something nobody pays for; if review effectiveness **holds** under rising volume,
removing the multiplier; or if the variance between teams is **noise** rather than practice,
in which case benchmarks would work and per-organisation calibration is wasted effort. We
are testing these rather than assuming them.

## Evidence to date

The writing-code and code-review rows rest on these directly. Planning, CI, debugging and
operation are reasoned from the same mechanism and are not yet measured by us; they should
be read as hypotheses rather than results, and they are what we are instrumenting next.

| Paper | Venue | Finding |
|---|---|---|
| AI Writes Faster Than Humans Can Review | arXiv:2607.01904 | An enterprise "2×" mandate was met; per-reviewer load roughly doubled with it |
| Speed at the Cost of Quality | MSR 2026 | Large but transient velocity gain, persistent rise in complexity |
| A Few Pages of Markdown | ASE 2026 | Repos without committed AI configuration showed ~2× the rise in cognitive complexity |
| AI IDEs or Autonomous Agents? | MSR 2026 | The two are not the same intervention and do not carry the same cost |
| 3100 Opinions on Code Review in an AI World | In progress | — |

AI adoption in SDLC workflows is close to universal (Google DORA, 2025), while MIT's 2025
enterprise study found 95% of pilots returned nothing measurable. A single-stage,
single-period measurement cannot explain that gap. Full-spectrum accounting is the attempt
to.
