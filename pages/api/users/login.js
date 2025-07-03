import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const workbookPath = path.join(process.cwd(), 'data', 'users.xlsx');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Load workbook
    const workbook = XLSX.readFile(workbookPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(sheet);

    // Match user by email, password and type
    const user = users.find(u =>
      u.email?.toString().trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password?.toString() === password &&
      u.type?.toLowerCase() === type.toLowerCase()
    );

    if (user) {
      return res.status(200).json({ success: true, user });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
