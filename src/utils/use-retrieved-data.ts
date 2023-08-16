import { useLocalStorage } from 'react-use';

export const useRetrievedData = () => {
  const [retrievedJSON] = useLocalStorage('hungryhub-cart');

  try {
    if (retrievedJSON !== null) {
      const retrievedData = JSON.parse(retrievedJSON as string);
      return retrievedData;
    }
  } catch (error) {
    console.error('Error parsing retrieved data:', error);
  }

  return null;
};
