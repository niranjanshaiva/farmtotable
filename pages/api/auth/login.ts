import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, role } = req.body;

    const filePath = path.join(process.cwd(), 'data', 'users.xlsx');
    const file = fs.readFileSync(filePath);
    const workbook = xlsx.read(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);

    const user = users.find(
      (u: any) => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } else {
    res.status(405).end();
  }
}
