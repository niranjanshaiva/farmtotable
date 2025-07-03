import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { buyer, items, total, commission, paid, paymentId } = req.body;

      const filePath = path.join(process.cwd(), 'orders.xlsx');
      let workbook, worksheet, data = [];

      // Read existing data if file exists
      try {
        const fileBuffer = await fs.readFile(filePath);
        workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(worksheet);
      } catch (err) {
        workbook = XLSX.utils.book_new();
      }

      // Assign order ID
      const id = data.length + 1;

      // Append new order
      const newOrder = {
        ID: id,
        Buyer: buyer,
        Items: items.map(item => `${item.name} x${item.selectedQty}`).join(', '),
        Total: total,
        Commission: commission,
        Paid: paid,
        PaymentID: paymentId,
        Date: new Date().toLocaleString()
      };

      data.push(newOrder);

      const newSheet = XLSX.utils.json_to_sheet(data);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Orders');
      const buffer = XLSX.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
      await fs.writeFile(filePath, buffer);

      res.status(200).json({ message: 'Order saved successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to save order' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
