// Pure client-side text similarity — no API required
// Uses TF-IDF inspired Jaccard similarity + structural bonuses

const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','being','have','has','had','do','does',
  'did','will','would','could','should','may','might','shall','can','need',
  'must','i','me','my','we','our','you','your','he','him','his','she','her',
  'it','its','they','them','their','this','that','these','those','what',
  'which','who','how','all','each','every','both','more','most','other',
  'some','such','no','not','only','own','same','than','too','very','just',
  'about','into','through','up','down','out','if','then','so','because','as',
  'by','from','get','got','go','going','want','need','make','made','use',
  'used','think','know','look','see','try','new','good','also','back','after',
  'first','well','way','even','want','take','put','keep','thing','things',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

function jaccard(setA, setB) {
  if (!setA.size || !setB.size) return 0;
  let inter = 0;
  for (const w of setA) if (setB.has(w)) inter++;
  return inter / (setA.size + setB.size - inter);
}

// Returns n×n similarity matrix (values 0-1)
export function computeRelationships(thoughts) {
  const n = thoughts.length;
  if (n === 0) return [];

  // Build token sets for each thought
  const tokenSets = thoughts.map(t => {
    const words = tokenize(
      `${t.text || ''} ${t.insight || ''} ${(t.tags || []).join(' ')}`
    );
    return new Set(words);
  });

  const matrix = Array.from({ length: n }, () => new Float32Array(n));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let score = jaccard(tokenSets[i], tokenSets[j]);

      // Domain match — same intellectual space
      if (thoughts[i].domain === thoughts[j].domain &&
          thoughts[i].domain !== 'Sorting') {
        score += 0.18;
      }

      // Tag overlap bonus
      const tagsI = new Set(thoughts[i].tags || []);
      const tagsJ = new Set(thoughts[j].tags || []);
      const tagOverlap = [...tagsI].filter(t => tagsJ.has(t)).length;
      score += tagOverlap * 0.12;

      // Type match (e.g., both are 'insight' or both are 'task')
      if (thoughts[i].type === thoughts[j].type &&
          thoughts[i].type !== 'note') {
        score += 0.06;
      }

      score = Math.min(1, score);
      matrix[i][j] = score;
      matrix[j][i] = score;
    }
  }

  return matrix;
}
