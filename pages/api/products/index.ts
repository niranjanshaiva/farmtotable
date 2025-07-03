import { readSheet, writeSheet } from '../../../lib/excel';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = readSheet('products');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const data = readSheet('products');
    const newItem = { id: Date.now().toString(), ...req.body };
    writeSheet('products', [...data, newItem]);
    res.status(201).json({ success: true });
  }
}
