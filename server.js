const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let movies = [
  { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
  { id: 2, title: 'Interstellar', director: 'Christopher Nolan', year: 2014 },
];

let series = [
  { id: 1, title: 'Breaking Bad', seasons: 5, creator: 'Vince Gilligan' },
  { id: 2, title: 'Stranger Things', seasons: 4, creator: 'Duffer Brothers' },
];

let songs = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', year: 2019 },
  { id: 2, title: 'Shape of You', artist: 'Ed Sheeran', year: 2017 },
];

// Utility function to get data based on category
function getData(category) {
  if (category === 'movies') return movies;
  if (category === 'series') return series;
  if (category === 'songs') return songs;
  return null;
}

// --- ROUTES ---

['movies', 'series', 'songs'].forEach((category) => {
  const path = `/${category}`;

  // GET
  app.get(path, (req, res) => {
    res.json(getData(category));
  });

  // POST
  app.post(path, (req, res) => {
    const newItem = req.body;
    const list = getData(category);
    newItem.id = list.length ? list[list.length - 1].id + 1 : 1;
    list.push(newItem);
    res.json(list);
  });

  // PUT
  app.put(`${path}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const list = getData(category);
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...req.body };
      res.json(list);
    } else {
      res.status(404).send({ error: 'Item not found' });
    }
  });

  // DELETE
  app.delete(`${path}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    let list = getData(category);
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      res.json(list);
    } else {
      res.status(404).send({ error: 'Item not found' });
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
