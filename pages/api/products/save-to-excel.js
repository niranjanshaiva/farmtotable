import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.xlsx');

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, price, quantity, email } = req.body;

      if (!name || !price || !quantity || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let workbook, sheet;
      if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
        sheet = XLSX.utils.sheet_to_json(workbook.Sheets['Products']);
      } else {
        sheet = [];
      }

      const newEntry = {
        id: Date.now(),
        name,
        price,
        quantity,
        email,
        timestamp: new Date().toLocaleString()
      };

      sheet.push(newEntry);

      const newSheet = XLSX.utils.json_to_sheet(sheet);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Products');
      XLSX.writeFile(newWorkbook, filePath);

      return res.status(200).json({ message: 'Product saved to Excel' });
    } catch (err) {
      console.error('Error saving product:', err);
      return res.status(500).json({ message: 'Error saving product' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
