import type { Audience } from '@/features/profile'

/**
 * Learn guides. Written in plain language from the cited sources.
 * Every guide must be checked by Thriver's clinical advisers before real patients rely on it;
 * until then `reviewed` stays null and the app shows "Pending clinical review".
 */

export const topics = [
  { id: 'recovery', label: 'After surgery', emoji: '🩹', tile: 'bg-move' },
  { id: 'movement', label: 'Moving again', emoji: '🚶', tile: 'bg-meditate' },
  { id: 'food', label: 'Food', emoji: '🥣', tile: 'bg-reflect' },
  { id: 'mind', label: 'Mind & feelings', emoji: '🌿', tile: 'bg-sleep' },
  { id: 'reports', label: 'Your reports', emoji: '📄', tile: 'bg-mint' },
  { id: 'practical', label: 'Everyday life', emoji: '💼', tile: 'bg-cream' },
] as const

export type TopicId = (typeof topics)[number]['id']

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; tone: 'info' | 'warning'; text: string }

export interface Guide {
  slug: string
  title: string
  summary: string
  topic: TopicId
  minutes: number
  body: Block[]
  questions?: string[]
  sources: { label: string; url: string }[]
  /** Who it's for; omitted means everyone. */
  audience?: Audience
  /** Who reviewed it and when; null until clinical review. */
  reviewed: { by: string; date: string } | null
}

