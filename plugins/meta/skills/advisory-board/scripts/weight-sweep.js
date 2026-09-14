export const meta = {
  name: 'advisory-board-weight-sweep',
  description: 'Convene an advisory board once, then adjudicate it under several weightings to find which criteria actually decide the answer',
  whenToUse: 'A high-stakes decision where the criteria weights are uncertain, or where you want to know how fragile a ranking is. Members argue once; only the Oracle re-runs per weighting.',
  phases: [
    { title: 'Roster', detail: 'parse the roster file into members' },
    { title: 'Constraints', detail: 'run the order-1 members alone, before any upside framing exists' },
    { title: 'Council', detail: 'run the remaining members in parallel, in isolation' },
    { title: 'Adjudicate', detail: 'one Oracle per weight configuration, over identical member output' },
    { title: 'Sensitivity', detail: 'diff the rankings and name what actually decides it' },
  ],
}

// args: {
//   home:       "/home/chris/advisory-board"          personal data root (dossiers, runs)
//   skill:      "/home/chris/.claude/skills/advisory-board"   this skill's base directory
//   runDir:     ".../runs/<slug>/<timestamp>"         already contains frame.md + dossier.md
//   roster:     "family" | "executive" | "technical" | "homelab" | <filename>
//   rosterPath: optional explicit path, bypassing resolution entirely
//   configs:    [{ name: "baseline", note: "as framed" },
//                { name: "low-commute", note: "commute 5%, redistribute to child autonomy" }, ...]
// }
// Each config's weights are described in prose; the Oracle reads frame.md for the baseline
// table and applies the config's delta. One config named "baseline" runs the frame as written.

const home = args?.home || '/home/chris/advisory-board'
const skill = args?.skill || '/home/chris/.claude/skills/advisory-board'
const runDir = args?.runDir
const rosterName = args?.roster || 'family'
const configs = (args?.configs?.length ? args.configs : [{ name: 'baseline', note: 'exactly as written in frame.md' }])

if (!runDir) throw new Error('args.runDir is required and must already contain frame.md and dossier.md')

// Roster resolution mirrors the skill: a user roster overrides the bundled one, so a council
// can be adapted without editing the skill. The script cannot stat files, so it hands both
// candidates to the parsing agent in precedence order and lets it pick.
const rosterFile = rosterName.endsWith('.md') ? rosterName : `${rosterName}.md`
const rosterCandidates = args?.rosterPath
  ? [args.rosterPath]
  : [`${home}/rosters/${rosterFile}`, `${skill}/references/rosters/${rosterFile}`]

const FRAME = `${runDir}/frame.md`
const DOSSIER = `${runDir}/dossier.md`

const MEMBERS_SCHEMA = {
  type: 'object',
  required: ['members'],
  properties: {
    members: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'slug', 'order', 'adjudicator', 'mandate'],
        properties: {
          name: { type: 'string' },
          slug: { type: 'string', description: 'lowercase kebab-case, used as the output filename' },
          order: { type: 'integer', description: 'run order group; lower runs first' },
          adjudicator: { type: 'boolean' },
          model: { type: 'string', description: 'model hint from the roster, or empty string' },
          mandate: { type: 'string', description: 'the member instruction block, verbatim' },
        },
      },
    },
  },
}

const RANKING_SCHEMA = {
  type: 'object',
  required: ['config', 'ranking', 'decidedBy', 'discarded'],
  properties: {
    config: { type: 'string' },
    ranking: {
      type: 'array',
      description: 'options best to worst',
      items: {
        type: 'object',
        required: ['option', 'score'],
        properties: {
          option: { type: 'string' },
          score: { type: 'number' },
          note: { type: 'string' },
        },
      },
    },
    decidedBy: { type: 'string', description: 'the single factor that, if changed, changes the answer' },
    discarded: { type: 'string', description: 'the strongest objection being overruled, and why' },
    tooClose: { type: 'boolean', description: 'true if the top two are within noise of each other' },
    verdictPath: { type: 'string' },
  },
}

// ---------------------------------------------------------------- Roster

phase('Roster')
const parsed = await agent(
  `Locate the roster file. Try these paths in order and use the FIRST one that exists:\n` +
  rosterCandidates.map((p, i) => `  ${i + 1}. ${p}`).join('\n') + `\n` +
  `A user roster overrides the bundled one. If none exists, fail loudly rather than guessing.\n\n` +
  `It defines an advisory board roster: a series of "## <Member Name>" ` +
  `sections, each with optional "model:", "order:" and "adjudicator:" lines followed by the ` +
  `member's mandate in prose.\n\n` +
  `Return every member. "mandate" must be the member's instruction prose verbatim, excluding ` +
  `the model/order/adjudicator metadata lines. Default order to 1 and adjudicator to false when ` +
  `not stated. Do not invent or reword members.`,
  { label: 'parse-roster', phase: 'Roster', schema: MEMBERS_SCHEMA, effort: 'low' }
)

const all = parsed?.members || []
const council = all.filter(m => !m.adjudicator).sort((a, b) => a.order - b.order)
const oracle = all.find(m => m.adjudicator)
const rosterTried = rosterCandidates.join(' or ')
if (!council.length) throw new Error(`No non-adjudicator members parsed from ${rosterTried}`)
if (!oracle) throw new Error(`No adjudicator found in ${rosterTried}`)

const groups = [...new Set(council.map(m => m.order))].sort((a, b) => a - b)
log(`${council.length} members in ${groups.length} order groups, adjudicating with ${oracle.name}, ${configs.length} weight configs`)

