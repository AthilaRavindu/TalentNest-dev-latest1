"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Currency {
  value: string;
  label: string;
  symbol: string;
}

interface CountryData {
  name: { common: string };
  cca2: string;
  idd?: { root: string; suffixes: string[] };
}

interface OnboardingContextType {
  currencies: Currency[];
  countries: CountryData[];
  dialCodes: { [key: string]: string };
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [dialCodes, setDialCodes] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both in parallel for better performance
        const [currenciesRes, countriesRes] = await Promise.all([
          fetch('https://api.frankfurter.app/currencies'),
          fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
        ]);

        // Process currencies
        if (currenciesRes.ok) {
          const currenciesData = await currenciesRes.json();
          const currencyList: Currency[] = Object.keys(currenciesData).map(code => ({
            value: code,
            label: `${code} - ${currenciesData[code]}`,
            symbol: code
          }));
          setCurrencies(currencyList);
        }

        // Process countries
        if (countriesRes.ok) {
          const countriesData: CountryData[] = await countriesRes.json();
          const sortedCountries = countriesData.sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
          );
          setCountries(sortedCountries);

          // Process dial codes
          const codes: { [key: string]: string } = {};
          sortedCountries.forEach(country => {
            const root = country.idd?.root || '+';
            const suffixes = country.idd?.suffixes || [''];
            codes[country.name.common] = root + suffixes[0];
          });
          setDialCodes(codes);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback data
        setCurrencies([
          { value: "USD", label: "USD - US Dollar", symbol: "$" },
          { value: "EUR", label: "EUR - Euro", symbol: "€" },
          { value: "GBP", label: "GBP - British Pound", symbol: "£" },
          { value: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs" },
          { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <OnboardingContext.Provider value={{ currencies, countries, dialCodes, isLoading }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingData() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingData must be used within OnboardingProvider');
  }
  return context;
}