import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'products.xlsx');

      let products = [];

      // If file exists, read existing data
      if (fs.existsSync(filePath)) {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        products = xlsx.utils.sheet_to_json(sheet);
      }

      // Append new product
      const newProduct = req.body;
      newProduct.id = Date.now(); // unique id
      products.push(newProduct);

      // Write back to Excel
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(products);
      xlsx.utils.book_append_sheet(wb, ws, 'Products');
      xlsx.writeFile(wb, filePath);

      res.status(200).json({ message: 'Product saved successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while saving product.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
