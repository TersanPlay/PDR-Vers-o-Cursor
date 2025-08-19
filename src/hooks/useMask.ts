import { useState, useCallback } from 'react';

/**
 * Tipos de máscaras disponíveis
 */
export type MaskType = 'cep' | 'phone' | 'cpf' | 'cnpj';

/**
 * Configurações de máscaras
 */
const MASK_CONFIGS = {
  cep: {
    pattern: /^(\d{0,5})-?(\d{0,3})$/,
    format: (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 5) {
        return numbers;
      }
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    },
    maxLength: 9,
    placeholder: '00000-000'
  },
  phone: {
    pattern: /^\(?([0-9]{0,2})\)?[-. ]?([0-9]{0,5})[-. ]?([0-9]{0,4})$/,
    format: (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) {
        return numbers;
      }
      if (numbers.length <= 7) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      }
      if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      }
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    },
    maxLength: 15,
    placeholder: '(00) 00000-0000'
  },
  cpf: {
    pattern: /^([0-9]{0,3})\.?([0-9]{0,3})\.?([0-9]{0,3})-?([0-9]{0,2})$/,
    format: (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 3) {
        return numbers;
      }
      if (numbers.length <= 6) {
        return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
      }
      if (numbers.length <= 9) {
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
      }
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    },
    maxLength: 14,
    placeholder: '000.000.000-00'
  },
  cnpj: {
    pattern: /^([0-9]{0,2})\.?([0-9]{0,3})\.?([0-9]{0,3})\/?([0-9]{0,4})-?([0-9]{0,2})$/,
    format: (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) {
        return numbers;
      }
      if (numbers.length <= 5) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      }
      if (numbers.length <= 8) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
      }
      if (numbers.length <= 12) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
      }
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    },
    maxLength: 18,
    placeholder: '00.000.000/0000-00'
  }
};

/**
 * Hook para aplicar máscaras em inputs
 * @param maskType Tipo de máscara a ser aplicada
 * @param initialValue Valor inicial (opcional)
 * @returns Objeto com valor formatado, handlers e configurações
 */
export function useMask(maskType: MaskType, initialValue: string = '') {
  const config = MASK_CONFIGS[maskType];
  const [value, setValue] = useState(() => config.format(initialValue));

  /**
   * Handler para mudança de valor com aplicação de máscara
   */
  const handleChange = useCallback((newValue: string) => {
    const formattedValue = config.format(newValue);
    setValue(formattedValue);
  }, [config]);

  /**
   * Handler para eventos de input
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  }, [handleChange]);

  /**
   * Obtém o valor sem formatação (apenas números)
   */
  const getRawValue = useCallback(() => {
    return value.replace(/\D/g, '');
  }, [value]);

  /**
   * Define um novo valor (com formatação automática)
   */
  const setFormattedValue = useCallback((newValue: string) => {
    setValue(config.format(newValue));
  }, [config]);

  /**
   * Limpa o valor
   */
  const clear = useCallback(() => {
    setValue('');
  }, []);

  return {
    value,
    handleChange,
    handleInputChange,
    getRawValue,
    setFormattedValue,
    clear,
    maxLength: config.maxLength,
    placeholder: config.placeholder
  };
}

/**
 * Hook específico para CEP com busca automática de endereço
 * @param onAddressFound Callback chamado quando endereço é encontrado
 * @param initialValue Valor inicial do CEP
 * @returns Objeto com funcionalidades de CEP e busca de endereço
 */
export function useCEPMask(
  onAddressFound?: (address: any) => void,
  initialValue: string = ''
) {
  const mask = useMask('cep', initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca endereço por CEP
   */
  const searchAddress = useCallback(async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { cepService } = await import('../services/cepService');
      const address = await cepService.getAddressByCEP(cleanCEP);
      
      if (address && onAddressFound) {
        onAddressFound(address);
      }
    } catch (err) {
      setError('CEP não encontrado ou inválido');
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onAddressFound]);

  /**
   * Handler personalizado que inclui busca automática
   */
  const handleCEPChange = useCallback((newValue: string) => {
    mask.handleChange(newValue);
    
    // Buscar endereço automaticamente após um delay
    const timeoutId = setTimeout(() => {
      searchAddress(newValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mask.handleChange, searchAddress]);

  /**
   * Handler para eventos de input com busca automática
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleCEPChange(event.target.value);
  }, [handleCEPChange]);

  return {
    ...mask,
    handleChange: handleCEPChange,
    handleInputChange,
    searchAddress,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}