export const guides: Guide[] = [
  {
    slug: 'recovering-after-breast-surgery',
    title: 'Recovering after breast surgery: what’s typical',
    summary: 'A general picture of the first weeks after a mastectomy, and the signs to act on.',
    topic: 'recovery',
    audience: { cancerTypes: ['breast'] },
    minutes: 3,
    body: [
      {
        type: 'p',
        text: 'Everyone heals at their own pace, and your surgical team’s advice always comes first. This is a general picture of what many people experience after a mastectomy.',
      },
      { type: 'h', text: 'The first weeks' },
      {
        type: 'list',
        items: [
          'Drains, if you have them, are usually removed within a few days or weeks.',
          'Many people can get back to most of their usual activities in around 3 weeks, though it can take longer.',
          'Wounds often take around 6 weeks to heal fully. Tiredness and soreness are common along the way.',
          'Driving is usually possible once you can make an emergency stop without discomfort, often around 3 weeks. Check your insurer’s rules too.',
          'Many people take 4 to 8 weeks off work, but this varies a lot.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Contact your care team promptly if your wound looks infected (red, hot, leaking or more painful), if it bleeds, or if your arm or hand swells.',
      },
    ],
    questions: [
      'When will my drains come out, and how do I look after them?',
      'Which arm movements should I start, and when?',
      'When can I drive, lift things or go back to work?',
    ],
    sources: [
      { label: 'NHS: Mastectomy', url: 'https://www.nhs.uk/conditions/mastectomy/' },
      { label: 'HSE Ireland: Mastectomy', url: 'https://www2.hse.ie/conditions/mastectomy' },
    ],
    reviewed: null,
  },
  {
    slug: 'lymphoedema-signs',
    title: 'Lymphoedema: signs to watch for',
    summary: 'What lymphoedema is, early signs, and when swelling needs urgent attention.',
    topic: 'recovery',
    audience: {
      cancerTypes: ['breast', 'gynae', 'head-neck', 'prostate'],
      conditions: ['lymphoedema'],
    },
    minutes: 3,
    body: [
      {
        type: 'p',
        text: 'Lymphoedema is swelling caused by a build-up of lymph fluid. It can happen after lymph nodes are removed or treated with radiotherapy, for example in the arm after breast cancer surgery.',
      },
      { type: 'h', text: 'Early signs' },
      {
        type: 'list',
        items: [
          'Swelling in all or part of your arm, hand, chest or another area',
          'An aching or heavy feeling',
          'Rings, watches or sleeves feeling tighter than usual',
          'Difficulty moving the area',
        ],
      },
      {
        type: 'p',
        text: 'Early swelling may come and go, often getting worse during the day and easing overnight. Telling your team early makes it easier to manage.',
      },
      { type: 'h', text: 'Exercise is usually still safe' },
      {
        type: 'p',
        text: 'Research shows that gradual, monitored strength training after breast cancer surgery does not raise the risk of lymphoedema. Start gently, build up slowly and tell your team about any changes.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Get medical help the same day if the area becomes red, hot or painful, the swelling suddenly increases, or you have a fever or feel shivery. This can be an infection (cellulitis) that needs antibiotics.',
      },
    ],
    questions: [
      'Am I at risk of lymphoedema, and which signs should I report?',
      'Should I be measured or see a lymphoedema specialist?',
      'How should I build up arm and strength exercises?',
    ],
    sources: [
      { label: 'NHS: Lymphoedema', url: 'https://www.nhs.uk/conditions/lymphoedema/' },
      {
        label: 'Cochrane review: preventing arm lymphoedema after breast cancer treatment',
        url: 'https://www.cochrane.org/evidence/CD009765_interventions-preventing-lymphoedema-swelling-arm-after-breast-cancer-treatment',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'why-movement-helps',
    title: 'Why gentle movement helps after cancer',
    summary: 'What the research says exercise can do, and how to start safely.',
    topic: 'movement',
    minutes: 3,
    body: [
      {
        type: 'p',
        text: 'International experts agree that exercise is safe for most people during and after cancer treatment. The simplest advice: avoid long stretches of inactivity, and build up slowly.',
      },
      { type: 'h', text: 'What it can help with' },
      {
        type: 'list',
        items: [
          'Tiredness (cancer-related fatigue)',
          'Anxiety and low mood',
          'Strength and everyday physical function',
          'Overall quality of life',
        ],
      },
      { type: 'h', text: 'A goal to build towards' },
      {
        type: 'p',
        text: 'Over several weeks, many survivors work up to around 30 minutes of moderate activity (like brisk walking) 3 times a week, plus simple strength exercises twice a week. If you’re just starting, a few minutes counts.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Check with your care team before starting, especially soon after surgery, if cancer has affected your bones, or if your blood counts are low.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Stop and seek help if you have chest pain, severe breathlessness, dizziness or fainting.',
      },
    ],
    questions: [
      'Is there anything I should avoid while I recover?',
      'Can I be referred to a physiotherapist who works with cancer patients?',
    ],
    sources: [
      {
        label: 'Exercise Guidelines for Cancer Survivors (ACSM roundtable, 2019)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31626055/',
      },
      {
        label:
          'ASCO guideline: exercise, diet and weight management during cancer treatment (2022)',
        url: 'https://ace.asco.org/guidelines/169005',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'protein-indian-plate',
    title: 'Protein made simple: an Indian plate',
    summary: 'Why protein matters for recovery, and easy Indian ways to get enough.',
    topic: 'food',
    minutes: 3,
    body: [
      {
        type: 'p',
        text: 'Protein helps your body heal and keeps your muscles strong, which matters during and after treatment. Low muscle mass is linked with a harder time during treatment.',
      },
      { type: 'h', text: 'Easy protein foods' },
      {
        type: 'list',
        items: [
          'Dal, chana, rajma, moong and sprouts',
          'Paneer, curd, buttermilk and milk',
          'Eggs, fish and chicken, if you eat them',
          'Soya chunks, tofu, nuts and seeds',
        ],
      },
      {
        type: 'p',
        text: 'A simple habit: include one protein food at every meal and snack. A common general target is about 1 to 1.2 g of protein per kg of body weight a day, but your needs may differ.',
      },
      { type: 'h', text: 'Everyday eating' },
      {
        type: 'p',
        text: 'Experts suggest a mostly plant-based diet with plenty of vegetables, fruit, whole grains and pulses, limiting red and processed meat and alcohol, and keeping a healthy weight.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Talk to your team or a dietitian before starting special diets or supplements, especially if you have diabetes, kidney problems or swallowing difficulties.',
      },
    ],
    questions: [
      'How much protein do I need each day?',
      'Can I see a dietitian who works with cancer patients?',
    ],
    sources: [
      {
        label: 'World Cancer Research Fund: cancer survivors',
        url: 'https://www.wcrf.org/dietandcancer/cancer-survivors',
      },
      {
        label: 'ESPEN/ESMO protein guidance (Nutricia summary)',
        url: 'https://nutricia.com.au/adult/wp-content/uploads/sites/7/2024/12/Oncology-Booklet_V5.pdf',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'food-myths',
    title: 'Food myths: what the evidence says',
    summary: 'Sugar, “cancer-curing” diets and supplements, separating fact from fear.',
    topic: 'food',
    minutes: 2,
    body: [
      { type: 'h', text: '“Sugar feeds cancer”' },
      {
        type: 'p',
        text: 'Your body turns almost all carbohydrates into simple sugars, and every cell uses them for energy. Eating sweets does not specifically feed cancer cells. Too much sugar can lead to weight gain, though, which is linked with a higher risk of several cancers, so it’s still worth keeping sweets and sugary drinks occasional.',
      },
      { type: 'h', text: '“This diet cures cancer”' },
      {
        type: 'p',
        text: 'There isn’t enough evidence to recommend ketogenic diets, fasting, special “superfoods” or most supplements during cancer treatment. No diet has been shown to cure cancer.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Some herbal products and supplements can interfere with cancer treatment. Always tell your doctor what you’re taking, including ayurvedic and home remedies.',
      },
    ],
    sources: [
      {
        label: 'Cancer Research UK: Sugar and cancer',
        url: 'https://news.cancerresearchuk.org/2023/08/16/sugar-and-cancer-what-you-need-to-know/',
      },
      {
        label: 'ASCO guideline (2022), diet recommendations',
        url: 'https://ace.asco.org/guidelines/169005',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'scanxiety',
    title: 'Scanxiety and fear of recurrence',
    summary: 'Why worry before scans is so common, and small things that help.',
    topic: 'mind',
    minutes: 3,
    body: [
      {
        type: 'p',
        text: 'Feeling anxious before scans and check-ups, or worrying that cancer might come back, is very common. For many people the worry eases over time, though it may flare up around scans and anniversaries.',
      },
      { type: 'h', text: 'Things that can help' },
      {
        type: 'list',
        items: [
          'Ask in advance when and how you’ll get your results.',
          'Take someone with you, or plan a call afterwards.',
          'Bring music, a book or a podcast for the waiting time.',
          'Try a short breathing exercise before and during the scan.',
          'Wait to discuss results with your doctor rather than searching online.',
          'Keep moving: gentle activity can ease anxiety.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'If worry is affecting your sleep, appetite or daily life most days, tell your doctor. Psycho-oncologists and counsellors can help.',
      },
    ],
    questions: [
      'How will I get my scan results, and how soon?',
      'Can I talk to a counsellor or psycho-oncologist?',
    ],
    sources: [
      {
        label: 'Surveillance-associated anxiety after cancer surgery: systematic review (2024)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/39343818/',
      },
      {
        label: 'Fox Chase Cancer Center: coping with fear of recurrence',
        url: 'https://foxchase.org/blog/2018-03-23-how-to-cope-with-the-fear-of-a-cancer-recurrence',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'reading-blood-reports',
    title: 'How to read a blood test report',
    summary: 'Results, units, reference ranges and H/L flags, explained.',
    topic: 'reports',
    minutes: 2,
    body: [
      {
        type: 'p',
        text: 'Each line on a blood report usually has four parts: the test name, your result, the unit, and a reference range (the usual range for that lab).',
      },
      {
        type: 'list',
        items: [
          'Use the range printed on your own report. Different labs use slightly different ranges.',
          'An H (high) or L (low) flag is a prompt to look closer, not a diagnosis. Hydration, medicines, exercise or the time of day can nudge results.',
          'Trends over time often matter more than one result, so compare with your earlier reports.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Your doctor can explain what your results mean for you. You can also ask Thriver’s records assistant to explain a report in plain words.',
      },
    ],
    questions: [
      'Which of my results matter most to watch?',
      'How often will my bloods be checked?',
    ],
    sources: [
      {
        label: 'MedlinePlus: Understanding your lab test results',
        url: 'https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'back-to-work',
    title: 'Going back to work',
    summary: 'Planning a return that works for your energy and recovery.',
    topic: 'practical',
    minutes: 2,
    body: [
      {
        type: 'p',
        text: 'When you return to work depends on your treatment, your job and how you feel. After breast surgery, for example, many people take 4 to 8 weeks off, but it varies a lot.',
      },
      {
        type: 'list',
        items: [
          'Ask your doctor for a fitness or medical certificate for your employer.',
          'Consider a phased return: shorter days or fewer days at first.',
          'Plan around tiredness: schedule demanding tasks when your energy is best, and take breaks.',
          'Decide what you want to share with colleagues. It’s your choice.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'If heavy lifting or long standing is part of your job, ask your care team when it’s safe.',
      },
    ],
    questions: [
      'When is it safe for me to go back to work?',
      'Can you write a note suggesting a phased return?',
    ],
    sources: [
      {
        label: 'HSE Ireland: recovering from a mastectomy',
        url: 'https://www2.hse.ie/conditions/mastectomy',
      },
    ],
    reviewed: null,
  },
]

guides.push(
  {
    slug: 'living-with-a-stoma',
    title: 'Living with a stoma: first weeks',
    summary: 'Food, medicines and everyday life after colostomy surgery.',
    topic: 'recovery',
    minutes: 3,
    audience: { cancerTypes: ['colorectal'], conditions: ['stoma'] },
    body: [
      {
        type: 'p',
        text: 'Adjusting to a stoma takes time. Your stoma nurse is your best guide, and most people find daily life gets easier week by week.',
      },
      { type: 'h', text: 'Eating and drinking' },
      {
        type: 'list',
        items: [
          'Most people can return to a normal, varied diet. Early on, you may be advised to eat less fibre until your output settles.',
          'Eat regularly, chew well and drink plenty of fluids.',
          'Some foods can cause wind or smells. A simple food and symptom diary helps you learn what suits you.',
        ],
      },
      { type: 'h', text: 'Medicines' },
      {
        type: 'p',
        text: 'Some medicines may not work as well with a stoma. Ask your doctor or pharmacist whether a liquid or different form would be better, and don’t stop any prescribed medicine without advice.',
      },
      { type: 'h', text: 'Everyday life' },
      {
        type: 'p',
        text: 'Modern bags are discreet, and most people can wear their usual clothes. You can usually go back to work when you feel well. If your job involves heavy lifting, talk to your team and employer first.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Contact your stoma nurse or doctor if your stoma changes colour, output stops, or you have severe pain, vomiting or a swollen tummy.',
      },
    ],
    questions: [
      'Which foods should I go easy on at first?',
      'Do any of my medicines need a different form?',
      'Who do I call if I have a problem with my stoma?',
    ],
    sources: [
      {
        label: 'NHS: Recovery and lifestyle changes after a colostomy',
        url: 'https://www.nhs.uk/conditions/colostomy/recovery-and-lifestyle-changes-after-a-colostomy',
      },
      {
        label: 'Cambridge University Hospitals: Healthy eating with a colostomy',
        url: 'https://www.cuh.nhs.uk/patient-information/healthy-eating-with-a-colostomy/',
      },
    ],
    reviewed: null,
  },
  {
    slug: 'eating-with-a-sore-mouth',
    title: 'Eating with a sore mouth or difficult swallowing',
    summary: 'Gentle food and mouth-care tips after head and neck treatment.',
    topic: 'food',
    minutes: 3,
    audience: { cancerTypes: ['head-neck', 'stomach'], conditions: ['swallowing'] },
    body: [
      {
        type: 'p',
        text: 'Treatment for head and neck cancer can make your mouth sore or dry and swallowing harder. These problems are often temporary, and there is a lot that can help.',
      },
      { type: 'h', text: 'Food that’s easier to manage' },
      {
        type: 'list',
        items: [
          'Soft, moist foods like khichdi, dal, curd rice, upma, idli with sambar, or porridge.',
          'Add sauces, gravies or curd to keep food moist.',
          'Avoid very spicy, salty, acidic or rough foods (like crisp toast or raw vegetables) while your mouth is sore.',
          'Lukewarm or cool foods are often easier than very hot or very cold ones.',
        ],
      },
      { type: 'h', text: 'Mouth care' },
      {
        type: 'list',
        items: [
          'Keep a drink nearby and sip often, especially if your mouth is dry.',
          'Ask your team before buying a mouthwash, as some are too strong.',
          'Taking prescribed pain relief before meals can make eating easier.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'A speech and language therapist can check your swallow and suggest safe foods and exercises. A dietitian can help if you’re losing weight.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Tell your team quickly if you cough or choke when eating or drinking, or if you’re losing weight or struggling to drink enough.',
      },
    ],
    questions: [
      'Can I be referred to a speech and language therapist?',
      'Which mouthwash or gel is safe for me?',
      'How can I keep my weight up?',
    ],
    sources: [
      {
        label: 'Macmillan: Eating problems and cancer',
        url: 'https://www.macmillan.org.uk/assets/eating-problems-and-cancer-english.pdf',
      },
      {
        label: 'South Eastern HSC Trust: Eating and drinking after head and neck cancer',
        url: 'https://setrust.hscni.net/service/cancer-services/head-and-neck/beyond-cancer/physical-changes/eating-and-drinking/',
      },
    ],
    reviewed: null,
  },
)

export const findGuide = (slug: string | undefined) => guides.find((g) => g.slug === slug)
export const topicInfo = (id: TopicId) => topics.find((t) => t.id === id)!
