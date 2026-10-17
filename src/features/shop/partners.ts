/**
 * Partner stores the Shop links out to. Thriver doesn't take payments: people buy from these
 * stores directly. Links are plain search links (no affiliate tags yet).
 * Before launch: confirm each search pattern still works and agree partnerships or affiliate terms.
 */

export interface Store {
  id: string
  name: string
  search: (query: string) => string
}

const q = encodeURIComponent

export const stores = {
  amazon: {
    id: 'amazon',
    name: 'Amazon',
    search: (s: string) => `https://www.amazon.in/s?k=${q(s)}`,
  },
  flipkart: {
    id: 'flipkart',
    name: 'Flipkart',
    search: (s: string) => `https://www.flipkart.com/search?q=${q(s)}`,
  },
  bigbasket: {
    id: 'bigbasket',
    name: 'BigBasket',
    search: (s: string) => `https://www.bigbasket.com/ps/?q=${q(s)}`,
  },
  tata1mg: {
    id: 'tata1mg',
    name: 'Tata 1mg',
    search: (s: string) => `https://www.1mg.com/search/all?name=${q(s)}`,
  },
  pharmeasy: {
    id: 'pharmeasy',
    name: 'PharmEasy',
    search: (s: string) => `https://pharmeasy.in/search/all?name=${q(s)}`,
  },
  apollo: {
    id: 'apollo',
    name: 'Apollo Pharmacy',
    search: (s: string) => `https://www.apollopharmacy.in/search-medicines/${q(s)}`,
  },
} satisfies Record<string, Store>

export type StoreId = keyof typeof stores

/** Licensed online pharmacies used for medicine refills. */
export const pharmacies: StoreId[] = ['tata1mg', 'pharmeasy', 'apollo']
