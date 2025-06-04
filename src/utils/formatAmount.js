/**
 * Formats a number into a currency string with commas and 2 decimal places
 * Now handles both display formatting and real-time input formatting
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted amount string
 */
export const formatAmount = (amount) => {
    // Handle empty or null/undefined inputs
    if (amount === '' || amount === null || amount === undefined) {
      return '';
    }
    
    // If it's a string that looks like user input (for real-time formatting)
    if (typeof amount === 'string') {
      // Remove all non-digit and non-decimal characters
      let cleanValue = amount.replace(/[^\d.]/g, '');
      
      // Handle multiple decimal points - keep only the first one
      const decimalIndex = cleanValue.indexOf('.');
      if (decimalIndex !== -1) {
        cleanValue = cleanValue.substring(0, decimalIndex + 1) + 
                     cleanValue.substring(decimalIndex + 1).replace(/\./g, '');
      }
      
      // Handle empty input or just decimal point
      if (cleanValue === '' || cleanValue === '.') {
        return cleanValue;
      }
      
      // Split into integer and decimal parts
      const parts = cleanValue.split('.');
      let integerPart = parts[0];
      let decimalPart = parts[1] || '';
      
      // Add commas to integer part if it exists
      if (integerPart && integerPart !== '0') {
        integerPart = parseInt(integerPart).toLocaleString('en-US');
      } else if (integerPart === '0') {
        integerPart = '0';
      }
      
      // Limit decimal places to 2
      if (decimalPart.length > 2) {
        decimalPart = decimalPart.substring(0, 2);
      }
      
      // Combine parts
      if (cleanValue.includes('.')) {
        return integerPart + '.' + decimalPart;
      }
      
      return integerPart;
    }
    
    // For actual numbers (display formatting)
    const num = Number(amount);
    
    if (isNaN(num)) return '0.00';
    
    // Format with commas and 2 decimal places
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  /**
   * Converts a formatted amount string back to a raw number
   * @param {string} formattedAmount - The formatted amount string (e.g., "1,234.56")
   * @returns {number} Raw number
   */
  export const unformatAmount = (formattedAmount) => {
    if (!formattedAmount || formattedAmount === '') return 0;
    
    // Handle case where user is still typing (e.g., "1,234.")
    if (formattedAmount.endsWith('.')) {
      const cleanValue = formattedAmount.replace(/,/g, '').slice(0, -1);
      return cleanValue === '' ? 0 : Number(cleanValue);
    }
    
    // Remove commas and convert to number
    const cleanValue = formattedAmount.replace(/,/g, '');
    return cleanValue === '' ? 0 : Number(cleanValue);
  };