// Members receive the identical brief. None of them ever sees another's output.
const brief = (m) =>
  `${m.mandate}\n\n` +
  `---\n\n` +
  `Read the problem frame at ${FRAME} and the full context dossier at ${DOSSIER}. Both are ` +
  `authoritative; where they are silent, say so rather than assuming.\n\n` +
  `You are one member of an advisory board. Other members hold deliberately different mandates ` +
  `and you cannot see their work. Do not attempt balance, do not hedge toward the middle, and ` +
  `do not caveat your position into uselessness. Argue your mandate as hard as the evidence ` +
  `honestly allows, and be explicit when the evidence runs out.\n\n` +
  `Ignore the criteria weights in the frame. Weighing is the adjudicator's job, not yours.\n\n` +
  `Write your full argument to ${runDir}/members/${m.slug}.md, then return a 5 to 10 line ` +
  `summary of your position for the orchestrator.`

// -------------------------------------------------- Constraints, then Council
// Order groups are a genuine barrier: the whole point of running the pessimistic and
// constraint-holding members first is that nobody downstream is anchored by an upside case.
// Within a group, members run concurrently and in isolation.

for (const [i, order] of groups.entries()) {
  const group = council.filter(m => m.order === order)
  const title = i === 0 ? 'Constraints' : 'Council'
  phase(title)
  log(`order ${order}: ${group.map(m => m.name).join(', ')}`)
  await parallel(group.map(m => () =>
    agent(brief(m), {
      label: m.slug,
      phase: title,
      model: m.model || undefined,
      effort: 'high',
    })
  ))
}

// ---------------------------------------------------------------- Adjudicate
// Members argue once. Only the Oracle re-runs per weighting, because weights are an
// adjudication parameter, not an input to the arguments. Re-running members per config
// would multiply cost and inject sampling noise into what should be a clean comparison.

phase('Adjudicate')
const memberFiles = council.map(m => `${runDir}/members/${m.slug}.md`).join('\n  ')

const verdicts = (await parallel(configs.map((cfg, i) => () =>
  agent(
    `${oracle.mandate}\n\n` +
    `---\n\n` +
    `Read the frame at ${FRAME}, the dossier at ${DOSSIER}, and every member's full argument:\n` +
    `  ${memberFiles}\n\n` +
    `Read the members in full. Do not skim them into agreement.\n\n` +
    `**Weight configuration "${cfg.name}":** ${cfg.note}\n\n` +
    `Apply exactly this weighting. If it differs from the table in frame.md, restate the full ` +
    `weighting you used and confirm it sums to 100 before scoring anything.\n\n` +
    `Write the full adjudication to ${runDir}/verdict-${cfg.name}.md and return the structured ` +
    `result. Set tooClose when the top two options are within noise, rather than manufacturing ` +
    `a winner.`,
    {
      label: `oracle:${cfg.name}`,
      phase: 'Adjudicate',
      model: oracle.model || undefined,
      effort: 'max',
      schema: RANKING_SCHEMA,
    }
  ).then(v => ({ ...v, config: cfg.name, note: cfg.note }))
))).filter(Boolean)

if (!verdicts.length) throw new Error('Every adjudication failed; nothing to compare')
if (verdicts.length < configs.length) {
  log(`WARNING: ${configs.length - verdicts.length} of ${configs.length} adjudications failed and are missing from the comparison`)
}

// ---------------------------------------------------------------- Sensitivity
// With one config there is nothing to diff, so skip rather than pay for an agent
// to tell us a single ranking is stable.

if (verdicts.length === 1) {
  log('single configuration, no sweep to analyse')
  return { runDir, roster: rosterName, verdicts, sensitivity: null }
}

phase('Sensitivity')
const table = verdicts.map(v =>
  `### ${v.config} (${v.note})\n` +
  v.ranking.map((r, i) => `${i + 1}. ${r.option} (${r.score})${r.note ? ` - ${r.note}` : ''}`).join('\n') +
  `\nDecided by: ${v.decidedBy}\nDiscarded: ${v.discarded}` +
  (v.tooClose ? `\nTop two within noise.` : '')
).join('\n\n')

const sensitivity = await agent(
  `You are analysing weight sensitivity for an advisory board run at ${runDir}.\n\n` +
  `The same members argued once. The adjudicator then scored them under ${verdicts.length} ` +
  `different weightings:\n\n${table}\n\n` +
  `Read the frame at ${FRAME} for the baseline weights. Then report:\n\n` +
  `1. **Stable** - what holds across every weighting. This is the strongest signal in the run.\n` +
  `2. **Fragile** - which option's position moves most, and which criterion moves it.\n` +
  `3. **The hinge** - the smallest honest weight change that flips the top of the ranking, and ` +
  `whether that change is defensible or contrived.\n` +
  `4. **What this tells the decider about themselves** - if the answer turns on one weight, the ` +
  `real question is not which option to pick but whether that criterion genuinely matters that ` +
  `much. Name it directly.\n\n` +
  `Do not re-adjudicate and do not pick a winner. Analyse the structure of the disagreement ` +
  `between the configurations.\n\n` +
  `Write the analysis to ${runDir}/sensitivity.md and return it.`,
  { label: 'sensitivity', phase: 'Sensitivity', effort: 'max' }
)

return { runDir, roster: rosterName, configs: configs.map(c => c.name), verdicts, sensitivity }
