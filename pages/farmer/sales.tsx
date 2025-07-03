import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'data', 'orders.xlsx');
  let orders = [];

  if (fs.existsSync(filePath)) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    orders = xlsx.utils.sheet_to_json(sheet);
  }

  const summary = {};

  orders.forEach((order: any) => {
    const key = order.productName;
    if (!summary[key]) {
      summary[key] = {
        totalQty: 0,
        totalEarnings: 0
      };
    }
    summary[key].totalQty += parseInt(order.quantity);
    summary[key].totalEarnings += parseFloat(order.quantity) * parseFloat(order.total) / parseFloat(order.quantity);
  });

  return {
    props: {
      summary
    }
  };
}

export default function SalesPage({ summary }) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 My Sales & Income</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Total Earnings (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([name, data]: any, i) => (
            <tr key={i}>
              <td>{name}</td>
              <td>{data.totalQty}</td>
              <td>₹{data.totalEarnings.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
