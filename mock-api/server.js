const jsonServer = require("json-server");
const { randomUUID } = require("crypto");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const sessions = new Map();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = `fake-${randomUUID()}`;
  sessions.set(token, user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

function authUser(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  const user = router.db.get("users").find({ id: userId }).value();
  return user || null;
}

server.get("/me", (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json({ id: user.id, email: user.email, name: user.name });
});

server.get("/me/favorites", (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  res.json(user.favorites || []);
});

server.post("/me/favorites/:listingId/toggle", (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { listingId } = req.params;
  const db = router.db;
  const exists = db.get("listings").find({ id: listingId }).value();
  if (!exists) return res.status(404).json({ message: "Listing not found" });

  const favorites = new Set(user.favorites || []);
  let isFavorite;
  if (favorites.has(listingId)) {
    favorites.delete(listingId);
    isFavorite = false;
  } else {
    favorites.add(listingId);
    isFavorite = true;
  }
  db.get("users")
    .find({ id: user.id })
    .assign({ favorites: Array.from(favorites) })
    .write();

  res.json({ isFavorite });
});

server.get("/listings", (req, res) => {
  const db = router.db;
  const {
    city,
    minPrice,
    maxPrice,
    minRating,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  let col = db.get("listings");

  if (city)
    col = col.filter(
      (l) => String(l.city).toLowerCase() === String(city).toLowerCase()
    );
  if (minPrice)
    col = col.filter((l) => Number(l.pricePerNight) >= Number(minPrice));
  if (maxPrice)
    col = col.filter((l) => Number(l.pricePerNight) <= Number(maxPrice));
  if (minRating) col = col.filter((l) => Number(l.rating) >= Number(minRating));

  if (sort === "price_asc") col = col.sortBy("pricePerNight");
  else if (sort === "price_desc") col = col.sortBy("pricePerNight").reverse();
  else if (sort === "rating_desc") col = col.sortBy("rating").reverse();

  const p = Number(page) || 1;
  const lim = Number(limit) || 20;
  const start = (p - 1) * lim;
  const end = start + lim;
  const total = col.size().value();
  const items = col.slice(start, end).value();

  res.setHeader("X-Total-Count", String(total));
  res.json(items);
});

server.post("/bookings", (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { listingId, checkIn, checkOut, guests } = req.body || {};
  if (!listingId || !checkIn || !checkOut) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const db = router.db;
  const listing = db.get("listings").find({ id: listingId }).value();
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const ci = new Date(checkIn).getTime();
  const co = new Date(checkOut).getTime();
  if (!(ci < co))
    return res.status(400).json({ message: "Invalid date range" });

  const overlap = db
    .get("bookings")
    .filter({ listingId })
    .some((b) => {
      const bi = new Date(b.checkIn).getTime();
      const bo = new Date(b.checkOut).getTime();

      return ci < bo && bi < co;
    })
    .value();

  if (overlap) {
    return res.status(409).json({ message: "Dates are not available" });
  }

  const id = `b_${randomUUID()}`;
  const createdAt = new Date().toISOString();
  const booking = {
    id,
    listingId,
    userId: user.id,
    checkIn,
    checkOut,
    guests: guests || 1,
    createdAt,
  };

  db.get("bookings").push(booking).write();

  db.get("listings")
    .find({ id: listingId })
    .assign({ bookingsCount: (listing.bookingsCount || 0) + 1 })
    .write();

  res.status(201).json(booking);
});

server.use("/api", router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
