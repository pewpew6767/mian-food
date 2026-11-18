import { IMAGES } from './images';
import { MENUS } from './menus';

const extra = (id, name, price) => ({ id, name, price });

const item = (id, name, description, price, image, extras = [], badge) => ({
  id,
  name,
  description,
  price,
  image,
  extras,
  ...(badge ? { badge } : {}),
});

const group = (id, name, items) => ({ id, name, items });

export const RESTAURANTS = [
  {
    id: 'ranchers',
    name: 'Ranchers',
    description:
      'Bold flame-grilled burgers, crispy chicken and loaded sides made fresh to order.',
    cuisines: ['Burgers', 'Fast Food'],
    rating: 4.5,
    ratingCount: 2410,
    deliveryTime: 25,
    deliveryFee: 49,
    discount: 20,
    minOrder: 350,
    distance: '1.4 km',
    image: IMAGES.burger,
    badge: 'Popular',
    recommended: true,
    popular: true,
    menu: MENUS.ranchers,
  },
  {
    id: 'kfc',
    name: 'KFC',
    description:
      "The Colonel's crispy chicken, zinger burgers and shareable buckets, delivered hot.",
    cuisines: ['Fried Chicken', 'Fast Food', 'Burgers'],
    rating: 4.3,
    ratingCount: 5840,
    deliveryTime: 30,
    deliveryFee: 49,
    discount: 25,
    minOrder: 450,
    distance: '2.1 km',
    image: IMAGES.friedChicken,
    badge: 'Deal of the day',
    recommended: false,
    popular: true,
    menu: MENUS.kfc,
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    description:
      'Big Macs, double cheeseburgers, golden fries and McFlurry treats for every craving.',
    cuisines: ['Burgers', 'Fast Food', 'Sandwiches'],
    rating: 4.2,
    ratingCount: 6120,
    deliveryTime: 25,
    deliveryFee: 59,
    discount: 15,
    minOrder: 300,
    distance: '1.9 km',
    image: IMAGES.mcdBurger,
    badge: null,
    recommended: true,
    popular: true,
    menu: MENUS.mcdonalds,
  },
  {
    id: 'hardees',
    name: "Hardee's",
    description:
      'Thick charbroiled burgers, hand-scooped shakes and crispy sides.',
    cuisines: ['Burgers', 'Sandwiches', 'Fast Food'],
    rating: 4.1,
    ratingCount: 2320,
    deliveryTime: 30,
    deliveryFee: 69,
    discount: 0,
    minOrder: 400,
    distance: '2.7 km',
    image: IMAGES.chickenBurger,
    badge: null,
    recommended: false,
    popular: false,
    menu: MENUS.hardees,
  },
  {
    id: 'broadway',
    name: 'Broadway Pizza',
    description:
      'Stone-baked pizzas loaded with cheese and fresh toppings, plus garlic bread and desserts.',
    cuisines: ['Pizza', 'Fast Food'],
    rating: 4.4,
    ratingCount: 3150,
    deliveryTime: 40,
    deliveryFee: 79,
    discount: 20,
    minOrder: 600,
    distance: '3.4 km',
    image: IMAGES.pizza,
    badge: 'Family meals',
    recommended: false,
    popular: true,
    menu: MENUS.broadway,
  },
  {
    id: 'optp',
    name: 'OPTP',
    description:
      'Loaded fries, crispy sandwiches and wings — the ultimate potato and burger stop.',
    cuisines: ['Fast Food', 'Burgers', 'Sandwiches'],
    rating: 4.2,
    ratingCount: 1740,
    deliveryTime: 25,
    deliveryFee: 0,
    discount: 10,
    minOrder: 300,
    distance: '1.2 km',
    image: IMAGES.fries,
    badge: 'Free delivery',
    recommended: true,
    popular: false,
    menu: MENUS.optp,
  },
  {
    id: 'dominos',
    name: "Domino's Pizza",
    description:
      'Pepperoni, chicken supreme and classic pizzas with free delivery across Faisalabad.',
    cuisines: ['Pizza', 'Fast Food'],
    rating: 4.5,
    ratingCount: 4210,
    deliveryTime: 35,
    deliveryFee: 0,
    discount: 25,
    minOrder: 500,
    distance: '2.9 km',
    image: IMAGES.pepperoniPizza,
    badge: 'Free delivery',
    recommended: true,
    popular: true,
    menu: MENUS.dominos,
  },
  {
    id: 'papajohns',
    name: 'Papa Johns',
    description:
      'Fresh dough, rich tomato sauce and generous toppings on every pizza.',
    cuisines: ['Pizza', 'Fast Food'],
    rating: 4.3,
    ratingCount: 2860,
    deliveryTime: 40,
    deliveryFee: 99,
    discount: 15,
    minOrder: 600,
    distance: '3.8 km',
    image: IMAGES.pepperoniPizza,
    badge: null,
    recommended: false,
    popular: false,
    menu: MENUS.papajohns,
  },
  {
    id: 'mrcheese',
    name: 'Mr Cheese',
    description:
      'Melted cheese in every bite — grilled sandwiches, Philly cheesesteaks and sides.',
    cuisines: ['Sandwiches', 'Fast Food', 'Burgers'],
    rating: 4.4,
    ratingCount: 980,
    deliveryTime: 30,
    deliveryFee: 49,
    discount: 10,
    minOrder: 400,
    distance: '2.4 km',
    image: IMAGES.grilledCheese,
    badge: 'New',
    recommended: true,
    popular: false,
    menu: MENUS.mrcheese,
  },
  {
    id: 'kababjees',
    name: 'Kababjees Fried Chicken',
    description:
      'Charcoal BBQ, fried chicken, biryani and karahi — a full Pakistani feast.',
    cuisines: ['Fried Chicken', 'BBQ', 'Pakistani', 'Chinese', 'Biryani'],
    rating: 4.6,
    ratingCount: 8430,
    deliveryTime: 35,
    deliveryFee: 0,
    discount: 20,
    minOrder: 500,
    distance: '3.1 km',
    image: IMAGES.biryani,
    badge: 'Top rated',
    recommended: true,
    popular: true,
    menu: MENUS.kababjees,
  },
  {
    id: 'secondcup',
    name: 'Second Cup',
    description:
      'Specialty coffee, chai lattes and freshly baked treats for your coffee break.',
    cuisines: ['Tea & Coffee', 'Desserts', 'Cakes & Bakery'],
    rating: 4.5,
    ratingCount: 1120,
    deliveryTime: 20,
    deliveryFee: 49,
    discount: 10,
    minOrder: 250,
    distance: '0.9 km',
    image: IMAGES.icedCoffee,
    badge: null,
    recommended: false,
    popular: false,
    menu: MENUS.secondcup,
  },
  {
    id: 'glorias',
    name: "Gloria Jean's Coffees",
    description:
      'Barista-crafted coffees, mochas and cheesecakes in a cozy cafe setting.',
    cuisines: ['Tea & Coffee', 'Cakes & Bakery', 'Desserts'],
    rating: 4.6,
    ratingCount: 2240,
    deliveryTime: 25,
    deliveryFee: 69,
    discount: 10,
    minOrder: 300,
    distance: '1.7 km',
    image: IMAGES.mocha,
    badge: 'Top rated',
    recommended: true,
    popular: true,
    menu: MENUS.glorias,
  },
  {
    id: 'layers',
    name: 'Layers Bakeshop',
    description:
      'Celebration cakes, bakery classics and sweet treats baked fresh daily.',
    cuisines: ['Cakes & Bakery', 'Desserts', 'Ice Cream'],
    rating: 4.7,
    ratingCount: 1640,
    deliveryTime: 35,
    deliveryFee: 0,
    discount: 15,
    minOrder: 700,
    distance: '2.6 km',
    image: IMAGES.cake,
    badge: 'Free delivery',
    recommended: false,
    popular: true,
    menu: MENUS.layers,
  },
  {
    id: 'sweetcreme',
    name: 'Sweet Creme',
    description:
      'Sundaes, thick shakes and rich desserts to satisfy every sweet tooth.',
    cuisines: ['Desserts', 'Ice Cream', 'Cakes & Bakery'],
    rating: 4.5,
    ratingCount: 1420,
    deliveryTime: 30,
    deliveryFee: 49,
    discount: 15,
    minOrder: 300,
    distance: '1.5 km',
    image: IMAGES.iceCream,
    badge: 'Sweet picks',
    recommended: true,
    popular: false,
    menu: MENUS.sweetcreme,
  },
  {
    id: 'chaishai',
    name: 'Chai Shai',
    description:
      'Karak chai, flaky parathas and slow-cooked haleem — desi comfort in every order.',
    cuisines: ['Tea & Coffee', 'Paratha', 'Haleem', 'Pakistani', 'Fast Food'],
    rating: 4.4,
    ratingCount: 3620,
    deliveryTime: 20,
    deliveryFee: 0,
    discount: 10,
    minOrder: 200,
    distance: '0.8 km',
    image: IMAGES.chai,
    badge: 'Fastest delivery',
    recommended: true,
    popular: true,
    menu: MENUS.chaishai,
  },
];

