import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import { readProducts, saveProducts } from '../../../lib/data';

const upload = multer({ dest: 'public/uploads/' });
const handler = nextConnect();

handler.use(upload.single('image'));

handler.post(async (req: any, res) => {
  const { id, name, price, quantity } = req.body;
  const image = req.file?.filename;

  let products = await readProducts();
  products = products.map(p => {
    if (p.id === id) {
      return {
        ...p,
        name,
        price: parseInt(price),
        quantity: parseInt(quantity),
        image: image || p.image
      };
    }
    return p;
  });

  await saveProducts(products);
  res.status(200).json({ message: '✅ Product updated' });
});

export const config = { api: { bodyParser: false } };
export default handler;
