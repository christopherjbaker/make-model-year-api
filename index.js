const Koa = require("koa");
const KoaRouter = require("@koa/router");
const fetch = require("node-fetch");

const app = new Koa();
const router = new KoaRouter();

router.get("/makes", assureCarData, async (ctx, next) => {
  ctx.body = getCarMakes(ctx.carData);
});

router.get("/models", assureCarData, async (ctx, next) => {
  ctx.body = getCarModels(ctx.carData);
});

router.get("/years", assureCarData, async (ctx, next) => {
  ctx.body = getCarYears(ctx.carData);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3001);

function getCarMakes(carData, filters) {
  const carMakes = {};
  for (const { Make } of carData) {
    // filter

    if (!carMakes[Make]) {
      carMakes[Make] = 0;
    }

    carMakes[Make]++;
  }

  return Object.keys(carMakes).map((make) => ({
    Make: make,
    count: carMakes[make],
  }));
}

function getCarModels(carData, filters) {
  const carModels = {};
  for (const { Model } of carData) {
    // filter

    if (!carModels[Model]) {
      carModels[Model] = 0;
    }

    carModels[Model]++;
  }

  return Object.keys(carModels).map((model) => ({
    Model: model,
    count: carModels[model],
  }));
}

function getCarYears(carData, filters) {
  const carYears = {};
  for (const { Year } of carData) {
    // filter

    if (!carYears[Year]) {
      carYears[Year] = 0;
    }

    carYears[Year]++;
  }

  return Object.keys(carYears).map((year) => ({
    Year: year,
    count: carYears[year],
  }));
}

let carData = null;
async function assureCarData(ctx, next) {
  if (!carData) {
    carData = await getCarData();
  }

  ctx.carData = carData;
  next();
}

async function getCarData() {
  const response = await fetch(
    "https://parseapi.back4app.com/classes/Car_Model_List?limit=15000",
    {
      headers: {
        "X-Parse-Application-Id": "hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z",
        "X-Parse-Master-Key": "SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW",
      },
    }
  );

  const data = await response.json();
  return data.results;
}
