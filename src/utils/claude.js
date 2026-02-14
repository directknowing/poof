import Anthropic from '@anthropic-ai/sdk';

function getClient(apiKey) {
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function generateSubOptions(apiKey, area) {
  const client = getClient(apiKey);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `A person is reflecting on the area of "${area.label}" (${area.subtext}). Generate exactly 5 specific sub-patterns — the real, specific struggles people commonly face within this area. Each should be a short first-person statement (under 15 words) that someone would immediately recognize as their experience.

Return ONLY a JSON array of 5 strings, no other text. Example format: ["I'm stuck or plateaued", "I don't trust myself to make the right moves"]`,
    }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
}

export async function generateMonologues(apiKey, area, subOptions, customSubOption) {
  const client = getClient(apiKey);
  const patterns = [...subOptions];
  if (customSubOption) patterns.push(customSubOption);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `A person is working on "${area.label}" and specifically identified these patterns:
${patterns.map(p => `- ${p}`).join('\n')}

Generate exactly 5 "inner monologue" statements — the things someone with these exact patterns typically says to themselves internally. These should feel uncomfortably accurate, like you're reading their mind. First-person, conversational, raw and honest.

Return ONLY a JSON array of 5 strings, no other text.`,
    }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
}

export async function generateIdentities(apiKey, area, subOptions, customSubOption, monologues) {
  const client = getClient(apiKey);
  const patterns = [...subOptions];
  if (customSubOption) patterns.push(customSubOption);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `A person is working on "${area.label}". Their specific patterns:
${patterns.map(p => `- ${p}`).join('\n')}

Their inner monologue (what they tell themselves):
${monologues.map(m => `- "${m}"`).join('\n')}

Generate exactly 6 identity statements — who this person is BECOMING. Not goals, not outcomes — IDENTITY. Each should describe a type of person, framed as "Someone who..." or "A person who...". These should feel aspirational but believable, specific to their situation, and emotionally resonant.

Return ONLY a JSON array of 6 strings, no other text.`,
    }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
}

export async function generateAffirmationSequence(apiKey, summary) {
  const client = getClient(apiKey);
  const patterns = [...summary.subOptions];
  if (summary.customSubOption) patterns.push(summary.customSubOption);

  const allIdentities = [...summary.identities];
  if (summary.customIdentity) allIdentities.push(summary.customIdentity);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `You are an expert in affirmation science, combining proven principles from mental science and energy work. You create affirmation sequences using the D-I-R-E-C-T framework:

D — DECLARE (Present Tense): Use "I am," "I have," "I move." Never future tense.
I — IDENTITY, Not Outcome: Affirm who they're becoming, not external results.
R — RISING TRAJECTORY: Use "more and more," "increasingly," "deepening" — acknowledge momentum already in motion.
E — EMOTIONALLY CHARGED: Every statement needs at least one word that MOVES the person — "powerfully," "joyfully," "effortlessly," "with deep confidence."
C — CONCISE: One breath per statement. Mantra-like, not paragraph-like.
T — TRUE NORTH (Non-Contradictory): Nothing their mind will reject. Use trajectory language — "I am moving toward," "I am increasingly" — to sidestep inner resistance.

CRITICAL RULES FOR RELEASE STATEMENTS:
- NEVER state the negative directly. NOT "I am no longer afraid" (reinforces fear).
- Instead: "I give myself permission to set down what I've been carrying."
- The old story is acknowledged and released — not fought.`,
    messages: [{
      role: 'user',
      content: `Create a complete affirmation practice for this person:

AREA: ${summary.area.label}
SPECIFIC PATTERNS: ${patterns.join('; ')}
INNER MONOLOGUE: ${summary.monologues.map(m => `"${m}"`).join('; ')}
EMERGING IDENTITY: ${allIdentities.join('; ')}

Generate TWO variations of a structured affirmation sequence (8-15 statements each). Each sequence must follow this architecture:

1. GROUNDING STATEMENTS (2-3): Present-tense acknowledgment of safety, presence, readiness. Settle the nervous system.
2. RELEASE STATEMENTS (2-3): Gently name the old pattern, give permission to set it down. NEVER reinforce the negative.
3. BRIDGE STATEMENTS (2-3): Transitional, using Rising Trajectory language. This is the emotional pivot.
4. IDENTITY STATEMENTS (3-4): The core. Drawn from their emerging identity selections. Must pass ALL six D-I-R-E-C-T filters. Be SPECIFIC to their situation.
5. EMBODIMENT STATEMENTS (1-2): Ground the new identity into the body and day ahead. Quiet confidence.

Return JSON with this exact structure:
{
  "empowered": {
    "label": "Empowered & Direct",
    "sections": [
      {"type": "grounding", "statements": ["..."]},
      {"type": "release", "statements": ["..."]},
      {"type": "bridge", "statements": ["..."]},
      {"type": "identity", "statements": ["..."]},
      {"type": "embodiment", "statements": ["..."]}
    ]
  },
  "gentle": {
    "label": "Gentle & Nurturing",
    "sections": [
      {"type": "grounding", "statements": ["..."]},
      {"type": "release", "statements": ["..."]},
      {"type": "bridge", "statements": ["..."]},
      {"type": "identity", "statements": ["..."]},
      {"type": "embodiment", "statements": ["..."]}
    ]
  }
}

Return ONLY valid JSON, no other text.`,
    }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
}

export async function checkDirectPrinciples(apiKey, statement) {
  const client = getClient(apiKey);
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Evaluate this affirmation statement against the D-I-R-E-C-T framework:

"${statement}"

Rate each principle (pass/needs work) and suggest an improved version if needed:
D — Declare (Present Tense): Is it stated as now, not someday?
I — Identity: Is it about who they're becoming, not what they're getting?
R — Rising Trajectory: Does it use language of movement/expansion?
E — Emotionally Charged: Does it have at least one feeling-word?
C — Concise: Can it be said in one breath?
T — True North: Would the person's mind accept this without resistance?

Return JSON:
{
  "ratings": {
    "D": {"pass": true/false, "note": "brief note"},
    "I": {"pass": true/false, "note": "brief note"},
    "R": {"pass": true/false, "note": "brief note"},
    "E": {"pass": true/false, "note": "brief note"},
    "C": {"pass": true/false, "note": "brief note"},
    "T": {"pass": true/false, "note": "brief note"}
  },
  "suggestion": "improved version if needed, or null"
}

Return ONLY valid JSON, no other text.`,
    }],
  });

  const text = response.content[0].text.trim();
  return JSON.parse(text);
}
