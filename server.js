const db = require("./db");
const { syncAndSeed } = db;
const { Person, Place, Thing, Souvenir } = db.models;
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/", async (req, res, next) => {
  try {
    const souvenir = await Souvenir.create(req.body);
    res.redirect("/");
  } catch (ex) {
    next(ex);
  }
});

app.get("/", async (req, res, next) => {
  try {
    const person = await Person.findAll();
    const place = await Place.findAll();
    const thing = await Thing.findAll();
    const souvenir = await Souvenir.findAll({
      include: [Person, Place, Thing],
    });

    const stretchOutput = souvenir.map(({ personId, placeId, thingId }) => {
      return {
        person: person.find((person) => person.id === personId),
        place: place.find((place) => place.id === placeId),
        thing: thing.find((thing) => thing.id === thingId),
      };
    });

    res.send(`
            <html>
            <head>
            </head>
            <body>
                <h1>PPT!!!(&S)</h1>
                <form method='POST'>
            <select name='personId'>
              ${person
                .map((person) => {
                  return `
                    <option value=${person.id}>
                      ${person.name}
                    </option>
                  `;
                })
                .join("")}
            </select>
            <select name='placeId'>
              ${place
                .map((place) => {
                  return `
                    <option value=${place.id}>
                      ${place.name}
                    </option>
                  `;
                })
                .join("")}
            </select>
            <select name='thingId'>
              ${thing
                .map((thing) => {
                  return `
                    <option value=${thing.id}>
                      ${thing.name}
                    </option>
                  `;
                })
                .join("")}
            </select>
            <button>Create</button>
          </form>
                <ul>
                    ${person
                      .map((person) => {
                        return `<li>${person.name}</li>`;
                      })
                      .join("")}
                </ul>
                <ul>
                ${place
                  .map((place) => {
                    return `<li>${place.name}</li>`;
                  })
                  .join("")}
                </ul>
                <ul>
                ${thing
                  .map((thing) => {
                    return `<li>${thing.name}</li>`;
                  })
                  .join("")}
                </ul>
                <ul>
                ${stretchOutput
                  .map((somethin) => {
                    return `<li>${somethin.person.name} purchsed a ${somethin.thing.name} in ${somethin.place.name}!</li>`;
                  })
                  .join("")}
                </ul>
            </body>
            </html>
    
    
    `);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await syncAndSeed();
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listen on port ${port}`));
};

init();
