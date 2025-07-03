// pages/api/products/update.ts

import formidable, { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import path from 'path';
import { readProducts, saveProducts } from '../../../lib/data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    multiples: false,
  });

  await new Promise<void>((resolve, reject) => {
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error(err);
        reject(err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const { id, name, price, quantity } = fields;
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const image = file ? path.basename(file.filepath || file.path) : null;

      let products = await readProducts();

      products = products.map(p => {
        if (p.id === id) {
          return {
            ...p,
            name,
            price: parseInt(price as string),
            quantity: parseInt(quantity as string),
            image: image || p.image,
          };
        }
        return p;
      });

      await saveProducts(products);
      res.status(200).json({ message: '✅ Product updated' });
      resolve();
    });
  });
}
