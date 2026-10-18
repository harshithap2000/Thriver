import type { Audience } from '@/features/profile'

import type { StoreId } from './partners'

export interface ShopItem {
  id: string
  name: string
  emoji: string
  tile: string
  why: string
  tips: string[]
  /** Search term used at partner stores (no specific brands). */
  searchTerm: string
  stores: StoreId[]
  /** Show "Ask your care team first". */
  askFirst?: boolean
  /** Related Learn guide slug. */
  guide?: string
  /** Who it's for; omitted means everyone. */
  audience?: Audience
}

export const essentials: ShopItem[] = [
  {
    id: 'post-surgery-bra',
    audience: { cancerTypes: ['breast'] },
    name: 'Post-surgery bra',
    emoji: '💗',
    tile: 'bg-move',
    why: 'Soft support after breast surgery, without pressure on scars.',
    tips: [
      'Look for front fastening, no underwire, soft seams.',
      'Pockets let you add a prosthesis later.',
    ],
    searchTerm: 'post mastectomy bra front closure',
    stores: ['amazon', 'flipkart'],
  },
  {
    id: 'breast-prosthesis',
    audience: { cancerTypes: ['breast'] },
    name: 'Breast prosthesis',
    emoji: '🤍',
    tile: 'bg-sleep',
    why: 'Restores shape under clothes after a mastectomy.',
    tips: [
      'A light, soft form is usually used while you heal.',
      'A trained fitter can help you choose a long-term one.',
    ],
    searchTerm: 'breast prosthesis',
    stores: ['amazon', 'flipkart'],
    askFirst: true,
  },
  {
    id: 'compression-sleeve',
    audience: { cancerTypes: ['breast'], conditions: ['lymphoedema'] },
    name: 'Compression sleeve',
    emoji: '💪',
    tile: 'bg-meditate',
    why: 'Can help manage arm lymphoedema when it’s been diagnosed.',
    tips: [
      'Only use one if your team advises it.',
      'It must be measured and fitted: a poor fit can make swelling worse.',
    ],
    searchTerm: 'lymphedema compression arm sleeve',
    stores: ['amazon', 'tata1mg'],
    askFirst: true,
    guide: 'lymphoedema-signs',
  },
  {
    id: 'caps-scarves',
    audience: { treatments: ['chemotherapy', 'radiotherapy'], conditions: ['hairLoss'] },
    name: 'Soft caps, scarves & wigs',
    emoji: '🧣',
    tile: 'bg-reflect',
    why: 'Comfort, warmth and sun protection if treatment affected your hair.',
    tips: ['Breathable cotton or bamboo is gentlest on a sensitive scalp.'],
    searchTerm: 'chemo cap cotton soft',
    stores: ['amazon', 'flipkart'],
  },
  {
    id: 'skin-care',
    audience: { treatments: ['radiotherapy', 'chemotherapy', 'surgery'] },
    name: 'Gentle skin & scar care',
    emoji: '🧴',
    tile: 'bg-mint',
    why: 'Treatment can leave skin dry and sensitive.',
    tips: [
      'Choose fragrance-free products and use sunscreen.',
      'Ask before applying anything to radiotherapy skin or an unhealed wound.',
    ],
    searchTerm: 'fragrance free moisturiser sensitive skin',
    stores: ['amazon', 'tata1mg'],
  },
  {
    id: 'resistance-bands',
    name: 'Resistance bands',
    emoji: '🏋️',
    tile: 'bg-meditate',
    why: 'Simple home strength training once you’re cleared for it.',
    tips: ['Start with the lightest band and build up slowly.'],
    searchTerm: 'resistance bands set light',
    stores: ['amazon', 'flipkart'],
    guide: 'why-movement-helps',
  },
  {
    id: 'ostomy',
    audience: { cancerTypes: ['colorectal'], conditions: ['stoma'] },
    name: 'Ostomy supplies',
    emoji: '🩹',
    tile: 'bg-move',
    why: 'Bags, seals and skin care for people with a stoma.',
    tips: ['Use the type and size your stoma nurse recommends.'],
    searchTerm: 'ostomy bag',
    guide: 'living-with-a-stoma',
    stores: ['tata1mg', 'amazon'],
    askFirst: true,
  },
  {
    id: 'pill-organiser',
    name: 'Weekly pill organiser',
    emoji: '💊',
    tile: 'bg-sleep',
    why: 'Makes it easier to keep track of daily medicines.',
    tips: ['Morning and evening compartments match most schedules.'],
    searchTerm: 'weekly pill organiser morning evening',
    stores: ['amazon', 'flipkart'],
  },
]

export const foods: ShopItem[] = [
  {
    id: 'protein-snacks',
    name: 'Protein-rich snacks',
    emoji: '🥜',
    tile: 'bg-reflect',
    why: 'Roasted chana, makhana, peanuts and sprouts make protein easy between meals.',
    tips: ['Choose low-salt, unfried options where you can.'],
    searchTerm: 'roasted chana',
    stores: ['bigbasket', 'amazon'],
    guide: 'protein-indian-plate',
  },
  {
    id: 'soft-foods',
    audience: { cancerTypes: ['head-neck', 'stomach'], conditions: ['swallowing'] },
    name: 'Soft, easy foods',
    emoji: '🥣',
    tile: 'bg-mint',
    why: 'Dalia, oats, suji and khichdi mixes are gentle on a sore mouth or low appetite.',
    tips: ['Add curd, paneer or dal to boost protein.'],
    searchTerm: 'broken wheat dalia',
    guide: 'eating-with-a-sore-mouth',
    stores: ['bigbasket', 'amazon'],
  },
  {
    id: 'pulses',
    name: 'Dals & pulses',
    emoji: '🫘',
    tile: 'bg-meditate',
    why: 'Everyday plant protein and fibre: moong, masoor, chana, rajma.',
    tips: ['Sprouting moong makes it lighter and quick to cook.'],
    searchTerm: 'moong dal',
    stores: ['bigbasket', 'amazon'],
  },
]

export interface ServiceItem {
  id: string
  name: string
  emoji: string
  description: string
  /** External link or phone action; undefined means "coming soon". */
  action?: { label: string; href: string }
}

export const services: ServiceItem[] = [
  {
    id: 'home-rehab',
    name: 'Home nursing & rehab',
    emoji: '🏠',
    description:
      'Oncology rehabilitation, nursing and therapy after surgery, at home or in a centre.',
    action: { label: 'HCAH cancer care', href: 'https://www.hcah.in/rehabilitation/cancer-care/' },
  },
  {
    id: 'mental-health',
    name: 'Talk to a counsellor now',
    emoji: '🫶',
    description:
      'Tele-MANAS, the Government of India’s free 24/7 mental health helpline, in about 20 languages.',
    action: { label: 'Call 14416', href: 'tel:14416' },
  },
  {
    id: 'physio',
    name: 'Oncology physiotherapy',
    emoji: '🧘',
    description:
      'Sessions with physiotherapists who work with cancer survivors. Until booking opens, ask your hospital for a referral.',
  },
  {
    id: 'dietitian',
    name: 'Onco-dietitian',
    emoji: '🥗',
    description:
      'Personal food plans for recovery, side effects and Indian diets. Until booking opens, ask your hospital.',
  },
]
