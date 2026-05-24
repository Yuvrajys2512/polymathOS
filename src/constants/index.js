export const STORAGE_KEY = 'polymath-os-v2';
export const STORAGE_V1  = 'polymath-os-state-v1';

export const DOMAINS = ['AI/ML','Writing','Business','Design','Physics','Health','Learning','Life'];

export const TYPE_OPTS     = ['All','idea','task','question','insight','note'];
export const PRIORITY_OPTS = ['All','high','medium','low'];
export const XP_PER_LEVEL  = 150;

export const DOMAIN_COLOR = {
  'AI/ML':   '#00d9b1',
  'Writing': '#a78bfa',
  'Business':'#fbbf24',
  'Design':  '#f472b6',
  'Physics': '#60a5fa',
  'Health':  '#4ade80',
  'Learning':'#fb923c',
  'Life':    '#e879f9',
};

export const TYPE_ICON = { idea:'◈', task:'◻', question:'?', insight:'◆', note:'·' };

export const TIER_XP = { common: 25, rare: 75, epic: 150 };

export const ENERGY_LEVELS = [
  { level:1, emoji:'☠', label:'Dead',  color:'#6b7280', glow:'rgba(107,114,128,.2)' },
  { level:2, emoji:'😪', label:'Low',   color:'#ef4444', glow:'rgba(239,68,68,.2)'  },
  { level:3, emoji:'😐', label:'Okay',  color:'#fbbf24', glow:'rgba(251,191,36,.2)' },
  { level:4, emoji:'😊', label:'Good',  color:'#4ade80', glow:'rgba(74,222,128,.2)' },
  { level:5, emoji:'⚡', label:'Peak',  color:'#00d9b1', glow:'rgba(0,217,177,.25)' },
];

export const FOCUS_PRESETS = [15, 20, 25, 30, 45, 60];

export const IDENTITY_MODES = [
  {
    id: 'builder',
    label: 'Builder Mode',
    icon: '⚒',
    color: '#00d9b1',
    glow: 'rgba(0,217,177,0.35)',
    bg: 'rgba(0,217,177,0.06)',
    border: 'rgba(0,217,177,0.22)',
    desc: 'Building something real',
    xpMult: 1.2,
  },
  {
    id: 'research',
    label: 'Deep Research',
    icon: '◉',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    bg: 'rgba(96,165,250,0.06)',
    border: 'rgba(96,165,250,0.22)',
    desc: 'Down the rabbit hole',
    xpMult: 1.3,
  },
  {
    id: 'creative',
    label: 'Creative Flow',
    icon: '◈',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.35)',
    bg: 'rgba(192,132,252,0.06)',
    border: 'rgba(192,132,252,0.22)',
    desc: 'Let the ideas come',
    xpMult: 1.25,
  },
  {
    id: 'locked',
    label: 'Locked In',
    icon: '◆',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.35)',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.22)',
    desc: 'No distractions. Zero.',
    xpMult: 1.5,
  },
  {
    id: 'night',
    label: 'Night Grind',
    icon: '★',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.35)',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.22)',
    desc: 'While the world sleeps',
    xpMult: 1.4,
  },
  {
    id: 'sprint',
    label: 'Exec Sprint',
    icon: '⚡',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.35)',
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.22)',
    desc: 'Ship it. Now.',
    xpMult: 1.35,
  },
];

export const DEFAULT_HABITS = [
  { id:'h-read',    name:'Read 20 min',    dates:[], xp:20 },
  { id:'h-exercise',name:'Exercise',        dates:[], xp:25 },
  { id:'h-focus',   name:'No distractions', dates:[], xp:15 },
];

