import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.xlsx');

    if (!fs.existsSync(filePath)) {
      return res.status(200).json([]);
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
}
