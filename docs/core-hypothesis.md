# Full-spectrum accounting of engineering spend

**Behold Labs — core hypothesis**

Everyone measures AI's return the same way: hours saved times what an engineer costs, minus
the token bill. That number prices only the stage that got faster, and it treats AI output
and human output as the same thing. Neither is safe.

Every stage of software development produces two things. It produces an artifact, being the
code, the review, the test, the spec. It also produces something the organisation needs but
never pays for directly: understanding of the system, agreement about what is being built,
judgment about what is worth doing, and skill in the people doing it. Automate a stage and
you buy the artifact cheaply. You do not buy the second thing, and because it never appeared
on an invoice, nobody notices when it stops arriving.

So every stage has to be accounted twice. **First**, the artifact is not the same quality, so
a later stage pays the difference. **Second**, even if the quality were identical, the
by-product is gone and the organisation pays for that too. Both costs land later than the
saving, and usually in someone else's budget.

## Writing code

**Quality.** Generated code is plausible, and tends to be longer and more complex than what
a person would write for the same job. Complexity is the price of every future change to
that file, so hours saved today are borrowed against every edit anyone makes there for
years.

**By-product.** Writing code was how somebody came to understand the system. Now the code
exists and the understanding does not, so the company owns an asset nobody can service.

## Code review

**Quality.** An AI reviewer and a human reviewer do not catch the same things. Automated
review is strong on style, patterns and obvious mistakes, and weak on intent, architectural
fit, and whether the change should exist at all. Those are the expensive defects, so more of
them survive into production, which is the most expensive place to find anything. Reviewing
generated code is also harder than reviewing hand-written code, because a person's mistake
usually looks like a mistake while a model's mistake looks correct.

**By-product.** Review is where most teams do their teaching. It is how seniors pass on
judgment, how people learn parts of the system they do not own, and how everyone stays aware
of what is changing. Automate it and you may keep the defect catching, but you lose all of
that. It shows up later as longer onboarding, fewer people able to touch any given area, and
more of the system having exactly one person who understands it.

## Testing

**Quality.** Generated tests tend to assert what the code currently does rather than what it
is supposed to do. They lock in present behaviour, bugs included. Coverage goes up,
confidence goes up, and real defect detection does not. False confidence costs more than no
tests at all, because teams deploy differently when they trust the suite.

**By-product.** Struggling to write a test is a signal that the design is wrong. Delegate
the test and the signal never reaches anyone.

## Requirements and design

**Quality.** A generated spec reads complete. Its gaps are exactly the ambiguities a person
would have escalated, and they go unescalated, so they surface during implementation or in
production instead of in a ten-minute conversation. A requirements problem gets more
expensive at every stage it survives.

**By-product.** Writing the spec is how a team argues and reaches agreement. A document that
arrives fully formed gets nodded through, and the disagreement it papered over turns up
during integration.

## Documentation

**Quality.** Generated docs describe what the code does. What people need is why it does it,
which is the one thing that cannot be recovered from the code later. The volume of
documentation goes up while the actual gap stays open.

**By-product.** Writing an explanation is how you find out which parts are confusing.

## Debugging and incidents

**Quality.** More defects survived review, so there are more incidents to handle.

**By-product.** How fast an incident gets resolved depends on somebody holding a model of
the system in their head. If nobody wrote the code, nobody has that model, so every incident
now opens with a comprehension phase that used to be free. This one compounds, because it
applies to everything generated in previous years by tools nobody runs any more.

## Release and operations

**Quality.** More change shipped per quarter means more configuration, more surface area and
more rollbacks.

**By-product.** The person shipping a release used to know what was in it.

## Hiring and onboarding

**Quality.** A more complex codebase takes longer to learn, so every new hire costs more
before they contribute anything.

**By-product.** Juniors used to learn on the simple tickets. Agents do those now, so a
junior's first real task is a hard one with none of the scaffolding that used to come first.
A cheap training pipeline has been traded for expensive senior hiring two years out.

## What this means

None of these are speculative extras. Each is a cost that exists whether or not anyone
counts it, and each arrives later than the saving that caused it, which is why a quarterly
comparison of hours against tokens will always look better than the truth.

We price the whole pipeline over time: what the work was worth, what it cost to produce,
what the next stage paid for its quality, and what the missing by-products cost the
organisation. We read it from the systems already running, and we fit it to the specific
company, because how much any of this costs depends entirely on how that company works.
