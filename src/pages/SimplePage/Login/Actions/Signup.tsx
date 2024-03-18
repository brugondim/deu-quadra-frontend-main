import React, { FormEvent, useContext, useEffect, useState } from 'react';
import TextInput from '@components/TextInput';
import { useModal } from '@src/hooks/Modal';
import { useApi } from '@src/api/api';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContext } from '../../../../contexts/Auth';
import { LanguageContext } from '../../../../contexts/Language';

export function Signup() {
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const auth = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate('/');
    }
  }, []);

  const { login } = useApi();
  const { openModal } = useModal();
  const { language } = useContext(LanguageContext)!;

  async function fetchAddressFromCEP(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddress(data.logradouro);
        setState(data.uf);
        setCity(data.localidade);
      } else {
        openModal('Erro', 'CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      openModal('Erro', 'Erro ao buscar CEP');
    }
  }

  function handleCEPChange(event) {
    const { value } = event.target;
    setCep(value);

    // Verifica se o CEP tem 8 dígitos para evitar requisições desnecessárias
    if (value.length === 8) {
      fetchAddressFromCEP(value);
    }
  }

  function handleLogin(event: FormEvent) {
    event.preventDefault();

    login(Name, email, password, cpfCnpj, address, cep, state, city, phone)
      .then(({ data }) => {
        auth!.setTokens({
          authToken: {
            token: data.accessToken,
            expiresIn: new Date(),
          },
          refreshToken: {
            expiresIn: new Date(),
            token: 'a',
          },
        });

        navigate('/');
      })
      .catch((error: any) => {
        openModal('Erro', error.response.data.message);
      });
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-3">
      <h2 className="text-2xl font-semibold mb-4 text-center">Cadastre-se</h2>
      <form onSubmit={handleLogin} className="flex flex-wrap">
      <div className="w-full sm:w-1/2 px-2">
          <TextInput
            label="Name"
            type="text"
            id="name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            placeholder={language.nameButtonPlaceholder}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2">
          <TextInput
            label="CPF/CNPJ"
            type="text"
            id="cpfCnpj"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            placeholder="Informe o CPF ou CNPJ"
          />
        </div>
        <div className="w-full sm:w-1/4 px-2">
          <TextInput
            label="Telefone"
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Informe o telefone"
          />
        </div>
        <div className="w-full sm:w-1/2 px-2">
          <TextInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={language.emailButtonPlaceholder}
          />
        </div>
        <div className="w-full sm:w-1/5 px-2">
          <TextInput
            label={language.passwordLabel}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language.passwordButtonPlaceholder}
          />
           </div>

        <div className="w-full sm:w-1/4 px-2">
          <TextInput
            label="CEP"
            type="text"
            id="cep"
            value={cep}
            onChange={handleCEPChange}
            placeholder="Informe o CEP"
          />
        </div>
        <div className="w-full sm:w-1/3 px-2">
          <TextInput
            label="Endereço"
            type="text"
            id="Adress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Informe o nome da Rua"
          />
        </div>
        <div className="w-full sm:w-1/6 px-2">
          <TextInput
            label="Estado"
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Informe o estado"
          />
        </div>
        <div className="w-full sm:w-1/3 px-2">
          <TextInput
            label="Cidade"
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Informe a cidade"
          />
        </div>
        
        <div className="flex w-full justify-between px-2 mt-3">
          <button
            type="button"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-blue-600"
            onClick={() => navigate('/')}
          >
            Voltar
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {language.LoginPageButton}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
