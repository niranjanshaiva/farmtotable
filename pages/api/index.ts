import { NextApiRequest, NextApiResponse } from 'next';
import { read, utils } from 'xlsx';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = fs.readFileSync('data/orders.xlsx');
  const workbook = read(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(sheet);

  res.status(200).json(data);
}
