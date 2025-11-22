import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, DataPayload, DataItem } from '../lib/api';

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email salah').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  type: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function DataRecords() {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', address: '', type: '' }
  });

  const listQuery = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const res = await api.getData();
      return res.data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: DataPayload = { ...values, metadata: {} };
      return api.save(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['data'] });
      reset();
    }
  });

  const onSubmit = (values: FormValues) => {
    saveMutation.mutate(values);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Data Records</h1>
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Tambah Data</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama *</label>
            <input className="border rounded px-3 py-2" {...register('name')} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input className="border rounded px-3 py-2" {...register('email')} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Telepon</label>
            <input className="border rounded px-3 py-2" {...register('phone')} />
          </div>
            <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Alamat</label>
            <input className="border rounded px-3 py-2" {...register('address')} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipe</label>
            <input className="border rounded px-3 py-2" {...register('type')} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button disabled={isSubmitting || saveMutation.isLoading} className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50">
              {saveMutation.isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={() => reset()} className="border px-4 py-2 rounded">
              Reset
            </button>
          </div>
        </form>
        {saveMutation.isSuccess && <p className="text-green-600 text-sm">Berhasil disimpan.</p>}
        {saveMutation.isError && <p className="text-red-600 text-sm">Gagal menyimpan.</p>}
      </div>
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Daftar Data</h2>
        {listQuery.isLoading && <p className="text-sm text-muted-foreground">Memuat...</p>}
        {listQuery.isError && <p className="text-sm text-red-600">Gagal memuat data.</p>}
        {!listQuery.isLoading && listQuery.data.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data.</p>}
        <ul className="space-y-3">
          {listQuery.data.map((item: DataItem) => (
            <li key={item._id} className="border rounded p-4 flex flex-col gap-1">
              <span className="font-medium">{item.name}</span>
              {item.type && <span className="text-xs text-muted-foreground">Tipe: {item.type}</span>}
              {item.email && <span className="text-xs text-muted-foreground">Email: {item.email}</span>}
              {item.phone && <span className="text-xs text-muted-foreground">Telp: {item.phone}</span>}
              {item.address && <span className="text-xs text-muted-foreground">Alamat: {item.address}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