export const MIAN_MART = {
  id: 'mian-mart',
  name: 'Mian Mart',
  description:
    'Everyday groceries, farm-fresh produce and pantry staples delivered to your door.',
  cuisines: ['Grocery'],
  rating: 4.5,
  ratingCount: 980,
  deliveryTime: 30,
  deliveryFee: 0,
  discount: 0,
  minOrder: 300,
  distance: '1.6 km',
  image: IMAGES.produce,
  badge: 'Groceries in 30 min',
  recommended: false,
  popular: false,
  menu: [
    group('mm-produce', 'Fresh Produce', [
      item(
        'mm-produce-basket',
        'Seasonal Produce Basket',
        'A hand-picked basket of tomatoes, greens, carrots, peppers and lemons.',
        1200,
        IMAGES.produce,
        [extra('mm-produce-herbs', 'Add fresh herbs', 80)]
      ),
      item(
        'mm-bananas',
        'Bananas (1 kg)',
        'Naturally ripened bananas, perfect for breakfast and shakes.',
        180,
        IMAGES.produce
      ),
      item(
        'mm-tomatoes',
        'Tomatoes (1 kg)',
        'Firm, ripe tomatoes sourced from local farms.',
        240,
        IMAGES.produce
      ),
    ]),
    group('mm-dairy', 'Dairy & Eggs', [
      item(
        'mm-eggs',
        'Farm Eggs (Dozen)',
        'Free-range eggs delivered fresh from the farm.',
        340,
        IMAGES.dairy
      ),
      item(
        'mm-milk',
        'Fresh Milk 1L',
        'Full-cream fresh milk in a returnable glass bottle.',
        260,
        IMAGES.dairy
      ),
    ]),
    group('mm-pantry', 'Pantry & Drinks', [
      item(
        'mm-bread',
        'Artisan Bread Loaf',
        'Freshly baked white loaf with a soft crumb.',
        250,
        IMAGES.bakery
      ),
      item(
        'mm-cola',
        'Soft Drink 350ml',
        'Chilled carbonated soft drink served with ice.',
        150,
        IMAGES.cola
      ),
      item(
        'mm-orange-juice',
        'Orange Juice 1L',
        '100% fresh orange juice, no added sugar.',
        320,
        IMAGES.juice
      ),
    ]),
  ],
};

export function getRestaurant(id) {
  if (id === MIAN_MART.id) return MIAN_MART;
  return RESTAURANTS.find((restaurant) => restaurant.id === id) || null;
}

export function getMenuItem(restaurant, itemId) {
  if (!restaurant) return null;
  for (const menuGroup of restaurant.menu) {
    const match = menuGroup.items.find((entry) => entry.id === itemId);
    if (match) return match;
  }
  return null;
}

export function getMenuGroup(restaurant, itemId) {
  if (!restaurant) return null;
  return (
    restaurant.menu.find((menuGroup) =>
      menuGroup.items.some((entry) => entry.id === itemId)
    ) || null
  );
}

export const ALL_STORES = [...RESTAURANTS, MIAN_MART];
