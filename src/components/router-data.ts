/*
 * The routing table, and the one rule that reads it.
 *
 * Kept out of the component that draws it. The reel renders this table twice on the site, on
 * the Optimization page and again in the walkthrough on the home page, and a second copy of
 * the numbers living next to a second copy of the drawing is how the two end up answering the
 * same question differently.
 */

/* ordered by price, which is the only ordering the routing policy needs */
export const MODELS = [
  { name: "Haiku", sub: "4.5", cost: "$0.80" },
  { name: "GLM-5.2", sub: "Z.ai", cost: "$4.40" },
  { name: "Gemini", sub: "3.1 Pro", cost: "$12" },
  { name: "Sonnet", sub: "4.6", cost: "$15" },
  { name: "GPT-5.5", sub: "Codex", cost: "$30" },
  { name: "Opus", sub: "4.8", cost: "$75" },
];

/*
 * A model does not have a score, it has a score *on a piece of work*. The first version of
 * this board printed one fixed column, which quietly asserted the thing the product exists to
 * deny: that there is a single capability ranking and the job is to buy as far up it as you
 * can afford. So every session carries its own reading of all six, and the board re-scores
 * when the reel lands.
 *
 * Two of them are deliberately out of price order. On the migration Gemini beats Sonnet, and
 * on the Terraform bump GLM beats Gemini, because that does happen and a board that is always
 * monotone in price is a price list with extra steps.
 *
 * `bar` is what the task demands, and it is the task's property rather than any model's. An
 * early version carried a hand-written model index per session and promptly drew a request
 * routed to a model scoring below the bar printed beside it: the picture contradicted its own
 * caption. Deriving the route means the diagram cannot disagree with the numbers on it.
 *
 * Routes land deliberately across the board. The cheap end does most of the work and the
 * expensive end earns its place occasionally, which is the entire argument.
 */
export type Session = {
  cwd: string;
  cmd: string;
  out: string;
  bar: number;
  scores: number[];
};

export const SESSIONS: Session[] = [
  { cwd: "~/acme/web", cmd: "Rename the billing props", out: "4 files changed, 61 lines",
    bar: 80, scores: [88, 91, 93, 95, 96, 97] },
  { cwd: "~/acme/ledger", cmd: "Why is the payments test flaky?", out: "bisected 9 runs, found it",
    bar: 85, scores: [61, 72, 84, 88, 90, 93] },
  { cwd: "~/acme/platform", cmd: "Design the caching layer", out: "write-through, 90s TTL",
    bar: 88, scores: [42, 55, 71, 83, 87, 94] },
  { cwd: "~/acme/web", cmd: "Add a /changelog page from MDX", out: "2 routes, RSS 2.0",
    bar: 82, scores: [74, 86, 88, 90, 91, 94] },
  { cwd: "~/acme/api", cmd: "Write the migration for orders", out: "reversible, 1 new index",
    bar: 86, scores: [66, 79, 90, 88, 92, 95] },
  { cwd: "~/acme/infra", cmd: "Bump the Terraform providers", out: "no plan diff",
    bar: 78, scores: [91, 93, 92, 95, 95, 96] },
  { cwd: "~/acme/auth", cmd: "Refactor the session module", out: "11 call sites updated",
    bar: 87, scores: [58, 70, 82, 89, 91, 94] },
  { cwd: "~/acme/web", cmd: "Add tests for the cart reducer", out: "18 cases, 3 edge",
    bar: 84, scores: [77, 85, 88, 90, 92, 94] },
  { cwd: "~/acme/search", cmd: "Explain why recall dropped", out: "analyzer change, week 31",
    bar: 86, scores: [52, 64, 80, 85, 90, 93] },
];

/* The cheapest model that clears the bar on this work, which is the whole of the routing
   policy. The board is in price order, so the first index that clears is also the cheapest. */
export const routeFor = (s: Session) => {
  const i = s.scores.findIndex((v) => v >= s.bar);
  return i === -1 ? MODELS.length - 1 : i;
};
