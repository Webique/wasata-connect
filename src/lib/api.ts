import { API_BASE_URL } from '@/config';

export interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Ensure baseURL doesn't end with /
    const normalizedBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const url = `${normalizedBaseURL}${normalizedEndpoint}`;

    console.log('API Request:', url, options.method || 'GET'); // Debug log

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Clear token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        // Dispatch custom event to notify auth context
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }

      const error: ApiError = await response.json().catch(() => ({
        error: `Request failed with status ${response.status}`,
      }));
      console.error('API Error:', url, response.status, error); // Debug log
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async registerUser(data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    disabilityType: string;
    location: string;
    cvUrl: string;
  }) {
    return this.request<{ token: string; user: any }>('/api/auth/register-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerCompany(data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    crNumber: string;
    crDocUrl: string;
    mapsUrl: string;
    mowaamaDocUrl?: string;
    location: string;
  }) {
    return this.request<{ token: string; user: any; company: any }>(
      '/api/auth/register-company',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async login(phone?: string, email?: string, password?: string) {
    return this.request<{ token: string; user: any; company?: any }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ phone, email, password }),
      }
    );
  }

  async getMe() {
    return this.request<{ user: any; company?: any }>('/api/auth/me');
  }

  // Jobs
  async getJobs(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<any[]>(`/api/jobs${query}`);
  }

  async getJob(id: string) {
    return this.request<any>(`/api/jobs/${id}`);
  }

  // User
  async updateProfile(data: {
    name?: string;
    phone?: string;
    email?: string;
    disabilityType?: string;
    cvUrl?: string;
  }) {
    return this.request<{ user: any }>('/api/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getMyApplications() {
    return this.request<any[]>('/api/me/applications');
  }

  async createApplication(data: { jobId: string }) {
    return this.request<any>('/api/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Company
  async getCompanyProfile() {
    return this.request<any>('/api/company/me');
  }

  async getCompanyJobs() {
    return this.request<any[]>('/api/company/me/jobs');
  }

  async createJob(data: {
    title: string;
    workingHours: string;
    qualification: string;
    skills: string[];
    minSalary: number;
    healthInsurance: boolean;
    disabilityTypes: string[];
  }) {
    return this.request<any>('/api/company/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any) {
    return this.request<any>(`/api/company/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request<{ message: string }>(`/api/company/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getJobApplicants(jobId: string) {
    return this.request<any[]>(`/api/company/jobs/${jobId}/applicants`);
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return this.request<any>(`/api/company/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Admin
  async getCompanies(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<any[]>(`/api/admin/companies${query}`);
  }

  async approveCompany(id: string) {
    return this.request<any>(`/api/admin/companies/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectCompany(id: string) {
    return this.request<any>(`/api/admin/companies/${id}/reject`, {
      method: 'PUT',
    });
  }

  async getUsers(search?: string, role?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/api/admin/users${query}`);
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminJobs(companyId?: string, status?: string, approvalStatus?: string) {
    const params = new URLSearchParams();
    if (companyId) params.append('companyId', companyId);
    if (status) params.append('status', status);
    if (approvalStatus) params.append('approvalStatus', approvalStatus);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/api/admin/jobs${query}`);
  }

  async approveJob(id: string) {
    return this.request<any>(`/api/admin/jobs/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectJob(id: string, rejectionReason: string) {
    return this.request<any>(`/api/admin/jobs/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ rejectionReason }),
    });
  }

  async deleteJobAdmin(id: string) {
    return this.request<{ message: string }>(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminApplications() {
    return this.request<any[]>('/api/admin/applications');
  }

  // Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/api/uploads`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);

