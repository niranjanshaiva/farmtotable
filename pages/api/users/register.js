import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const filePath = path.join(process.cwd(), 'data', 'users.xlsx');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { name, email, password, type } = req.body;

  if (!name || !email || !password || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let workbook;
    let sheet;

    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      workbook = XLSX.read(buffer, { type: 'buffer' });
      sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } else {
      sheet = [];
      workbook = XLSX.utils.book_new();
    }

    // Check if user already exists
    const existingUser = sheet.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const id = sheet.length + 1;
    const newUser = { id, name, email, password, type };

    sheet.push(newUser);
    const newSheet = XLSX.utils.json_to_sheet(sheet);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Users');
    XLSX.writeFile(newWorkbook, filePath);

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error while registering user' });
  }
}
