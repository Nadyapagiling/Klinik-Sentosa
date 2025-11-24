import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3001/api';

// Types
export interface Patient {
  _id?: string;
  id?: string;
  name: string;
  nik: string;
  dob: string;
  gender: string;
  address: string;
  contact: string;
  allergy?: string;
  medicalHistory?: string;
  type: string;
}

export interface Visit {
  _id?: string;
  id?: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  queueNo: string;
  status: string;
  complaint: string;
  diagnosis?: string;
  notes?: string;
  type: string;
}

export interface Drug {
  _id?: string;
  id?: string;
  name: string;
  stock: number;
  unitPrice: number;
  expiryDate: string;
  type: string;
}

export interface Prescription {
  _id?: string;
  id?: string;
  visitId: string;
  date: string;
  status: string;
  items: Array<{
    drugId: string;
    dose: string;
    quantity: number;
    instruction: string;
  }>;
  type: string;
}

export interface Transaction {
  _id?: string;
  id?: string;
  visitId: string;
  amount: number;
  paymentMethod: string;
  timestamp: string;
  cashier: string;
  type: string;
}

export interface Complaint {
  _id?: string;
  id?: string;
  patientId: string;
  patientName: string;
  content: string;
  status: string;
  response?: string;
  date: string;
  type: string;
}

// API Helper
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  const data = await response.json();
  return data;
}

// Hooks for Patients
export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const patients = res.data?.filter((item: any) => item.type === 'patient') || [];
      return patients.map((p: any) => ({
        id: p._id,
        _id: p._id,
        name: p.name,
        nik: p.metadata?.nik || '',
        dob: p.metadata?.dob || '',
        gender: p.metadata?.gender || '',
        address: p.address || '',
        contact: p.phone || p.contact || '',
        allergy: p.metadata?.allergy || '',
        medicalHistory: p.metadata?.medicalHistory || '',
        type: 'patient'
      }));
    },
  });
}

export function useAddPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patient: Omit<Patient, '_id' | 'id'>) => {
      const payload = {
        name: patient.name,
        email: '',
        phone: patient.contact,
        address: patient.address,
        type: 'patient',
        metadata: {
          nik: patient.nik,
          dob: patient.dob,
          gender: patient.gender,
          allergy: patient.allergy || '',
          medicalHistory: patient.medicalHistory || ''
        }
      };
      return fetchAPI('/save', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patient }: Patient) => {
      return fetchAPI(`/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...patient, type: 'patient' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchAPI(`/data/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

// Hooks for Visits
export function useVisits() {
  return useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const visits = res.data?.filter((item: Visit) => item.type === 'visit') || [];
      return visits.map((v: Visit) => ({ ...v, id: v._id }));
    },
  });
}

export function useAddVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (visit: Omit<Visit, '_id' | 'id'>) => {
      return fetchAPI('/save', {
        method: 'POST',
        body: JSON.stringify({ ...visit, type: 'visit' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...visit }: Visit) => {
      return fetchAPI(`/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...visit, type: 'visit' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}

// Hooks for Drugs
export function useDrugs() {
  return useQuery({
    queryKey: ['drugs'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const drugs = res.data?.filter((item: Drug) => item.type === 'drug') || [];
      return drugs.map((d: Drug) => ({ ...d, id: d._id }));
    },
  });
}

export function useAddDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (drug: Omit<Drug, '_id' | 'id'>) => {
      return fetchAPI('/save', {
        method: 'POST',
        body: JSON.stringify({ ...drug, type: 'drug' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
}

export function useUpdateDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...drug }: Drug) => {
      return fetchAPI(`/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...drug, type: 'drug' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
}

export function useDeleteDrug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchAPI(`/data/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });
}

// Hooks for Prescriptions
export function usePrescriptions() {
  return useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const prescriptions = res.data?.filter((item: Prescription) => item.type === 'prescription') || [];
      return prescriptions.map((p: Prescription) => ({ ...p, id: p._id }));
    },
  });
}

export function useAddPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prescription: Omit<Prescription, '_id' | 'id'>) => {
      return fetchAPI('/save', {
        method: 'POST',
        body: JSON.stringify({ ...prescription, type: 'prescription' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...prescription }: Prescription) => {
      return fetchAPI(`/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...prescription, type: 'prescription' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    },
  });
}

// Hooks for Transactions
export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const transactions = res.data?.filter((item: Transaction) => item.type === 'transaction') || [];
      return transactions.map((t: Transaction) => ({ ...t, id: t._id }));
    },
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transaction: Omit<Transaction, '_id' | 'id'>) => {
      return fetchAPI('/save', {
        method: 'POST',
        body: JSON.stringify({ ...transaction, type: 'transaction' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

// Hooks for Complaints
export function useComplaints() {
  return useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await fetchAPI('/data');
      const complaints = res.data?.filter((item: Complaint) => item.type === 'complaint') || [];
      return complaints.map((c: Complaint) => ({ ...c, id: c._id }));
    },
  });
}

export function useUpdateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...complaint }: Complaint) => {
      return fetchAPI(`/data/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...complaint, type: 'complaint' }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}
