
// Definir constantes de Node.js.
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Configurar elementos para métodos.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Lectura y escritura de archivos JSON.
const readItems = (method) => {
    const filePath = path.join(__dirname, 'data', method, `${method}.json`);
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  };
  
  const writeItems = (method, items) => {
    const dirPath = path.join(__dirname, 'data', method);
    const filePath = path.join(dirPath, `${method}.json`);
  
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
  };
// Metodos:

// GET
app.get('/get', (req, res) => {
    const items = readItems('get');
    res.json(items);
});

// POST
app.post('/post', (req, res) => {
    const items = readItems('post');
    const newItem = {
      id: items.length ? items[items.length - 1].id + 1 : 1,
      name: req.body.name,
      price: req.body.price
    };
    items.push(newItem);
    writeItems('post', items);
    res.status(201).json(newItem);
});

// PUT
app.put('/put/:id', (req, res) => {
    const items = readItems('put');
    const index = items.findIndex(i => i.id == req.params.id);
    if (index === -1) return res.status(404).send('No se encontró el ítem');
  
    const updatedItem = {
      id: parseInt(req.params.id),
      name: req.body.name,
      price: req.body.price
    };
    items[index] = updatedItem;
    writeItems('put', items);
    res.json(updatedItem);
});

// PATCH
app.patch('/patch/:id', (req, res) => {
    const items = readItems('patch');
    const item = items.find(i => i.id == req.params.id);
    if (!item) {return res.status(404).send('No se encontró el ítem');}

    if (req.body.name !== undefined) {item.name = req.body.name;}
    if (req.body.price !== undefined) {item.price = req.body.price;}
  
    writeItems('patch', items);
    res.json(item);
});

// HEAD
app.head('/head/:id', (req, res) => {
    const items = readItems('head');
    const itemExists = items.some(i => i.id == req.params.id)
    if (!itemExists) {return res.status(404).send('No se encontró el ítem');}

    res.sendStatus(200);
});

// DELETE
app.delete('/delete/:id', (req, res) => {
    const items = readItems('delete');
    const index = items.findIndex(i => i.id == req.params.id)
    if (index === -1) {return res.status(404).send('No se encontró el ítem');}
    items.splice(index, 1);
    writeItems('delete', items);

    res.sendStatus(204);
});

// OPTIONS
app.options('/options', (req, res) => {
    res.set('Allow', 'GET,POST,PUT,PATCH,HEAD,DELETE,OPTIONS');
    res.send();
});

//
app.listen(PORT, () => {
    console.log(`La API está escuchando a través de http://localhost:${PORT}`);
  });