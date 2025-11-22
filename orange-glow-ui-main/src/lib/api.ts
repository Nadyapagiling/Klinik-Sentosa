const API_URL = 'http://localhost:3001/api';

export interface DataPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface DataItem extends DataPayload {
  _id: string;
  createdAt?: string;
}

interface ApiResponse<T> { success: boolean; data?: T; message?: string }

export const api = {
  // Simpan data baru
  async save(data: DataPayload): Promise<ApiResponse<DataItem>> {
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  },

  // Ambil semua data
  async getData(): Promise<ApiResponse<DataItem[]>> {
    try {
      const response = await fetch(`${API_URL}/data`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  // Ambil data by ID
  async getById(id: string): Promise<ApiResponse<DataItem>> {
    try {
      const response = await fetch(`${API_URL}/data/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      throw error;
    }
  },

  // Update data
  async update(id: string, data: Partial<DataPayload>): Promise<ApiResponse<DataItem>> {
    try {
      const response = await fetch(`${API_URL}/data/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  },

  // Hapus data
  async delete(id: string): Promise<ApiResponse<DataItem>> {
    try {
      const response = await fetch(`${API_URL}/data/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },
};