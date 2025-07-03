// pages/api/products/upload.js

import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import xlsx from 'xlsx';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Form parsing error' });
    }

    const { name, price, quantity, email } = fields;
    const file = files.image;

    if (!name || !price || !quantity || !email || !file) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const fileName = path.basename(file[0].filepath);
    const newProduct = {
      id: Date.now(),
      name: name[0],
      price: parseFloat(price[0]),
      quantity: parseInt(quantity[0]),
      email: email[0],
      image: fileName,
    };

    try {
      const excelPath = path.join(process.cwd(), 'data', 'products.xlsx');
      let data = [];

      // If file exists, read data
      if (fs.existsSync(excelPath)) {
        const workbook = xlsx.readFile(excelPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = xlsx.utils.sheet_to_json(sheet);
      }

      // Add new product
      data.push(newProduct);

      // Write to Excel
      const newWorkbook = xlsx.utils.book_new();
      const newSheet = xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Products');
      xlsx.writeFile(newWorkbook, excelPath);

      return res.status(200).json({ message: '✅ Upload successful' });
    } catch (e) {
      console.error('Error writing to Excel:', e);
      return res.status(500).json({ message: 'Failed to write to Excel' });
    }
  });
}
