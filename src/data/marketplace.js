import { getMenuItem, getRestaurant } from './restaurants';

export function product(restaurantId, itemId, meta = {}) {
  const restaurant = getRestaurant(restaurantId);
  const item = getMenuItem(restaurant, itemId);
  if (!restaurant || !item) return null;
  return { key: `${restaurantId}:${itemId}`, restaurant, item, ...meta };
}

const products = (entries) => entries.map((entry) => product(...entry)).filter(Boolean);

export const DAILY_DEALS = products([
  ['kfc', 'kfc-bucket', { description: '8pc crispy chicken with two dips' }],
  ['dominos', 'dm-pepperoni', { description: 'Large pepperoni with extra cheese' }],
  ['ranchers', 'rn-double', { description: 'Double smash burger, made fresh' }],
  ['papajohns', 'pj-meat', { description: 'Meat lovers loaded with four meats' }],
  ['kababjees', 'kb-biryani', { description: 'Chicken biryani with raita' }],
  ['mcdonalds', 'mc-bigmac', { description: 'The classic Big Mac, delivered' }],
  ['chaishai', 'cs-aloo-paratha', { description: 'Aloo paratha with mint chutney' }],
  ['sweetcreme', 'sw-sundae', { description: 'Warm brownie fudge sundae' }],
  ['glorias', 'gj-mocha', { description: 'Mocha with whipped cream' }],
  ['optp', 'op-loaded-fries', { description: 'Loaded cheese fries with herbs' }],
]).map((entry) => ({
  ...entry,
  originalPrice: entry.item.price,
  offerPrice: Math.round(
    (entry.item.price * (100 - entry.restaurant.discount)) / 100
  ),
}));

export const COFFEE_PRODUCTS = products([
  ['secondcup', 'sc-cappuccino'],
  ['secondcup', 'sc-latte'],
  ['secondcup', 'sc-iced'],
  ['secondcup', 'sc-americano'],
  ['secondcup', 'sc-mocha'],
  ['secondcup', 'sc-cold-brew'],
  ['secondcup', 'sc-chai-latte'],
  ['chaishai', 'cs-doodh-patti'],
  ['sweetcreme', 'sw-chocolate-shake'],
  ['sweetcreme', 'sw-mango-shake'],
  ['chaishai', 'cs-orange-juice'],
]);

export const ORDER_AGAIN = products([
  ['ranchers', 'rn-signature', { label: 'Burgers' }],
  ['broadway', 'bw-pepperoni', { label: 'Pizza' }],
  ['kababjees', 'kb-biryani', { label: 'Biryani' }],
  ['optp', 'op-loaded-fries', { label: 'Fries' }],
  ['secondcup', 'sc-iced', { label: 'Coffee' }],
  ['sweetcreme', 'sw-brownie', { label: 'Desserts' }],
  ['layers', 'ly-chocolate', { label: 'Cakes' }],
  ['kfc', 'kfc-bucket', { label: 'Chicken' }],
]);

export const DESSERT_RAILS = [
  {
    id: 'desserts',
    title: 'Desserts',
    subtitle: 'Sweet endings from local favourites',
    items: products([
      ['sweetcreme', 'sw-brownie'],
      ['layers', 'ly-redvelvet'],
      ['sweetcreme', 'sw-lava'],
      ['layers', 'ly-cheesecake'],
      ['glorias', 'gj-brownie'],
    ]),
  },
  {
    id: 'cakes-bakery',
    title: 'Cakes & Bakery',
    subtitle: 'Baked fresh every morning',
    items: products([
      ['layers', 'ly-chocolate'],
      ['layers', 'ly-tier'],
      ['glorias', 'gj-cheesecake'],
      ['layers', 'ly-croissant'],
      ['layers', 'ly-cupcake'],
      ['secondcup', 'sc-croissant'],
    ]),
  },
  {
    id: 'ice-cream',
    title: 'Ice Cream',
    subtitle: 'Cold scoops, shakes and sundaes',
    items: products([
      ['sweetcreme', 'sw-sundae'],
      ['sweetcreme', 'sw-cone'],
      ['mcdonalds', 'mc-mcflurry'],
      ['sweetcreme', 'sw-chocolate-shake'],
    ]),
  },
  {
    id: 'sweet-treats',
    title: 'Sweet Treats',
    subtitle: 'Cookies, donuts and little luxuries',
    items: products([
      ['layers', 'ly-donut'],
      ['layers', 'ly-cookies'],
      ['layers', 'ly-cupcake'],
      ['layers', 'ly-croissant'],
      ['sweetcreme', 'sw-brownie'],
    ]),
  },
];

export const POPULAR_SECTIONS = [
  {
    id: 'popular',
    title: 'Popular restaurants',
    subtitle: 'Most ordered in Faisalabad right now',
    ids: ['kfc', 'kababjees', 'mcdonalds', 'ranchers', 'broadway', 'dominos'],
  },
  {
    id: 'top-rated',
    title: 'Top rated restaurants',
    subtitle: 'Loved by thousands of local foodies',
    ids: ['layers', 'glorias', 'kababjees', 'dominos', 'secondcup', 'sweetcreme'],
  },
  {
    id: 'fastest',
    title: 'Fastest delivery',
    subtitle: 'At your door in 25 minutes or less',
    ids: ['chaishai', 'secondcup', 'ranchers', 'mcdonalds', 'optp', 'glorias'],
  },
  {
    id: 'discounts',
    title: 'Discounts & deals',
    subtitle: 'Save more on every order',
    ids: ['dominos', 'kfc', 'ranchers', 'broadway', 'kababjees', 'layers'],
  },
  {
    id: 'free-delivery',
    title: 'Free delivery deals',
    subtitle: 'Zero delivery fee on these restaurants',
    ids: ['dominos', 'optp', 'kababjees', 'layers', 'chaishai'],
  },
];
