import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'orders.xlsx');
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ totalCommission: 0 });
    }

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const orders = xlsx.utils.sheet_to_json(sheet);

    // Sum all commissions (parseFloat to avoid string issues)
    const totalCommission = orders.reduce(
      (sum, order) => sum + (parseFloat(order.commission) || 0),
      0
    );

    res.status(200).json({ totalCommission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read orders' });
  }
}
