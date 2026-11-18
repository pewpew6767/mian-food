import { IMAGES } from './images';

const x = (id, name, price) => ({ id, name, price });

const I = (id, name, description, price, image, extras = [], badge) => ({
  id,
  name,
  description,
  price,
  image,
  extras,
  ...(badge ? { badge } : {}),
});

const G = (id, name, items) => ({ id, name, items });

export const MENUS = {
  ranchers: [
    G('rn-burgers', 'Signature Burgers', [
      I(
        'rn-signature',
        'Ranchers Signature Smash',
        'Double-smashed beef, aged cheddar, smoked turkey and house ranch in a brioche bun.',
        890,
        IMAGES.burgerSmash,
        [
          x('rn-sig-cheese', 'Extra cheddar', 120),
          x('rn-sig-patty', 'Extra beef patty', 250),
        ],
        'Bestseller'
      ),
      I(
        'rn-double',
        'Double Smash Burger',
        'Two smashed patties, double cheese, caramelised onions and burger sauce.',
        1090,
        IMAGES.burgerDouble,
        [
          x('rn-double-cheese', 'Extra cheese', 100),
          x('rn-double-bacon', 'Smoked bacon', 180),
        ]
      ),
      I(
        'rn-classic',
        'Beef Classic Burger',
        'Flame-grilled beef, lettuce, tomato, pickles and classic mayo.',
        790,
        IMAGES.burgerClassic,
        [x('rn-classic-cheese', 'Add cheese', 80)]
      ),
      I(
        'rn-chicken',
        'Ranchers Chicken Burger',
        'Crispy chicken fillet, slaw, pickles and garlic mayo.',
        740,
        IMAGES.burgerChicken,
        [x('rn-chicken-cheese', 'Cheese slice', 80)]
      ),
      I(
        'rn-grilled',
        'Grilled Chicken Stack',
        'Chargrilled chicken breast, cheese, onion rings and smoky sauce.',
        840,
        IMAGES.burgerGrilled
      ),
    ]),
    G('rn-chicken', 'Chicken & Sides', [
      I(
        'rn-crispy',
        'Ranchers Crispy Chicken',
        'Buttermilk-fried chicken thigh with a crunchy golden crust.',
        720,
        IMAGES.chickenFried
      ),
      I(
        'rn-wings',
        'Ranchers Buffalo Wings (8pc)',
        'Eight wings tossed in buffalo sauce with blue cheese dip.',
        690,
        IMAGES.wingsHot,
        [x('rn-wings-dip', 'Extra dip', 60)]
      ),
      I(
        'rn-strips',
        'Ranchers Chicken Strips (5pc)',
        'Five hand-breaded strips served with honey mustard.',
        640,
        IMAGES.chickenStrips
      ),
      I(
        'rn-loaded-fries',
        'Ranchers Loaded Fries',
        'Crispy fries loaded with cheese sauce, jalapenos and herbs.',
        420,
        IMAGES.loadedFries,
        [x('rn-fries-cheese', 'Extra cheese sauce', 80)]
      ),
      I(
        'rn-nuggets',
        'Ranchers Nuggets (10pc)',
        'Ten golden chicken nuggets with a creamy dip.',
        520,
        IMAGES.chickenNuggets
      ),
    ]),
    G('rn-meals', 'Meals & Shakes', [
      I(
        'rn-wrap',
        'Ranchers Chicken Wrap',
        'Grilled chicken, lettuce, cheese and ranch in a warm tortilla.',
        560,
        IMAGES.chickenWrap
      ),
      I(
        'rn-steak',
        'Ranchers Beef Steak',
        'Grilled beef steak with peppercorn sauce and seasoned fries.',
        1290,
        IMAGES.steak,
        [x('rn-steak-sauce', 'Extra peppercorn sauce', 90)],
        'Chef special'
      ),
      I(
        'rn-combo',
        'Ranchers Combo Meal',
        'Signature smash burger, regular fries and a soft drink.',
        1590,
        IMAGES.comboMeal
      ),
      I(
        'rn-family',
        'Ranchers Family Box',
        'Four burgers, two fries, eight wings and two drinks.',
        2990,
        IMAGES.bbqPlatter
      ),
      I(
        'rn-shake',
        'Ranchers Milkshake',
        'Thick chocolate milkshake topped with whipped cream.',
        520,
        IMAGES.shake
      ),
    ]),
  ],

  kfc: [
    G('kfc-chicken', 'Fried Chicken', [
      I(
        'kfc-original',
        'Original Recipe Chicken (2pc)',
        "Two pieces of the Colonel's original recipe chicken.",
        690,
        IMAGES.chickenFried
      ),
      I(
        'kfc-bucket',
        '8pc Crispy Bucket',
        'Eight pieces of signature crispy chicken with two dips and lemon.',
        2490,
        IMAGES.chickenBucket,
        [
          x('kfc-bucket-dip', 'Extra garlic dip', 60),
          x('kfc-bucket-fries', 'Add regular fries', 220),
        ],
        'Bestseller'
      ),
      I(
        'kfc-wings',
        '6pc Hot Wings',
        'Six fiery hot wings coated in our signature spice mix.',
        690,
        IMAGES.wingsHot,
        [x('kfc-wings-dip', 'Ranch dip', 60)]
      ),
      I(
        'kfc-strips',
        'Crispy Strips (5pc)',
        'Five golden chicken strips with a crunchy coating and dip.',
        650,
        IMAGES.chickenStrips
      ),
      I(
        'kfc-popcorn',
        'Popcorn Chicken',
        'Bite-sized crispy chicken pieces with a zinger dip.',
        420,
        IMAGES.popcornChicken
      ),
    ]),
    G('kfc-burgers', 'Burgers & Wraps', [
      I(
        'kfc-zinger',
        'Zinger Burger',
        'Crunchy chicken fillet, lettuce and mayo in a toasted sesame bun.',
        690,
        IMAGES.burgerChicken,
        [x('kfc-zinger-cheese', 'Add cheese slice', 80)],
        'Bestseller'
      ),
      I(
        'kfc-mighty',
        'Mighty Zinger',
        'Double chicken fillet, cheese and spicy mayo in a toasted bun.',
        990,
        IMAGES.burgerDouble,
        [x('kfc-mighty-cheese', 'Extra cheese', 100)]
      ),
      I(
        'kfc-krunch',
        'Krunch Burger',
        'Crispy chicken, lettuce and tangy krunch mayo.',
        490,
        IMAGES.chickenSandwich
      ),
      I(
        'kfc-twister',
        'Chicken Twister',
        'Crispy chicken strips wrapped with lettuce and mayo.',
        620,
        IMAGES.chickenWrap
      ),
      I(
        'kfc-nuggets',
        'Chicken Nuggets (10pc)',
        'Ten chicken nuggets with a choice of dip.',
        520,
        IMAGES.chickenNuggets
      ),
    ]),
    G('kfc-sides', 'Sides & Drinks', [
      I(
        'kfc-fries',
        'Regular Fries',
        'Golden crispy fries seasoned with our signature spice.',
        280,
        IMAGES.fries
      ),
      I(
        'kfc-loaded',
        'Loaded Fries',
        'Fries topped with cheese sauce and spicy chicken bites.',
        450,
        IMAGES.loadedFries
      ),
      I(
        'kfc-combo',
        'Zinger Combo',
        'Zinger burger, regular fries and a 350ml soft drink.',
        1150,
        IMAGES.comboMeal
      ),
      I(
        'kfc-family',
        'Family Bucket',
        'Twelve crispy pieces, two large fries and four drinks.',
        3990,
        IMAGES.chickenBucket2
      ),
      I(
        'kfc-cola',
        'Soft Drink 350ml',
        'Chilled carbonated soft drink served with ice.',
        160,
        IMAGES.cola
      ),
    ]),
  ],

  mcdonalds: [
    G('mc-burgers', 'Burgers', [
      I(
        'mc-bigmac',
        'Big Mac',
        'Two beef patties, special sauce, lettuce, cheese and pickles.',
        990,
        IMAGES.mcdBurger,
        [x('mc-bigmac-cheese', 'Extra cheese', 90)],
        'Bestseller'
      ),
      I(
        'mc-mcchicken',
        'McChicken',
        'Crispy chicken patty, shredded lettuce and creamy mayo.',
        790,
        IMAGES.chickenBurger
      ),
      I(
        'mc-royale',
        'McRoyale',
        'Quarter-pound beef, cheese, onions and tangy sauce.',
        890,
        IMAGES.burgerDouble
      ),
      I(
        'mc-double',
        'Double Cheeseburger',
        'Two beef patties, double cheese, pickles and ketchup.',
        750,
        IMAGES.burgerClassic,
        [x('mc-double-cheese', 'Extra cheese', 70)]
      ),
      I(
        'mc-quarter',
        'Double Quarter Pounder',
        'Half a pound of beef, cheese, onions and pickles.',
        1190,
        IMAGES.burgerSmash
      ),
      I(
        'mc-cheese',
        'Cheeseburger',
        'Classic beef burger with cheese, pickles and ketchup.',
        450,
        IMAGES.burger
      ),
    ]),
    G('mc-chicken', 'Chicken & Fish', [
      I(
        'mc-nuggets',
        'Chicken McNuggets (10pc)',
        'Ten tender nuggets with sweet chilli dip.',
        640,
        IMAGES.chickenNuggets
      ),
      I(
        'mc-arabia',
        'McArabia',
        'Grilled chicken, garlic sauce and lettuce in flatbread.',
        790,
        IMAGES.chickenWrap
      ),
      I(
        'mc-wrap',
        'Chicken Snack Wrap',
        'Crispy chicken, lettuce and mayo in a soft tortilla.',
        490,
        IMAGES.shawarma
      ),
    ]),
    G('mc-sides', 'Sides & Desserts', [
      I(
        'mc-fries',
        'French Fries',
        'World famous golden fries with a sprinkle of salt.',
        320,
        IMAGES.fries
      ),
      I(
        'mc-applepie',
        'Apple Pie',
        'Warm baked pie filled with spiced apple.',
        250,
        IMAGES.applePie
      ),
      I(
        'mc-mcflurry',
        'Oreo McFlurry',
        'Creamy vanilla soft serve swirled with Oreo pieces.',
        450,
        IMAGES.iceCream
      ),
      I(
        'mc-happy',
        'Happy Meal',
        'Cheeseburger, small fries, drink and a surprise toy.',
        690,
        IMAGES.happyMeal
      ),
      I(
        'mc-cola',
        'Coca-Cola 500ml',
        'Ice-cold Coca-Cola, served chilled.',
        180,
        IMAGES.cola
      ),
    ]),
    G('mc-meals', 'Combo Meals', [
      I(
        'mc-bigmac-combo',
        'Big Mac Combo',
        'Big Mac, medium fries and a medium drink.',
        1350,
        IMAGES.comboMeal
      ),
    ]),
  ],

  hardees: [
    G('hd-burgers', 'Thickburgers', [
      I(
        'hd-thick',
        'Famous Star Thickburger',
        'Charbroiled beef patty, cheese, tomato and secret sauce.',
        990,
        IMAGES.burgerDouble
      ),
      I(
        'hd-mushroom',
        'Mushroom & Swiss Thickburger',
        'Beef patty with sauteed mushrooms and melted Swiss cheese.',
        1090,
        IMAGES.burgerMushroom
      ),
      I(
        'hd-bacon',
        'Bacon Cheeseburger',
        'Charbroiled beef, smoked bacon, cheese and crispy onions.',
        1150,
        IMAGES.burgerBacon
      ),
      I(
        'hd-western',
        'Double Western Bacon Burger',
        'Two beef patties, bacon, onion rings and BBQ sauce.',
        1290,
        IMAGES.burgerSmash
      ),
      I(
        'hd-classic',
        'Classic Charbroiled Burger',
        'Beef patty, lettuce, tomato, onion and mayo.',
        790,
        IMAGES.mcdBurger
      ),
    ]),
    G('hd-chicken', 'Chicken', [
      I(
        'hd-chicken',
        'Charbroiled Chicken Club',
        'Grilled chicken breast, bacon, cheese and lettuce.',
        890,
        IMAGES.burgerGrilled
      ),
      I(
        'hd-handbreaded',
        'Hand-Breaded Chicken Sandwich',
        'Crispy chicken fillet with pickles and mayo.',
        790,
        IMAGES.chickenSandwich
      ),
      I(
        'hd-tenders',
        'Chicken Tenders (5pc)',
        'Five crispy tenders with a honey mustard dip.',
        720,
        IMAGES.chickenStrips
      ),
      I(
        'hd-wings',
        'Hot Wings (6pc)',
        'Six spicy wings with a cooling ranch dip.',
        690,
        IMAGES.wingsHot
      ),
    ]),
    G('hd-sides', 'Sides & Shakes', [
      I(
        'hd-curly',
        'Curly Fries',
        'Seasoned spiral-cut fries, crispy and golden.',
        350,
        IMAGES.curlyFries
      ),
      I(
        'hd-onion',
        'Onion Rings',
        'Beer-battered onion rings with dipping sauce.',
        320,
        IMAGES.onionRings
      ),
      I(
        'hd-loaded',
        'Loaded Fries',
        'Fries topped with cheese sauce and bacon bits.',
        450,
        IMAGES.loadedFries
      ),
      I(
        'hd-shake',
        'Vanilla Hand-Spun Shake',
        'Thick vanilla shake made with real ice cream.',
        450,
        IMAGES.shake
      ),
      I(
        'hd-mango',
        'Mango Hand-Spun Shake',
        'Fresh mango blended into a creamy shake.',
        490,
        IMAGES.mangoShake
      ),
      I(
        'hd-salad',
        'Crispy Chicken Salad',
        'Fresh greens, crispy chicken and ranch dressing.',
        620,
        IMAGES.salad
      ),
    ]),
  ],

  broadway: [
    G('bw-pizzas', 'Signature Pizzas', [
      I(
        'bw-pepperoni',
        'Broadway Pepperoni',
        'Large pizza loaded with pepperoni and extra mozzarella.',
        1690,
        IMAGES.pepperoniPizza,
        [x('bw-pepperoni-cheese', 'Extra mozzarella', 150)],
        'Bestseller'
      ),
      I(
        'bw-cheese',
        'Classic Cheese',
        'Large pizza with a simple trio of mozzarella, oregano and tomato.',
        1390,
        IMAGES.pizzaCheese
      ),
      I(
        'bw-tikka',
        'Chicken Tikka',
        'Tandoori chicken tikka, onions and green chillies.',
        1590,
        IMAGES.pizzaTikka
      ),
      I(
        'bw-supreme',
        'Broadway Supreme',
        'Pepperoni, beef, olives, peppers, mushrooms and onions.',
        1790,
        IMAGES.pizzaSupreme
      ),
      I(
        'bw-veggie',
        'Garden Veggie',
        'Bell peppers, olives, mushrooms, tomatoes and sweetcorn.',
        1490,
        IMAGES.pizzaVeggie
      ),
      I(
        'bw-bbq',
        'BBQ Chicken',
        'BBQ chicken chunks, red onions and a smoky sauce base.',
        1690,
        IMAGES.pizzaBbq
      ),
    ]),
    G('bw-sides', 'Sides', [
      I(
        'bw-garlic-bread',
        'Garlic Bread',
        'Oven-baked garlic bread brushed with herb butter.',
        420,
        IMAGES.garlicBread
      ),
      I(
        'bw-wedges',
        'Potato Wedges',
        'Crispy potato wedges with a spicy seasoning.',
        390,
        IMAGES.curlyFries
      ),
      I(
        'bw-bruschetta',
        'Tomato Bruschetta',
        'Toasted bread topped with tomato, basil and olive oil.',
        450,
        IMAGES.bruschetta
      ),
      I(
        'bw-mozz',
        'Mozzarella Sticks',
        'Golden mozzarella sticks with marinara dip.',
        490,
        IMAGES.mozzarellaSticks
      ),
    ]),
    G('bw-pasta', 'Pasta & Desserts', [
      I(
        'bw-lasagna',
        'Beef Lasagna',
        'Layered pasta, beef ragu, bechamel and mozzarella.',
        790,
        IMAGES.lasagna
      ),
      I(
        'bw-pasta',
        'Penne Alfredo Pasta',
        'Penne tossed in a creamy Alfredo sauce with chicken.',
        690,
        IMAGES.pasta
      ),
      I(
        'bw-calzone',
        'Chicken Calzone',
        'Folded pizza dough stuffed with chicken, cheese and peppers.',
        890,
        IMAGES.calzone
      ),
      I(
        'bw-choco-lava',
        'Chocolate Lava Cake',
        'Warm chocolate cake with a molten centre.',
        390,
        IMAGES.lavaCake
      ),
      I(
        'bw-cola',
        'Soft Drink 1.5L',
        'Chilled family-size soft drink.',
        350,
        IMAGES.cola
      ),
    ]),
  ],

  optp: [
    G('op-fries', 'Loaded Fries', [
      I(
        'op-loaded-fries',
        'Loaded Cheese Fries',
        'Crispy fries with cheese sauce, jalapenos and fresh herbs.',
        450,
        IMAGES.loadedFries,
        [x('op-fries-cheese', 'Extra cheese sauce', 80)],
        'Bestseller'
      ),
      I(
        'op-masala',
        'Masala Fries',
        'Fries tossed in our house masala mix with lemon.',
        320,
        IMAGES.fries
      ),
      I(
        'op-curly',
        'Curly Fries',
        'Seasoned spiral fries served with garlic mayo.',
        350,
        IMAGES.curlyFries
      ),
      I(
        'op-cheese',
        'Cheese Fries',
        'Golden fries smothered in melted cheddar.',
        380,
        IMAGES.cheeseFries
      ),
      I(
        'op-nachos',
        'Nachos Supreme',
        'Tortilla chips with cheese, salsa, olives and jalapenos.',
        520,
        IMAGES.nachos
      ),
    ]),
    G('op-sandwiches', 'Burgers & Sandwiches', [
      I(
        'op-crispy',
        'Crispy Chicken Sandwich',
        'Crunchy chicken fillet, lettuce and spicy mayo.',
        590,
        IMAGES.chickenSandwich
      ),
      I(
        'op-burger',
        'OPTP Beef Burger',
        'Flame-grilled beef, cheese, onions and burger sauce.',
        650,
        IMAGES.burgerClassic
      ),
      I(
        'op-club',
        'Grilled Club Sandwich',
        'Triple-decker sandwich with chicken, egg and salad.',
        620,
        IMAGES.clubSandwich
      ),
      I(
        'op-wrap',
        'Chicken Shawarma Wrap',
        'Shawarma chicken, garlic sauce and pickles in a wrap.',
        490,
        IMAGES.chickenWrap
      ),
      I(
        'op-wings',
        'BBQ Wings (6pc)',
        'Six wings glazed in smoky BBQ sauce.',
        590,
        IMAGES.wingsHot
      ),
    ]),
    G('op-sides', 'Sides & Drinks', [
      I(
        'op-nuggets',
        'Chicken Nuggets (8pc)',
        'Eight nuggets with a tangy dip.',
        450,
        IMAGES.chickenNuggets
      ),
      I(
        'op-onion',
        'Onion Rings',
        'Crispy golden onion rings with ketchup.',
        300,
        IMAGES.onionRings
      ),
      I(
        'op-lemonade',
        'Fresh Lemonade',
        'Hand-squeezed lemonade served over ice.',
        250,
        IMAGES.lemonade
      ),
      I(
        'op-sundae',
        'Chocolate Sundae',
        'Vanilla soft serve with chocolate sauce and nuts.',
        320,
        IMAGES.sundae
      ),
      I(
        'op-cola',
        'Soft Drink 350ml',
        'Chilled carbonated soft drink.',
        180,
        IMAGES.cola
      ),
    ]),
  ],

  dominos: [
    G('dm-pizzas', 'Pizzas', [
      I(
        'dm-pepperoni',
        'Pepperoni Passion',
        'Large pepperoni pizza with extra mozzarella.',
        1590,
        IMAGES.pepperoniPizza,
        [x('dm-pepperoni-cheese', 'Extra cheese', 150)],
        'Bestseller'
      ),
      I(
        'dm-margherita',
        'Margherita Classic',
        'Tomato base, mozzarella and fresh basil.',
        1290,
        IMAGES.margherita
      ),
      I(
        'dm-chicken-supreme',
        'Chicken Supreme',
        'Chicken, peppers, onions, olives and mushrooms.',
        1690,
        IMAGES.pizzaSupreme
      ),
      I(
        'dm-tikka',
        'Chicken Tikka Ranch',
        'Tikka chicken, onions and creamy ranch drizzle.',
        1590,
        IMAGES.pizzaTikka
      ),
      I(
        'dm-bbq',
        'BBQ Chicken Pizza',
        'BBQ chicken, red onions and smoky sauce.',
        1690,
        IMAGES.pizzaBbq
      ),
      I(
        'dm-veggie',
        'Farmhouse Veggie',
        'Peppers, corn, onions, olives and tomatoes.',
        1390,
        IMAGES.pizzaVeggie
      ),
    ]),
    G('dm-sides', 'Sides', [
      I(
        'dm-garlic',
        'Garlic Breadsticks',
        'Freshly baked breadsticks with garlic butter.',
        450,
        IMAGES.garlicBread
      ),
      I(
        'dm-loaded',
        'Cheesy Loaded Fries',
        'Fries loaded with cheese sauce and jalapenos.',
        480,
        IMAGES.loadedFries
      ),
      I(
        'dm-wedges',
        'Herb Potato Wedges',
        'Crispy wedges with herbs and a garlic dip.',
        390,
        IMAGES.curlyFries
      ),
      I(
        'dm-pasta',
        'Chicken Alfredo Pasta',
        'Creamy Alfredo pasta with grilled chicken.',
        690,
        IMAGES.pasta
      ),
      I(
        'dm-wings',
        'BBQ Chicken Wings',
        'Oven-baked wings glazed in BBQ sauce.',
        620,
        IMAGES.wingsHot
      ),
    ]),
    G('dm-desserts', 'Desserts & Drinks', [
      I(
        'dm-lava',
        'Choco Lava Cake',
        'Warm chocolate cake with a gooey centre.',
        350,
        IMAGES.lavaCake
      ),
      I(
        'dm-brownie',
        'Brownie Melt',
        'Fudgy chocolate brownie served warm.',
        390,
        IMAGES.brownie
      ),
      I(
        'dm-kickers',
        'Chicken Kickers (8pc)',
        'Eight crispy chicken kickers with a dip.',
        590,
        IMAGES.popcornChicken
      ),
      I(
        'dm-cola',
        'Coca-Cola 1.5L',
        'Chilled family-size Coca-Cola.',
        350,
        IMAGES.cola
      ),
    ]),
  ],

  papajohns: [
    G('pj-pizzas', 'Pizzas', [
      I(
        'pj-pepperoni',
        'The Pepperoni Classic',
        'Large pepperoni pizza with a garlic butter crust.',
        1590,
        IMAGES.pepperoniPizza,
        [x('pj-pepperoni-cheese', 'Extra cheese', 150)],
        'Bestseller'
      ),
      I(
        'pj-meat',
        'Meat Lovers',
        'Pepperoni, beef, chicken and sausage on a loaded pizza.',
        1890,
        IMAGES.pizzaSupreme
      ),
      I(
        'pj-veggie',
        'Garden Fresh Veggie',
        'Peppers, mushrooms, olives, onions and tomatoes.',
        1390,
        IMAGES.pizzaVeggie
      ),
      I(
        'pj-cc',
        'Chicken Club',
        'Chicken, bacon, onions and a creamy garlic sauce.',
        1690,
        IMAGES.pizzaBbq
      ),
      I(
        'pj-margherita',
        'Margherita',
        'Mozzarella, tomato and basil on a thin crust.',
        1290,
        IMAGES.pizzaCheese
      ),
      I(
        'pj-tikka',
        'Chicken Tikka',
        'Spiced tikka chicken, onions and green chillies.',
        1590,
        IMAGES.pizzaTikka
      ),
    ]),
    G('pj-sides', 'Sides', [
      I(
        'pj-garlic',
        'Garlic Knots',
        'Soft garlic knots brushed with herb butter.',
        420,
        IMAGES.garlicBread
      ),
      I(
        'pj-wedges',
        'Potato Wedges',
        'Seasoned potato wedges with a dip.',
        390,
        IMAGES.curlyFries
      ),
      I(
        'pj-cheesesticks',
        'Cheese Sticks',
        'Baked cheese sticks with marinara sauce.',
        490,
        IMAGES.mozzarellaSticks
      ),
      I(
        'pj-wings',
        'Buffalo Wings (8pc)',
        'Eight spicy buffalo wings with ranch dip.',
        690,
        IMAGES.wingsHot
      ),
      I(
        'pj-salad',
        'Caesar Side Salad',
        'Romaine, parmesan and croutons with Caesar dressing.',
        420,
        IMAGES.salad
      ),
    ]),
    G('pj-desserts', 'Desserts & Drinks', [
      I(
        'pj-brownie',
        'Double Chocolate Brownie',
        'Rich brownie with a double dose of chocolate.',
        390,
        IMAGES.brownie
      ),
      I(
        'pj-cookie',
        'Chocolate Chip Cookie',
        'Freshly baked cookie loaded with chocolate chips.',
        250,
        IMAGES.cookie
      ),
      I(
        'pj-cheesecake',
        'New York Cheesecake',
        'Creamy baked cheesecake with a biscuit base.',
        450,
        IMAGES.cheesecake
      ),
      I(
        'pj-cola',
        'Pepsi 1.5L',
        'Chilled family-size Pepsi.',
        350,
        IMAGES.cola
      ),
    ]),
  ],

  mrcheese: [
    G('mrc-sandwiches', 'Grilled Sandwiches', [
      I(
        'mrc-three-cheese',
        'Three Cheese Grilled Sandwich',
        'Cheddar, mozzarella and Swiss grilled on buttered sourdough.',
        550,
        IMAGES.grilledCheese,
        [x('mrc-extra-cheese', 'Extra cheese', 90)],
        'Bestseller'
      ),
      I(
        'mrc-philly',
        'Philly Cheesesteak',
        'Shaved beef, peppers, onions and melted provolone.',
        690,
        IMAGES.philly
      ),
      I(
        'mrc-club',
        'Loaded Club Sandwich',
        'Triple-decker chicken, egg, cheese and salad.',
        620,
        IMAGES.clubSandwich
      ),
      I(
        'mrc-panini',
        'Chicken Pesto Panini',
        'Grilled panini with chicken, pesto and mozzarella.',
        650,
        IMAGES.panini
      ),
      I(
        'mrc-tuna',
        'Tuna Melt',
        'Creamy tuna salad and melted cheddar on toasted bread.',
        520,
        IMAGES.tunaMelt
      ),
    ]),
    G('mrc-burgers', 'Burgers & Wraps', [
      I(
        'mrc-burger',
        'Mr Cheese Double Burger',
        'Two beef patties, double cheese and burger sauce.',
        790,
        IMAGES.burgerDouble
      ),
      I(
        'mrc-chicken',
        'Crispy Chicken Burger',
        'Crunchy chicken fillet, lettuce and chipotle mayo.',
        690,
        IMAGES.burgerChicken
      ),
      I(
        'mrc-wrap',
        'Cheesy Chicken Wrap',
        'Grilled chicken, cheese and veggies in a warm wrap.',
        520,
        IMAGES.chickenWrap
      ),
      I(
        'mrc-tenders',
        'Chicken Tenders (4pc)',
        'Golden tenders with a side of ranch.',
        560,
        IMAGES.chickenStrips
      ),
      I(
        'mrc-salad',
        'Chicken Caesar Salad',
        'Grilled chicken, romaine, parmesan and croutons.',
        520,
        IMAGES.salad
      ),
    ]),
    G('mrc-sides', 'Sides & Drinks', [
      I(
        'mrc-fries',
        'Cheese Fries',
        'Fries covered in a rich cheddar sauce.',
        380,
        IMAGES.cheeseFries
      ),
      I(
        'mrc-loaded',
        'Loaded Nachos',
        'Nachos with cheese, salsa and jalapenos.',
        490,
        IMAGES.nachos
      ),
      I(
        'mrc-mozz',
        'Mozzarella Sticks',
        'Six golden mozzarella sticks with marinara.',
        420,
        IMAGES.mozzarellaSticks
      ),
      I(
        'mrc-lemonade',
        'Fresh Lemonade',
        'Hand-squeezed lemonade over ice.',
        250,
        IMAGES.lemonade
      ),
      I(
        'mrc-shake',
        'Oreo Milkshake',
        'Thick vanilla shake blended with Oreo cookies.',
        420,
        IMAGES.oreoShake
      ),
    ]),
  ],

  kababjees: [
    G('kb-rice', 'Biryani & Rice', [
      I(
        'kb-biryani',
        'Chicken Biryani',
        'Aromatic basmati rice layered with spiced chicken and raita.',
        590,
        IMAGES.biryani,
        [x('kb-biryani-raita', 'Extra raita', 60)],
        'Bestseller'
      ),
      I(
        'kb-fried-rice',
        'Chicken Fried Rice',
        'Wok-fried rice with chicken, egg and spring onions.',
        450,
        IMAGES.friedRice
      ),
      I(
        'kb-chowmein',
        'Chicken Chow Mein',
        'Stir-fried noodles with chicken and crunchy vegetables.',
        490,
        IMAGES.chowmein
      ),
    ]),
    G('kb-bbq', 'BBQ & Karahi', [
      I(
        'kb-karahi',
        'Chicken Karahi (Half)',
        'Tomato-based karahi with green chillies and ginger.',
        1490,
        IMAGES.karahi,
        [x('kb-karahi-naan', 'Add 2 naan', 120)]
      ),
      I(
        'kb-seekh',
        'Seekh Kebab (4pc)',
        'Charcoal-grilled minced beef kebabs with chutney.',
        590,
        IMAGES.kebab
      ),
      I(
        'kb-tikka',
        'Chicken Tikka',
        'Smoky tandoori chicken tikka with lemon.',
        480,
        IMAGES.chickenTikka
      ),
      I(
        'kb-bbq',
        'BBQ Mixed Platter',
        'Seekh kebab, tikka, wings and malai boti with naan.',
        1990,
        IMAGES.bbqPlatter
      ),
      I(
        'kb-wings',
        'Tandoori Wings (6pc)',
        'Six wings marinated in tandoori spices.',
        490,
        IMAGES.wingsHot
      ),
    ]),
    G('kb-classics', 'Fried & Curries', [
      I(
        'kb-fried',
        'Fried Chicken (2pc)',
        'Two pieces of crispy fried chicken with a dip.',
        390,
        IMAGES.chickenFried
      ),
      I(
        'kb-bucket',
        'Fried Chicken Bucket (8pc)',
        'Eight crispy pieces with two dips and fries.',
        2390,
        IMAGES.chickenBucket2
      ),
      I(
        'kb-haleem',
        'Beef Haleem',
        'Slow-cooked lentil and beef haleem with crispy toppings.',
        390,
        IMAGES.haleem
      ),
      I(
        'kb-manchurian',
        'Chicken Manchurian',
        'Crispy chicken in a tangy Manchurian sauce.',
        590,
        IMAGES.manchurian
      ),
    ]),
    G('kb-extras', 'Breads & Drinks', [
      I('kb-naan', 'Garlic Naan', 'Fresh tandoori naan brushed with garlic butter.', 90, IMAGES.naan),
      I('kb-raita', 'Fresh Raita', 'Cooling yogurt with cucumber and mint.', 80, IMAGES.raita),
      I('kb-cola', 'Soft Drink 1.5L', 'Chilled family-size soft drink.', 250, IMAGES.cola),
    ]),
  ],

  secondcup: [
    G('sc-coffee', 'Espresso Bar', [
      I(
        'sc-cappuccino',
        'Cappuccino',
        'Double espresso with steamed milk and a velvety foam.',
        550,
        IMAGES.cappuccino
      ),
      I(
        'sc-latte',
        'Caffe Latte',
        'Smooth espresso with plenty of steamed milk.',
        580,
        IMAGES.latte
      ),
      I(
        'sc-americano',
        'Americano',
        'Double espresso lengthened with hot water.',
        480,
        IMAGES.americano
      ),
      I(
        'sc-mocha',
        'Mocha',
        'Espresso, chocolate and steamed milk with whipped cream.',
        620,
        IMAGES.mocha
      ),
      I(
        'sc-cold-brew',
        'Cold Brew',
        'Slow-steeped cold brew served over ice.',
        620,
        IMAGES.coldBrew
      ),
    ]),
    G('sc-iced', 'Iced & Blended', [
      I(
        'sc-iced',
        'Iced Coffee',
        'Espresso poured over ice with a splash of milk.',
        590,
        IMAGES.icedCoffee
      ),
      I(
        'sc-frappe',
        'Caramel Frappe',
        'Blended coffee, caramel and ice topped with cream.',
        650,
        IMAGES.frappe
      ),
      I(
        'sc-chai-latte',
        'Chai Latte',
        'Spiced black tea with steamed milk.',
        520,
        IMAGES.chai
      ),
      I(
        'sc-hot-choc',
        'Hot Chocolate',
        'Rich Belgian chocolate melted into steamed milk.',
        520,
        IMAGES.hotChocolate
      ),
      I(
        'sc-green-tea',
        'Matcha Green Tea',
        'Stone-ground matcha whisked with steamed milk.',
        560,
        IMAGES.greenTea
      ),
    ]),
    G('sc-bakery', 'Bakery & Desserts', [
      I('sc-cheesecake', 'New York Cheesecake', 'Baked cheesecake with a buttery biscuit base.', 720, IMAGES.cheesecake),
      I('sc-croissant', 'Butter Croissant', 'Flaky butter croissant baked fresh daily.', 420, IMAGES.croissant),
      I('sc-cookie', 'Chocolate Chip Cookie', 'Soft-baked cookie packed with chocolate chips.', 250, IMAGES.cookie),
      I('sc-cinnamon', 'Cinnamon Roll', 'Warm cinnamon roll with cream cheese glaze.', 450, IMAGES.cinnamonRoll),
      I('sc-water', 'Still Water 500ml', 'Chilled bottled water.', 100, IMAGES.water),
    ]),
  ],

  glorias: [
    G('gj-coffee', 'Coffee Favourites', [
      I(
        'gj-cappuccino',
        'Classic Cappuccino',
        'Espresso with velvety steamed milk and foam.',
        540,
        IMAGES.cappuccino
      ),
      I(
        'gj-latte',
        'Caramel Latte',
        'Espresso, steamed milk and sweet caramel.',
        590,
        IMAGES.latte
      ),
      I(
        'gj-mocha',
        'Mocha Chiller',
        'Blended chocolate coffee frappe topped with cream.',
        620,
        IMAGES.mocha
      ),
      I(
        'gj-americano',
        'Americano',
        'Bold espresso with hot water.',
        480,
        IMAGES.americano
      ),
      I(
        'gj-iced',
        'Iced Vanilla Latte',
        'Espresso, milk and vanilla syrup over ice.',
        590,
        IMAGES.icedCoffee
      ),
    ]),
    G('gj-chillers', 'Chillers & Teas', [
      I(
        'gj-frappe',
        'Cookies & Cream Chiller',
        'Blended coffee with cookie crumble and cream.',
        650,
        IMAGES.frappe
      ),
      I(
        'gj-hot-choc',
        'Belgian Hot Chocolate',
        'Creamy hot chocolate made with Belgian cocoa.',
        520,
        IMAGES.hotChocolate
      ),
      I(
        'gj-green-tea',
        'Green Tea',
        'Fragrant green tea brewed to order.',
        420,
        IMAGES.greenTea
      ),
      I(
        'gj-cold-brew',
        'Cold Brew Tonic',
        'Cold brew coffee topped with tonic water.',
        640,
        IMAGES.coldBrew
      ),
    ]),
    G('gj-bakery', 'Bakery', [
      I('gj-brownie', 'Fudge Brownie', 'Dense chocolate brownie with a fudgy centre.', 350, IMAGES.brownie),
      I('gj-cheesecake', 'Classic Cheesecake', 'Creamy baked cheesecake with berry compote.', 720, IMAGES.cheesecake),
      I('gj-croissant', 'Butter Croissant', 'Golden, flaky butter croissant.', 420, IMAGES.croissant),
      I('gj-macaron', 'Macaron Box (6pc)', 'Six French macarons in assorted flavours.', 650, IMAGES.macaron),
      I('gj-tiramisu', 'Tiramisu Slice', 'Coffee-soaked sponge with mascarpone cream.', 590, IMAGES.tiramisu),
      I('gj-panini', 'Chicken Pesto Panini', 'Grilled panini with chicken, pesto and cheese.', 620, IMAGES.panini),
    ]),
  ],

  layers: [
    G('ly-cakes', 'Cakes', [
      I(
        'ly-chocolate',
        'Chocolate Fudge Cake (1 lb)',
        'Rich chocolate sponge layered with fudge frosting.',
        3200,
        IMAGES.cake,
        [x('ly-choco-candles', 'Birthday candles', 100)],
        'Bestseller'
      ),
      I(
        'ly-redvelvet',
        'Red Velvet Slice',
        'Classic red velvet with cream cheese frosting.',
        650,
        IMAGES.cakeRedvelvet
      ),
      I(
        'ly-cheesecake',
        'Baked Cheesecake',
        'Creamy baked cheesecake with a biscuit base.',
        700,
        IMAGES.cheesecake
      ),
      I(
        'ly-tier',
        'Celebration Cake (2 lb)',
        'Two-tier celebration cake with buttercream finish.',
        5200,
        IMAGES.cakeTier
      ),
    ]),
    G('ly-bakery', 'Fresh Bakery', [
      I('ly-cupcake', 'Vanilla Cupcake', 'Soft vanilla cupcake with buttercream swirl.', 300, IMAGES.cupcake),
      I('ly-donut', 'Glazed Donut', 'Fluffy donut with a sweet sugar glaze.', 250, IMAGES.donut),
      I('ly-cookies', 'Cookie Box (6 pcs)', 'Six assorted cookies baked fresh.', 450, IMAGES.donutsCookies),
      I('ly-croissant', 'Butter Croissant', 'Flaky croissant made with real butter.', 380, IMAGES.croissant),
      I('ly-cinnamon', 'Cinnamon Roll', 'Soft roll with cinnamon sugar and glaze.', 420, IMAGES.cinnamonRoll),
    ]),
    G('ly-treats', 'Treats & Tea', [
      I('ly-brownie', 'Triple Chocolate Brownie', 'Fudgy brownie loaded with chocolate chunks.', 390, IMAGES.brownie),
      I('ly-macaron', 'Macaron Gift Box (9pc)', 'Nine assorted macarons in a gift box.', 950, IMAGES.macaron),
      I('ly-waffle', 'Belgian Waffle', 'Crisp waffle with chocolate sauce and berries.', 550, IMAGES.waffle),
      I('ly-applepie', 'Apple Pie', 'Buttery pie filled with cinnamon apples.', 350, IMAGES.applePie),
      I('ly-karak', 'Karak Chai', 'Strong milk tea brewed with cardamom.', 220, IMAGES.karakChai),
      I('ly-cola', 'Soft Drink', 'Chilled canned soft drink.', 180, IMAGES.cola),
    ]),
  ],

  sweetcreme: [
    G('sw-desserts', 'Desserts', [
      I(
        'sw-sundae',
        'Fudge Brownie Sundae',
        'Warm brownie, vanilla ice cream, fudge and nuts.',
        550,
        IMAGES.sundae,
        [x('sw-sundae-extra', 'Extra scoop', 120)],
        'Bestseller'
      ),
      I('sw-cone', 'Waffle Cone Deluxe', 'Waffle cone with two scoops and toppings.', 350, IMAGES.iceCream),
      I('sw-lava', 'Molten Lava Cake', 'Chocolate cake with a warm molten centre.', 550, IMAGES.lavaCake),
      I('sw-brownie', 'Fudge Brownie', 'Warm fudgy brownie served with chocolate sauce.', 390, IMAGES.brownie),
      I('sw-cheesecake', 'Baked Cheesecake', 'Creamy baked cheesecake with biscuit crumb.', 700, IMAGES.cheesecake),
      I('sw-ice-cream', 'Premium Vanilla Ice Cream (500ml)', 'Half-litre tub of creamy vanilla ice cream.', 850, IMAGES.iceCreamTub),
    ]),
    G('sw-shakes', 'Shakes & Drinks', [
      I('sw-chocolate-shake', 'Chocolate Milkshake', 'Thick chocolate shake with whipped cream.', 420, IMAGES.shake),
      I('sw-mango-shake', 'Mango Shake', 'Fresh mango blended with cold milk.', 380, IMAGES.mangoShake),
      I('sw-oreo-shake', 'Oreo Milkshake', 'Vanilla shake blended with Oreo cookies.', 450, IMAGES.oreoShake),
      I('sw-lemonade', 'Fresh Lemonade', 'Hand-squeezed lemonade over ice.', 250, IMAGES.lemonade),
    ]),
    G('sw-bakery', 'Bakery', [
      I('sw-waffle', 'Belgian Waffle', 'Crisp waffle with chocolate drizzle.', 550, IMAGES.waffle),
      I('sw-donut', 'Glazed Donut', 'Soft donut with sugar glaze.', 250, IMAGES.donut),
      I('sw-cupcake', 'Chocolate Cupcake', 'Chocolate cupcake with fudge frosting.', 300, IMAGES.cupcake),
      I('sw-macaron', 'Macaron Box (6pc)', 'Assorted French macarons.', 650, IMAGES.macaron),
      I('sw-cinnamon', 'Cinnamon Roll', 'Warm cinnamon roll with cream icing.', 420, IMAGES.cinnamonRoll),
    ]),
  ],

  chaishai: [
    G('cs-tea', 'Chai & Tea', [
      I(
        'cs-karak',
        'Karak Chai',
        'Strong, milky tea brewed with cardamom and cinnamon.',
        160,
        IMAGES.karakChai,
        [x('cs-karak-extra', 'Extra strong', 0)]
      ),
      I('cs-doodh-patti', 'Doodh Patti', 'Pure milk tea simmered slowly for a rich taste.', 220, IMAGES.chai),
      I('cs-elaichi', 'Elaichi Chai', 'Fragrant cardamom tea with a creamy finish.', 200, IMAGES.milkTea),
    ]),
    G('cs-parathas', 'Parathas', [
      I('cs-aloo-paratha', 'Aloo Paratha', 'Stuffed potato paratha with mint chutney.', 220, IMAGES.paratha),
      I('cs-cheese-paratha', 'Cheese Paratha', 'Crispy paratha loaded with melted cheese.', 320, IMAGES.cheeseParatha),
      I('cs-keema-paratha', 'Keema Paratha', 'Spiced minced beef paratha, made fresh.', 380, IMAGES.keemaParatha),
      I('cs-omelette', 'Masala Omelette', 'Fluffy omelette with onions and green chillies.', 280, IMAGES.omelette),
    ]),
    G('cs-desi', 'Desi Classics', [
      I('cs-beef-haleem', 'Beef Haleem', 'Slow-cooked beef and lentil haleem with toppings.', 420, IMAGES.haleem),
      I('cs-nihari', 'Beef Nihari', 'Rich slow-cooked nihari served with naan.', 450, IMAGES.nihari),
      I('cs-karahi', 'Chicken Karahi (Half)', 'Fresh tomato karahi cooked to order.', 750, IMAGES.karahi),
      I('cs-samosa', 'Chicken Samosa (2pc)', 'Crispy samosas filled with spiced chicken.', 120, IMAGES.samosa),
      I('cs-pakora', 'Mixed Pakora', 'Seasonal vegetable pakoras fried fresh.', 180, IMAGES.pakora),
    ]),
    G('cs-drinks', 'Cold Drinks', [
      I('cs-lassi', 'Sweet Lassi', 'Chilled yogurt lassi topped with cream.', 250, IMAGES.lassi),
      I('cs-orange-juice', 'Fresh Orange Juice', 'Freshly squeezed oranges, no sugar added.', 300, IMAGES.juice),
      I('cs-cola', 'Soft Drink', 'Chilled canned soft drink.', 120, IMAGES.cola),
    ]),
  ],
};
