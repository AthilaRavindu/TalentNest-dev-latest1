"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X, Loader2 } from "lucide-react";

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string; // Country code like "US", "GB", "LK"
  flag: string;
}

interface CountrySelectorProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export default function CountrySelector({
  label,
  helperText,
  value,
  onChange,
  placeholder = "Select country...",
  disabled = false,
  error,
  required = false,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setErrorLoading(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data: Country[] = await response.json();
        
        // Sort countries alphabetically by common name
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setErrorLoading('Failed to load countries. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Get flag image URL from country code
  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.name.official.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.cca2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountry = countries.find(country => country.name.common === value);

  const handleSelect = (countryName: string) => {
    onChange(countryName);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const inputClasses = `
    h-[52px] w-full rounded-xl border border-gray-300 bg-white 
    shadow-sm outline-none transition-all cursor-pointer 
    flex items-center justify-between px-4
    ${disabled 
      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
      : 'hover:border-teal-500 focus:border-teal-500'
    }
    ${error ? 'border-red-500 hover:border-red-600 focus:border-red-600' : ''}
    ${isOpen ? 'ring-2 ring-teal-500/20 border-teal-500' : 'hover:ring-1 hover:ring-teal-500/30'}
  `;

  return (
    <div className="flex flex-col gap-1 w-full" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          className={inputClasses}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center gap-3 flex-1">
            {selectedCountry ? (
              <>
                <img 
                  src={getFlagUrl(selectedCountry.cca2)} 
                  alt={`${selectedCountry.name.common} flag`}
                  className="w-10 h-6 object-cover rounded-sm"
                />
                <span className="text-gray-900">{selectedCountry.name.common}</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            {loading ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
            )}
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                          rounded-xl shadow-xl z-50 max-h-80 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Search Header */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="overflow-y-auto max-h-60">
              {errorLoading ? (
                <div className="p-4 text-center text-red-600 text-sm">
                  {errorLoading}
                </div>
              ) : loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading countries...
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.cca2}
                    onClick={() => handleSelect(country.name.common)}
                    className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors
                              flex items-center gap-3 border-b border-gray-100 last:border-b-0
                              ${value === country.name.common ? 'bg-teal-50 border-teal-200' : ''}`}
                  >
                    <img 
                      src={getFlagUrl(country.cca2)} 
                      alt={`${country.name.common} flag`}
                      className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 text-sm">
                        {country.name.common}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                {filteredCountries.length} countries found
              </div>
            </div>
          </div>
        )}
      </div>

      {(helperText || error) && (
        <span className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}