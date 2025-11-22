import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface DataItem {
  _id: string;
  name: string;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const Index = () => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .getData()
      .then((res) => {
        if (!active) return;
        if (res.success) {
          setItems(res.data);
        } else {
            setError('Gagal memuat data');
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Data Klinik Sentosa</h1>
      {loading && <p className="text-muted-foreground">Memuat data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-muted-foreground">Belum ada data tersimpan.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item._id}
            className="rounded border p-4 flex flex-col gap-1 bg-card"
          >
            <span className="font-semibold">{item.name}</span>
            <span className="text-sm text-muted-foreground">Tipe: {item.type || 'other'}</span>
            {item.email && (
              <span className="text-xs text-muted-foreground">Email: {item.email}</span>
            )}
            {item.phone && (
              <span className="text-xs text-muted-foreground">Telp: {item.phone}</span>
            )}
            {item.address && (
              <span className="text-xs text-muted-foreground">Alamat: {item.address}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
