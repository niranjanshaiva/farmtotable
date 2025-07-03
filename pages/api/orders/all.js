import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'orders.xlsx');
      let orders = [];

      if (fs.existsSync(filePath)) {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        orders = xlsx.utils.sheet_to_json(sheet);
      }

      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load orders' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