export const QUEST_POOL = [
  { id:'q_cap3',   title:'Brain Dump',    desc:'Capture 3 thoughts',             goal:3,  type:'capture',   xpReward:50  },
  { id:'q_cap5',   title:'Flood Gates',   desc:'Capture 5 thoughts',             goal:5,  type:'capture',   xpReward:80  },
  { id:'q_cap10',  title:'Torrent',       desc:'Capture 10 thoughts',            goal:10, type:'capture',   xpReward:150 },
  { id:'q_sess1',  title:'Deep Work',     desc:'Complete a focus session',       goal:1,  type:'session',   xpReward:60  },
  { id:'q_sess2',  title:'Flow State',    desc:'Complete 2 focus sessions',      goal:2,  type:'session',   xpReward:110 },
  { id:'q_dom2',   title:'Multi-Domain',  desc:'Capture in 2 different domains', goal:2,  type:'domains',   xpReward:45  },
  { id:'q_dom3',   title:'Polymath Mode', desc:'Capture in 3 different domains', goal:3,  type:'domains',   xpReward:90  },
  { id:'q_task2',  title:'Task Crusher',  desc:'Complete 2 tasks',               goal:2,  type:'tasks',     xpReward:70  },
  { id:'q_intent', title:'North Star',    desc:"Set today's intention",          goal:1,  type:'intention', xpReward:25  },
  { id:'q_insight',title:'Insight Hunter',desc:'Capture an insight',             goal:1,  type:'insight',   xpReward:40  },
];

export const ACHIEVEMENTS = [
  { id:'first_thought', icon:'◈', title:'First Thought', desc:'Capture your first thought',       check:s=>s.thoughts.length>=1 },
  { id:'idea_machine',  icon:'⚡', title:'Idea Machine',  desc:'Capture 50 thoughts',              check:s=>s.thoughts.length>=50 },
  { id:'polymathic',    icon:'∞',  title:'Polymathic',    desc:'Capture in all 8 domains',         check:s=>new Set(s.thoughts.filter(t=>DOMAINS.includes(t.domain)).map(t=>t.domain)).size>=8 },
  { id:'deep_worker',   icon:'◉', title:'Deep Worker',    desc:'Complete 5 focus sessions',        check:s=>s.sessions.length>=5 },
  { id:'finisher',      icon:'✓', title:'Finisher',       desc:'Complete 10 tasks',                check:s=>s.thoughts.filter(t=>t.done).length>=10 },
  { id:'on_fire',       icon:'★', title:'On Fire',        desc:'Maintain a 7-day streak',          check:s=>s.streak.count>=7 },
  { id:'scholar',       icon:'◆', title:'Scholar',        desc:'Reach Level 5 in any domain',      check:s=>DOMAINS.some(d=>Math.floor((s.xp?.[d]||0)/XP_PER_LEVEL)+1>=5) },
  { id:'renaissance',   icon:'✦', title:'Renaissance',    desc:'Level 3+ in 3 different domains',  check:s=>DOMAINS.filter(d=>Math.floor((s.xp?.[d]||0)/XP_PER_LEVEL)+1>=3).length>=3 },
  { id:'prolific',      icon:'◈', title:'Prolific',       desc:'Capture 100 thoughts',             check:s=>s.thoughts.length>=100 },
  { id:'insight_surge', icon:'◆', title:'Insight Surge',  desc:'Capture 10 insights',              check:s=>s.thoughts.filter(t=>t.type==='insight').length>=10 },
  { id:'true_polymath', icon:'✦', title:'True Polymath',  desc:'Level 5+ in 5 different domains',  check:s=>DOMAINS.filter(d=>Math.floor((s.xp?.[d]||0)/XP_PER_LEVEL)+1>=5).length>=5 },
  { id:'unstoppable',   icon:'⚡', title:'Unstoppable',    desc:'Maintain a 30-day streak',         check:s=>s.streak.count>=30 },
];

export const CHAR_STATS = [
  { key:'INT', label:'Intellect',  domains:['AI/ML','Physics'],   color:'#60a5fa' },
  { key:'WIS', label:'Wisdom',     domains:['Learning','Life'],    color:'#a78bfa' },
  { key:'CRE', label:'Creativity', domains:['Writing','Design'],   color:'#f472b6' },
  { key:'STR', label:'Drive',      domains:['Business','Health'],  color:'#fbbf24' },
];
