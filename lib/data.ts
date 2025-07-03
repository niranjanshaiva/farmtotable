import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.json');

export const readProducts = async () => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const saveProducts = async (products: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};
