import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'products.xlsx');
  if (!fs.existsSync(filePath)) return res.status(200).json([]);

  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const products = xlsx.utils.sheet_to_json(worksheet);
  res.status(200).json(products);
}
