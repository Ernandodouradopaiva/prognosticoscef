const API_BASE_URL = 'http://localhost:3001/api';

class PostgresClient {
  constructor() {
    this.token = localStorage.getItem('postgres_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('postgres_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('postgres_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Autenticação
  async signUp(email, password, nome) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, nome }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async signIn(email, password) {
    const data = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  signOut() {
    this.clearToken();
  }

  // Concursos
  async getConcursos() {
    return await this.request('/concursos');
  }

  async createConcurso(concursoData) {
    return await this.request('/concursos', {
      method: 'POST',
      body: JSON.stringify(concursoData),
    });
  }

  async updateConcurso(id, concursoData) {
    return await this.request(`/concursos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(concursoData),
    });
  }

  async deleteConcurso(id) {
    return await this.request(`/concursos/${id}`, {
      method: 'DELETE',
    });
  }

  // Prognósticos
  async getPrognosticos(tipo) {
    return await this.request(`/prognosticos/${tipo}`);
  }

  async getProgGeral() {
    return await this.request('/prog-geral');
  }

  async createPrognosticoGeral(prognosticoData) {
    return await this.request('/prog-geral', {
      method: 'POST',
      body: JSON.stringify(prognosticoData),
    });
  }

  // Usuários (apenas admin)
  async getUsers() {
    return await this.request('/users');
  }

  async updateUserStatus(id, role) {
    return await this.request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export const postgresClient = new PostgresClient(); 