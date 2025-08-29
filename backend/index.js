const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.send("Bievenidos");
});

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// POST create new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex !== -1) {
    if (!name || !email) {
      return res.status(400).send('Name and email are required');
    }
    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  if (users.length < initialLength) {
    res.status(204).send(); // No Content
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
