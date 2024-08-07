export const currencySymbol = (currency: string): string => {
    switch (currency) {
      case 'TRY':
        return '₺';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return currency;
    }
  };
  