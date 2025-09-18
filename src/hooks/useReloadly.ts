import { useState, useEffect } from 'react';
import { ReloadlyService, ReloadlyOperator } from '../services/reloadly';

export const useReloadly = () => {
  const [operators, setOperators] = useState<ReloadlyOperator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadlyService = ReloadlyService.getInstance();

  const loadOperators = async (countryCode: string = 'US') => {
    try {
      setIsLoading(true);
      setError(null);
      const operatorList = await reloadlyService.getOperators(countryCode);
      setOperators(operatorList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load operators';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getOperator = async (operatorId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      return await reloadlyService.getOperatorById(operatorId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get operator';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  return {
    operators,
    isLoading,
    error,
    loadOperators,
    getOperator
  };
};