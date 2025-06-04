const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const upload = multer({ dest: 'upload/' });

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/v1/session/sign-up', (req, res) => {
  const db = router.db;
  const users = db.get('users');
  const userExists = users.find({ nickname: req.body.nickname }).value();

  if (userExists) {
    return res.status(400).json({ error: 'Nickname already exists' });
  }

  const newUser = {
    id: Date.now(),
    ...req.body,
    access_token: 'fake-jwt-token-' + Date.now()
  };
  users.push(newUser).write();
  res.status(201).json(newUser);
});

server.post('/v1/session/sign-in', (req, res) => {
  const db = router.db;
  const user = db.get('users').find({ nickname: req.body.nickname, password: req.body.password }).value();

  if (!user) {
    return res.status(401).json({ error: 'Invalid nickname or password' });
  }

  res.json({ access_token: user.access_token });
});

server.use((req, res, next) => {
  if (['/v1/products', '/v1/products/featured', '/v1/products/slug', '/v1/products/search', '/v1/products/remove', '/v1/session'].some(path => req.path.startsWith(path))) {
    if (req.method !== 'GET') {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
  }
  next();
});

server.post('/v1/products', upload.single('file'), (req, res) => {
  const db = router.db;
  const products = db.get('products');

  const { title, description, price, slug } = req.body;

  if (products.find({ slug }).value()) {
    return res.status(400).json({ error: 'Slug already exists' });
  }

  const newProduct = {
    id: Date.now(),
    title,
    description,
    price: parseFloat(price),
    slug,
    featured: false,
    owner: 1,
    image: req.file ? `/upload/${req.file.filename}` : null
  };

  products.push(newProduct).write();

  res.status(201).json(newProduct);
});

server.patch('/v1/products/featured/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);

  const product = db.get('products').find({ id }).value();
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.get('products').find({ id }).assign({ featured: true }).write();

  res.json({ message: 'Product featured' });
});

server.get('/v1/products/slug/:slug', (req, res) => {
  const db = router.db;
  const product = db.get('products').find({ slug: req.params.slug }).value();

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

server.get('/v1/products/featured', (req, res) => {
  const db = router.db;
  const products = db.get('products').filter({ featured: true }).value();
  res.json(products);
});

server.get('/v1/products/search', (req, res) => {
  const db = router.db;
  const q = req.query.q?.toLowerCase() || '';
  const products = db.get('products').filter(p => p.title.toLowerCase().includes(q)).value();
  res.json(products);
});

server.delete('/v1/products/remove/:title', (req, res) => {
  const db = router.db;
  const title = req.params.title;
  const product = db.get('products').find({ title }).value();

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.get('products').remove({ title }).write();

  res.json({ message: 'Product removed' });
});

server.delete('/v1/session', (req, res) => {
  res.json({ message: 'User logged out' });
});

server.use('/upload', jsonServer.static(path.join(__dirname, 'upload')));
server.use('/v1', router);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT}/v1`);
});
