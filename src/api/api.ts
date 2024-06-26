import axios, { AxiosResponse } from 'axios';
import { useAuth } from '../hooks/Auth';
import { GetCourtsOutput, LoginOutput, GetEmpresasOutput } from './endpointsOutput';

export interface AuthResult {
  login: (email: string, password: string)=> Promise<AxiosResponse<LoginOutput, any>>;
  getCourts: (lat:number,lon: number, distanceInKillometers: number)=> Promise<AxiosResponse<GetCourtsOutput[], any>>;
  getEmpresas: (nome:string, idEmpresa: number, rua: string, bairro: string,numero: string)=> Promise<AxiosResponse<GetEmpresasOutput[], any>>;
}

export function useApi(): AuthResult {
  const { tokens } = useAuth();

  const client = axios.create({
    headers: { Authorization: `Bearer ${tokens?.authToken.token}` },
    baseURL: import.meta.env.VITE_API_URL,
  });

  async function login(email: string, password: string): Promise<AxiosResponse<LoginOutput, any>> {
    return client.post<LoginOutput>('/users/login', {
      email,
      password,
    });
  }

  async function getEmpresas(nome: string, idEmpresa: number, rua: string, bairro: string,numero: string): Promise<AxiosResponse<GetEmpresasOutput[], any>> {
    return client.get<GetEmpresasOutput>('/empresas/', {
      nome, idEmpresa, rua, bairro,numero,
    });
  }

  async function getCourts(lat:number,lon: number, distanceInKillometers: number): Promise<AxiosResponse<GetCourtsOutput[], any>> {
    return client.post<GetCourtsOutput[]>('/courts/search',{
        coordinates: {
          lat,lon
      },
      properties: {
          distanceInKillometers
      }
    })
  }
  return { login, getCourts, getEmpresas };
}
