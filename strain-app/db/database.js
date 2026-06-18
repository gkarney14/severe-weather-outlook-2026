const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, '../strains.db'));
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS strains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('sativa','indica','hybrid')),
    thc_min REAL DEFAULT 0,
    thc_max REAL DEFAULT 0,
    cbd_min REAL DEFAULT 0,
    cbd_max REAL DEFAULT 1,
    effects TEXT DEFAULT '[]',
    flavors TEXT DEFAULT '[]',
    terpenes TEXT DEFAULT '[]',
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strain_id INTEGER NOT NULL REFERENCES strains(id) ON DELETE CASCADE,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    notes TEXT DEFAULT '',
    personal_effects TEXT DEFAULT '[]',
    date_tried TEXT,
    would_try_again INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

const STRAINS = [
  {
    name: 'OG Kush', type: 'hybrid', thc_min: 19, thc_max: 26, cbd_min: 0, cbd_max: 0.3,
    effects: ['Relaxed','Happy','Euphoric','Uplifted','Sleepy'],
    flavors: ['Earthy','Pine','Woody','Diesel'],
    terpenes: ['Myrcene','Limonene','Caryophyllene'],
    description: 'A classic California strain with a complex aroma of fuel, skunk, and spice. OG Kush delivers a heavy, euphoric high with strong body relaxation. One of the most sought-after strains for stress and pain relief.'
  },
  {
    name: 'Blue Dream', type: 'hybrid', thc_min: 17, thc_max: 24, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Creative','Euphoric','Happy','Energetic'],
    flavors: ['Berry','Sweet','Earthy','Blueberry'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'A sativa-dominant hybrid originating in California that has achieved legendary status among West Coast strains. Blue Dream balances full-body relaxation with gentle cerebral invigoration — great for daytime use.'
  },
  {
    name: 'Girl Scout Cookies', type: 'hybrid', thc_min: 19, thc_max: 28, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Relaxed','Euphoric','Uplifted','Creative'],
    flavors: ['Sweet','Earthy','Pungent','Mint'],
    terpenes: ['Caryophyllene','Limonene','Linalool'],
    description: 'GSC is an OG Kush and Durban Poison hybrid whose fame stretches across the United States. Produces a euphoric high accompanied by waves of full-body relaxation and a sweet, minty exhale.'
  },
  {
    name: 'Sour Diesel', type: 'sativa', thc_min: 20, thc_max: 25, cbd_min: 0, cbd_max: 0.3,
    effects: ['Energetic','Happy','Uplifted','Creative','Focused'],
    flavors: ['Diesel','Citrus','Earthy','Pungent'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'An invigorating sativa named after its pungent, diesel-like aroma. Sour Diesel produces dreamy, fast-acting effects that deliver an energizing, cerebral high perfect for creative endeavors and combating depression.'
  },
  {
    name: 'Purple Haze', type: 'sativa', thc_min: 17, thc_max: 20, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Energetic','Uplifted','Creative','Euphoric'],
    flavors: ['Sweet','Berry','Earthy','Spice'],
    terpenes: ['Terpinolene','Ocimene','Myrcene'],
    description: 'Immortalized by Jimi Hendrix, Purple Haze is a classic sativa with blissful, long-lasting euphoria that sparks creativity. The berry-sweet aroma and colorful purple buds make it one of the most iconic strains.'
  },
  {
    name: 'Northern Lights', type: 'indica', thc_min: 16, thc_max: 21, cbd_min: 0.1, cbd_max: 0.3,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Sweet','Spicy','Pine','Earthy'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'One of the most famous strains of all time, Northern Lights is a pure indica known for its resinous buds. Produces a dreamy, relaxing high that relieves stress, insomnia, and pain. A truly legendary cultivar.'
  },
  {
    name: 'Granddaddy Purple', type: 'indica', thc_min: 17, thc_max: 23, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Grape','Berry','Sweet','Earthy'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'Ken Estes introduced this famous indica cross of Purple Urkle and Big Bud in 2003. Granddaddy Purple delivers complex grape and berry aromas with a physically sedating high that locks you to the couch.'
  },
  {
    name: 'Jack Herer', type: 'sativa', thc_min: 18, thc_max: 24, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Energetic','Creative','Uplifted','Focused'],
    flavors: ['Pine','Earthy','Woody','Spicy'],
    terpenes: ['Terpinolene','Caryophyllene','Ocimene'],
    description: 'Named after the cannabis activist, Jack Herer is a celebrated sativa that balances a blissful, clear-headed cerebral high with creativity. Its spicy pine aroma has made it a daytime classic for two decades.'
  },
  {
    name: 'White Widow', type: 'hybrid', thc_min: 18, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Uplifted','Euphoric','Energetic','Relaxed'],
    flavors: ['Earthy','Woody','Sweet','Pepper'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'A balanced hybrid born in the Netherlands that has been a coffeeshop staple since the early 1990s. White Widow is famous for its white crystal resin coating and powerful burst of euphoria and energy.'
  },
  {
    name: 'AK-47', type: 'hybrid', thc_min: 13, thc_max: 20, cbd_min: 0.1, cbd_max: 0.1,
    effects: ['Happy','Relaxed','Uplifted','Creative','Euphoric'],
    flavors: ['Sweet','Earthy','Floral','Sandalwood'],
    terpenes: ['Caryophyllene','Myrcene','Terpinolene'],
    description: 'AK-47 is a multi-national cross with Colombian, Mexican, Thai, and Afghani origins. Despite its aggressive name it delivers mellow yet long-lasting cerebral effects and a social, uplifted mood.'
  },
  {
    name: 'Gorilla Glue #4', type: 'hybrid', thc_min: 25, thc_max: 32, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Earthy','Pine','Chemical','Diesel'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'GG4 earned multiple Cannabis Cup wins. This award-winning hybrid delivers heavy-handed euphoria and relaxation, leaving you feeling glued to the couch. Pungent earthy-diesel aroma with a chocolate-coffee finish.'
  },
  {
    name: 'Green Crack', type: 'sativa', thc_min: 15, thc_max: 25, cbd_min: 0, cbd_max: 0.1,
    effects: ['Energetic','Happy','Uplifted','Focused','Creative'],
    flavors: ['Citrus','Earthy','Sweet','Mango'],
    terpenes: ['Myrcene','Caryophyllene','Ocimene'],
    description: 'A potent sativa praised for its invigorating mental buzz. Named by Snoop Dogg, Green Crack has a tangy, fruity flavor profile reminiscent of mango. Perfect for combating fatigue and staying productive all day.'
  },
  {
    name: 'Wedding Cake', type: 'hybrid', thc_min: 25, thc_max: 27, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Happy','Euphoric','Uplifted','Hungry'],
    flavors: ['Sweet','Vanilla','Earthy','Tangy'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'Also known as Pink Cookies, Wedding Cake is a potent indica-hybrid with rich, tangy flavors and a relaxing, euphoric high. A cross of Girl Scout Cookies and Cherry Pie — a deliciously calming experience.'
  },
  {
    name: 'Gelato', type: 'hybrid', thc_min: 20, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Relaxed','Euphoric','Uplifted','Creative'],
    flavors: ['Sweet','Fruity','Citrus','Berry','Lavender'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'A cross of Sunset Sherbet and Thin Mint GSC from San Francisco. Gelato delivers sweet citrusy dessert-like flavors paired with a potent high that keeps you numb, blissful, and inspired.'
  },
  {
    name: 'Runtz', type: 'hybrid', thc_min: 19, thc_max: 29, cbd_min: 0, cbd_max: 0.1,
    effects: ['Euphoric','Happy','Relaxed','Uplifted','Tingly'],
    flavors: ['Fruity','Sweet','Tropical','Candy'],
    terpenes: ['Caryophyllene','Limonene','Linalool'],
    description: 'A cross of Zkittlez and Gelato named after the beloved candy. Runtz delivers a creamy smooth smoke with euphoric, uplifting effects that linger for hours. The candy-colored buds are as beautiful as the flavor.'
  },
  {
    name: 'Zkittlez', type: 'indica', thc_min: 15, thc_max: 23, cbd_min: 0.1, cbd_max: 0.3,
    effects: ['Happy','Relaxed','Uplifted','Euphoric','Focused'],
    flavors: ['Sweet','Fruity','Grape','Tropical','Berry'],
    terpenes: ['Caryophyllene','Humulene','Linalool'],
    description: 'Award-winning Zkittlez is a mix of Grape Ape and Grapefruit. This strain delivers a potent, mentally stimulating and physically calming high with a rainbow of tropical fruit flavors that truly taste like candy.'
  },
  {
    name: 'Bubba Kush', type: 'indica', thc_min: 14, thc_max: 22, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Sleepy','Happy','Hungry','Euphoric'],
    flavors: ['Sweet','Chocolate','Coffee','Hash','Earthy'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'Bubba Kush is a heavily indica strain known for its heavy tranquilizing effects. Sweet hashish flavors with subtle notes of chocolate and coffee make this a perennial favorite for insomnia and stress relief.'
  },
  {
    name: 'Pineapple Express', type: 'hybrid', thc_min: 17, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Uplifted','Energetic','Creative','Euphoric'],
    flavors: ['Pineapple','Citrus','Sweet','Tropical','Cedar'],
    terpenes: ['Caryophyllene','Ocimene','Myrcene'],
    description: 'Made famous by the Seth Rogen film, Pineapple Express combines Trainwreck and Hawaiian genetics. The smell of fresh apple and mango, with a taste of pineapple and cedar make this a sensory delight.'
  },
  {
    name: 'Chemdawg', type: 'hybrid', thc_min: 15, thc_max: 20, cbd_min: 0, cbd_max: 0.1,
    effects: ['Happy','Relaxed','Euphoric','Creative','Uplifted'],
    flavors: ['Chemical','Diesel','Earthy','Pungent'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'Discovered in the early 90s, Chemdawg delivers potent cerebral buzz with a strong chemical-diesel aroma. The genetic ancestor of OG Kush and Sour Diesel — a true cannabis landmark.'
  },
  {
    name: 'Durban Poison', type: 'sativa', thc_min: 17, thc_max: 26, cbd_min: 0.1, cbd_max: 0.5,
    effects: ['Energetic','Happy','Uplifted','Creative','Focused'],
    flavors: ['Sweet','Pine','Earthy','Anise','Spice'],
    terpenes: ['Terpinolene','Myrcene','Ocimene'],
    description: 'Durban Poison is a pure sativa originating from the South African port city of Durban. Worldwide popularity for its sweet smell and energetic, uplifting effects. The ideal daytime, get-things-done strain.'
  },
  {
    name: 'Super Lemon Haze', type: 'sativa', thc_min: 16, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Energetic','Happy','Creative','Uplifted','Euphoric'],
    flavors: ['Lemon','Citrus','Sweet','Earthy','Tropical'],
    terpenes: ['Terpinolene','Ocimene','Myrcene'],
    description: 'A multi-cup winner cross of Super Silver Haze and Lemon Skunk. Zesty lemon candy flavor and energizing, uplifted mood. One of the best wake-and-bake strains ever created.'
  },
  {
    name: 'Strawberry Cough', type: 'sativa', thc_min: 15, thc_max: 23, cbd_min: 0.1, cbd_max: 0.3,
    effects: ['Happy','Uplifted','Energetic','Euphoric','Creative'],
    flavors: ['Strawberry','Sweet','Berry','Earthy'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'A potent sativa with a sweet smell of fresh strawberries. The delicious flavor complements a clear-headed, expansive sativa high that boosts sociability and alleviates anxiety effectively.'
  },
  {
    name: 'Do-Si-Dos', type: 'indica', thc_min: 21, thc_max: 30, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Sleepy','Euphoric','Hungry'],
    flavors: ['Earthy','Sweet','Floral','Lime'],
    terpenes: ['Limonene','Caryophyllene','Linalool'],
    description: 'A cross of Girl Scout Cookies and Face Off OG, Do-Si-Dos delivers deeply relaxing, physically sedating effects with a unique earthy, floral, lime flavor profile. Heavy enough for experienced users only.'
  },
  {
    name: 'MAC 1', type: 'hybrid', thc_min: 21, thc_max: 23, cbd_min: 0, cbd_max: 0.1,
    effects: ['Happy','Euphoric','Relaxed','Creative','Uplifted'],
    flavors: ['Diesel','Floral','Citrus','Earthy','Creamy'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'Miracle Alien Cookies (MAC 1) is known for extremely high terpene content. It provides balanced euphoria that is great for socializing or creative work — a connoisseur\'s favorite.'
  },
  {
    name: 'Ice Cream Cake', type: 'indica', thc_min: 23, thc_max: 25, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Vanilla','Sweet','Creamy','Nutty','Cheese'],
    terpenes: ['Caryophyllene','Linalool','Limonene'],
    description: 'A cross of Wedding Cake and Gelato #33, Ice Cream Cake is known for its creamy vanilla flavor and deeply sedating effects. The cheese and nutty vanilla exhale is incredibly smooth — a perfect nightcap strain.'
  },
  {
    name: 'Tropicana Cookies', type: 'sativa', thc_min: 19, thc_max: 29, cbd_min: 0, cbd_max: 0.1,
    effects: ['Euphoric','Happy','Energetic','Uplifted','Creative'],
    flavors: ['Citrus','Orange','Sweet','Tropical','Tangy'],
    terpenes: ['Limonene','Caryophyllene','Linalool'],
    description: 'A cross of Girl Scout Cookies and Tangie, Tropicana Cookies brings bright citrus flavors combined with creative, focused energy. One of the most aromatic strains — opens the jar and it hits you immediately.'
  },
  {
    name: 'Mimosa', type: 'hybrid', thc_min: 19, thc_max: 30, cbd_min: 0, cbd_max: 0.1,
    effects: ['Happy','Uplifted','Energetic','Focused','Creative'],
    flavors: ['Citrus','Sweet','Fruity','Tropical','Earthy'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'A cross of Clementine and Purple Punch, Mimosa offers a happy, uplifted mood and fresh citrus flavor reminiscent of the brunch cocktail. Ideal for morning or afternoon sessions when you want to stay productive.'
  },
  {
    name: 'Purple Punch', type: 'indica', thc_min: 20, thc_max: 25, cbd_min: 0.1, cbd_max: 0.3,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Grape','Blueberry','Sweet','Candy','Vanilla'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'A 1:1 cross of Larry OG and Granddaddy Purple. Purple Punch delivers sweet, dessert-like flavors of grape candy, blueberry muffins, and tart Kool-Aid. A knockout nighttime strain.'
  },
  {
    name: 'Trainwreck', type: 'hybrid', thc_min: 18, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Energetic','Uplifted','Creative','Euphoric'],
    flavors: ['Pine','Earthy','Citrus','Lemon','Spicy'],
    terpenes: ['Terpinolene','Myrcene','Ocimene'],
    description: 'A mind-bending, potent sativa from Northern California that hits like a freight train. Earthy pine and lemon-spice aromas precede a powerful, creative head high and relaxing body buzz — a true classic.'
  },
  {
    name: 'Bruce Banner', type: 'hybrid', thc_min: 20, thc_max: 30, cbd_min: 0, cbd_max: 0.1,
    effects: ['Happy','Euphoric','Creative','Energetic','Uplifted'],
    flavors: ['Diesel','Sweet','Earthy','Strawberry'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'Named after the Hulk\'s alter ego, Bruce Banner is incredibly powerful yet delivers a surprisingly pleasant, balanced high. Diesel and sweet berry aromas lead into fast-acting euphoria that levels out to productive creative energy.'
  },
  {
    name: 'Sunset Sherbet', type: 'hybrid', thc_min: 15, thc_max: 24, cbd_min: 0.1, cbd_max: 0.3,
    effects: ['Happy','Relaxed','Euphoric','Uplifted','Creative'],
    flavors: ['Sweet','Berry','Citrus','Sherbet','Earthy'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'A potent indica-dominant hybrid descended from Girl Scout Cookies. Sunset Sherbet provides full-body effects with a balancing burst of cerebral energy and sweet, dessert-like flavors. The parent of many modern hybrids.'
  },
  {
    name: 'Slurricane', type: 'indica', thc_min: 20, thc_max: 28, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Sleepy','Euphoric','Happy','Hungry'],
    flavors: ['Sweet','Grape','Tropical','Berry','Earthy'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'A cross of Do-Si-Dos and Purple Punch, Slurricane combines deliciously sweet flavors with heavy, relaxing effects that slowly creep up and settle into full-body sedation. For fans of heavy indicas.'
  },
  {
    name: 'Animal Cookies', type: 'hybrid', thc_min: 18, thc_max: 27, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Sleepy','Euphoric','Hungry'],
    flavors: ['Sweet','Earthy','Floral','Cookie','Vanilla'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'A cross of Animal Mints and GSC phenotypes. Animal Cookies has a sweet, earthy flavor and provides powerful full-body effects that are deeply relaxing. Great for experienced users looking for potent stress relief.'
  },
  {
    name: 'Forbidden Fruit', type: 'indica', thc_min: 23, thc_max: 26, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Cherry','Tropical','Sweet','Citrus','Grapefruit'],
    terpenes: ['Myrcene','Limonene','Caryophyllene'],
    description: 'A cross of Cherry Pie and Tangie, Forbidden Fruit carries heavyweight effects and a complex terpene profile that smells of tropical citrus and sweet cherries. The taste is as tempting as the name suggests.'
  },
  {
    name: 'Skywalker OG', type: 'indica', thc_min: 20, thc_max: 30, cbd_min: 0, cbd_max: 0.2,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Earthy','Pine','Sweet','Spicy','Diesel'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'A cross of Mazar, Blueberry, and OG Kush. Skywalker OG delivers heavy, meditative relaxation with a pungent earthy and spicy pine aroma. Named with the Force in mind — very powerful.'
  },
  {
    name: 'Amnesia Haze', type: 'sativa', thc_min: 20, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Creative','Uplifted','Energetic','Euphoric'],
    flavors: ['Lemon','Earthy','Sweet','Citrus','Spicy'],
    terpenes: ['Terpinolene','Myrcene','Ocimene'],
    description: 'A mostly sativa strain that took Amsterdam coffeeshops by storm. Created from South Asian and Jamaican landraces, it delivers an instant energy rush, sharp focus, and a bright, lemony flavor profile.'
  },
  {
    name: 'Candyland', type: 'sativa', thc_min: 14, thc_max: 24, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Uplifted','Energetic','Creative','Focused'],
    flavors: ['Sweet','Earthy','Woody','Candy','Spice'],
    terpenes: ['Caryophyllene','Myrcene','Pinene'],
    description: 'A sativa-dominant phenotype of Bay Platinum Cookies by Ken Estes. Gold sugar-coated buds produce sweet and earthy aromas. Energetic, uplifting high provides creative focus and sociability without overwhelming sedation.'
  },
  {
    name: 'Grape Ape', type: 'indica', thc_min: 18, thc_max: 21, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Grape','Berry','Sweet','Earthy','Skunk'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'From Apothecary Genetics, Grape Ape is bred from Mendocino Purps, Skunk, and Afghani. The candy grape flavor and deeply relaxing body high make it an ideal evening or pre-sleep strain.'
  },
  {
    name: 'Blue Cheese', type: 'indica', thc_min: 15, thc_max: 20, cbd_min: 0.1, cbd_max: 0.6,
    effects: ['Relaxed','Happy','Sleepy','Euphoric','Hungry'],
    flavors: ['Cheese','Blueberry','Sweet','Earthy','Berry'],
    terpenes: ['Myrcene','Caryophyllene','Pinene'],
    description: 'Created by crossing a Blueberry male with an original UK Cheese female. Blue Cheese\'s unique cheese-meets-berry flavor is unforgettable, and its smooth, relaxing effects are great for unwinding after a long day.'
  },
  {
    name: 'Lemon Haze', type: 'sativa', thc_min: 15, thc_max: 20, cbd_min: 0.1, cbd_max: 0.1,
    effects: ['Happy','Energetic','Uplifted','Creative','Euphoric'],
    flavors: ['Lemon','Citrus','Sweet','Earthy','Tropical'],
    terpenes: ['Terpinolene','Limonene','Myrcene'],
    description: 'A sativa-dominant hybrid from Lemon Skunk and Silver Haze. Like eating a lemon candy, this strain has a bright citrus aroma and delivers cheerful, head-high effects perfect for social settings.'
  },
  {
    name: 'Biscotti', type: 'indica', thc_min: 21, thc_max: 25, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Sleepy','Euphoric','Hungry'],
    flavors: ['Sweet','Nutty','Earthy','Cookie','Vanilla'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'A potent cross of Gelato 25, South Florida OG, and GSC from Cookies Fam. Named for its sweet, cookie-like aroma, Biscotti delivers calm, relaxing cerebral effects that melt into full-body relaxation.'
  },
  {
    name: 'Gary Payton', type: 'hybrid', thc_min: 20, thc_max: 25, cbd_min: 0, cbd_max: 0.1,
    effects: ['Happy','Euphoric','Relaxed','Uplifted','Creative'],
    flavors: ['Spicy','Herbal','Diesel','Earthy','Funky'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'Named after the NBA Hall-of-Famer, Gary Payton by Cookies and Powerzzzup is a cross of The Y and Snowman. Boasts a complex peppery-diesel aroma and balanced uplifting effects that stay with you for hours.'
  },
  {
    name: 'Cereal Milk', type: 'hybrid', thc_min: 18, thc_max: 23, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Creative','Euphoric','Uplifted'],
    flavors: ['Sweet','Creamy','Vanilla','Fruity','Earthy'],
    terpenes: ['Caryophyllene','Limonene','Linalool'],
    description: 'Cookies\' Cereal Milk is a cross of Y Life and Snowman. It produces a sweet, creamy flavor reminiscent of the milk left after a bowl of fruity cereal, paired with balanced, relaxing euphoric effects.'
  },
  {
    name: 'London Pound Cake', type: 'indica', thc_min: 25, thc_max: 29, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Sleepy','Euphoric','Hungry'],
    flavors: ['Sweet','Berry','Grape','Lemon','Earthy'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'London Pound Cake 75 from Doja Pak is a cross of Sunset Sherbet and a heavy indica. It packs rich berry and lemon flavors with deeply sedating full-body effects. Only for those with a high tolerance.'
  },
  {
    name: 'Kosher Kush', type: 'indica', thc_min: 20, thc_max: 25, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Relaxed','Sleepy','Happy','Euphoric','Hungry'],
    flavors: ['Earthy','Pine','Lemon','Herbal','Spicy'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'Kosher Kush won the High Times Cannabis Cup Best Indica in 2010 and 2011. This legendary LA strain carries an earthy, pine-laden aroma with a deeply relaxing high perfect for evening use and chronic insomnia.'
  },
  {
    name: 'Super Silver Haze', type: 'sativa', thc_min: 18, thc_max: 23, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Energetic','Creative','Uplifted','Euphoric'],
    flavors: ['Citrus','Sweet','Earthy','Spicy','Skunk'],
    terpenes: ['Myrcene','Terpinolene','Caryophyllene'],
    description: 'SSH is a legendary Sensi Seeds creation from Northern Lights #5, Haze, and Skunk #1. A multiple Cannabis Cup winner delivering long-lasting energizing effects with a spicy citrus aroma that is truly unique.'
  },
  {
    name: 'Critical Mass', type: 'indica', thc_min: 19, thc_max: 22, cbd_min: 0.5, cbd_max: 5,
    effects: ['Relaxed','Sleepy','Happy','Hungry','Euphoric'],
    flavors: ['Sweet','Earthy','Floral','Skunk','Citrus'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'A cross of Afghani and Skunk #1 from Mr. Nice Seeds. Notable for unusually high CBD content among recreational strains, Critical Mass delivers heavy relaxation, excellent pain relief, and a sweet floral aroma.'
  },
  {
    name: 'Cherry Pie', type: 'hybrid', thc_min: 16, thc_max: 24, cbd_min: 0.1, cbd_max: 0.2,
    effects: ['Happy','Euphoric','Uplifted','Relaxed','Creative'],
    flavors: ['Cherry','Sweet','Berry','Earthy','Floral'],
    terpenes: ['Caryophyllene','Myrcene','Limonene'],
    description: 'A cross of Granddaddy Purple and Durban Poison. Dense buds of purple and orange hairs carry sweet-sour cherry aromas. Balanced hybrid effects deliver creative euphoria and mild body relaxation — approachable for all levels.'
  },
  {
    name: 'Mango Kush', type: 'indica', thc_min: 11, thc_max: 20, cbd_min: 0, cbd_max: 0.3,
    effects: ['Happy','Relaxed','Uplifted','Euphoric','Hungry'],
    flavors: ['Mango','Sweet','Tropical','Earthy','Banana'],
    terpenes: ['Myrcene','Caryophyllene','Limonene'],
    description: 'Descended from Hindu Kush and Mango. True to its name, it has a pungent tropical smell of mango combined with earthy kush notes. The relaxing, happy high and approachable THC levels make it great for beginners.'
  },
  {
    name: 'Obama Runtz', type: 'hybrid', thc_min: 24, thc_max: 28, cbd_min: 0, cbd_max: 0.1,
    effects: ['Relaxed','Happy','Euphoric','Sleepy','Hungry'],
    flavors: ['Sweet','Fruity','Candy','Earthy','Tropical'],
    terpenes: ['Caryophyllene','Limonene','Myrcene'],
    description: 'A potent hybrid cross of Obama OG and Runtz combining kush genetics with sweet, fruity candy flavors. Delivers heavy relaxation wrapped in tropical sweetness — an evening strain for experienced users.'
  }
];

const seeded = db.prepare('SELECT COUNT(*) as c FROM strains').get().c;
if (seeded === 0) {
  const insert = db.prepare(`
    INSERT INTO strains (name,type,thc_min,thc_max,cbd_min,cbd_max,effects,flavors,terpenes,description)
    VALUES (@name,@type,@thc_min,@thc_max,@cbd_min,@cbd_max,@effects,@flavors,@terpenes,@description)
  `);
  db.exec('BEGIN');
  for (const s of STRAINS) {
    insert.run({
      '@name': s.name, '@type': s.type,
      '@thc_min': s.thc_min, '@thc_max': s.thc_max,
      '@cbd_min': s.cbd_min, '@cbd_max': s.cbd_max,
      '@effects': JSON.stringify(s.effects),
      '@flavors': JSON.stringify(s.flavors),
      '@terpenes': JSON.stringify(s.terpenes),
      '@description': s.description,
    });
  }
  db.exec('COMMIT');
  console.log(`Seeded ${STRAINS.length} strains.`);
}

module.exports = db;
