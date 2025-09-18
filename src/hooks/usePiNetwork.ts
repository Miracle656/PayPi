import { useState, useEffect } from 'react';
import { PiNetworkService, PiUser } from '../services/piNetwork';

export const usePiNetwork = () => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const piService = PiNetworkService.getInstance();

  useEffect(() => {
    initializePi();
  }, []);

  const initializePi = async () => {
    try {
      setIsLoading(true);
      await piService.initialize();
      setIsInitialized(true);
      
      // Check if user is already authenticated
      const existingUser = piService.getUser();
      if (existingUser) {
        setUser(existingUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize Pi Network');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const authenticatedUser = await piService.authenticate();
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    piService.logout();
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    isInitialized,
    error,
    authenticate,
    logout
  };
};