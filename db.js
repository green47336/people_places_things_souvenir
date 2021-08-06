const Sequelize = require("sequelize");
const { STRING } = Sequelize.DataTypes;
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/pptdb"
);

const Person = db.define("person", {
  name: {
    type: STRING,
  },
});

const Place = db.define("place", {
  name: {
    type: STRING,
  },
});

const Thing = db.define("thing", {
  name: {
    type: STRING,
  },
});

const Souvenir = db.define("souvenir", {});

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [moe, larry, lucy, ethyl] = await Promise.all([
    Person.create({ name: "moe" }),
    Person.create({ name: "larry" }),
    Person.create({ name: "lucy" }),
    Person.create({ name: "ethyl" }),
  ]);

  const [paris, nyc, chicago, london] = await Promise.all([
    Place.create({ name: "paris" }),
    Place.create({ name: "nyc" }),
    Place.create({ name: "chicago" }),
    Place.create({ name: "london" }),
  ]);

  const [foo, bar, bazz, quq] = await Promise.all([
    Thing.create({ name: "foo" }),
    Thing.create({ name: "bar" }),
    Thing.create({ name: "bazz" }),
    Thing.create({ name: "quq" }),
  ]);

  await Promise.all([
    Souvenir.create({ personId: moe.id, placeId: paris.id, thingId: foo.id }),
    Souvenir.create({ personId: larry.id, placeId: nyc.id, thingId: bar.id }),
    Souvenir.create({
      personId: lucy.id,
      placeId: chicago.id,
      thingId: bazz.id,
    }),
    Souvenir.create({
      personId: ethyl.id,
      placeId: london.id,
      thingId: quq.id,
    }),
  ]);
};

module.exports = {
  syncAndSeed,
  models: {
    Person,
    Place,
    Thing,
    Souvenir,
  },
};
