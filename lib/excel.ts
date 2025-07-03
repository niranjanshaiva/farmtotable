import fs from 'fs';
import * as XLSX from 'xlsx';

export const readSheet = (file: string) => {
  const path = `./data/${file}.xlsx`;
  if (!fs.existsSync(path)) return [];
  const wb = XLSX.readFile(path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws);
};

export const writeSheet = (file: string, data: any[]) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `./data/${file}.xlsx`);
};
