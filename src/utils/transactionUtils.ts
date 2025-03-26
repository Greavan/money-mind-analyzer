
// This would be a real ML-powered categorization in a production app
// For demo purposes, we're using a simple rule-based approach

// Predefined categories
export const categories = [
  'Groceries',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Health',
  'Income',
  'Bills & Utilities',
  'Entertainment',
  'Health & Fitness'
];

// Simple keyword-based categorization
export const categorizeTransaction = (description: string, amount: number): string => {
  description = description.toLowerCase();
  
  // Income is usually a positive amount
  if (amount > 0) {
    if (description.includes('salary') || description.includes('payroll') || description.includes('deposit')) {
      return 'Income';
    }
    return 'Income';
  }
  
  // Expense categories based on keywords
  if (description.includes('grocery') || description.includes('market') || description.includes('supermarket')) {
    return 'Groceries';
  }
  
  if (description.includes('restaurant') || description.includes('cafe') || description.includes('coffee') || 
      description.includes('food') || description.includes('pizza') || description.includes('burger')) {
    return 'Food & Dining';
  }
  
  if (description.includes('gas') || description.includes('uber') || description.includes('lyft') || 
      description.includes('train') || description.includes('transit') || description.includes('parking')) {
    return 'Transportation';
  }
  
  if (description.includes('amazon') || description.includes('walmart') || description.includes('target') || 
      description.includes('shop') || description.includes('store')) {
    return 'Shopping';
  }
  
  if (description.includes('doctor') || description.includes('pharmacy') || description.includes('medical') || 
      description.includes('hospital') || description.includes('health')) {
    return 'Health';
  }
  
  if (description.includes('gym') || description.includes('fitness') || description.includes('workout')) {
    return 'Health & Fitness';
  }
  
  if (description.includes('netflix') || description.includes('spotify') || description.includes('cinema') || 
      description.includes('movie') || description.includes('entertainment')) {
    return 'Entertainment';
  }
  
  if (description.includes('electric') || description.includes('water') || description.includes('gas bill') || 
      description.includes('internet') || description.includes('phone') || description.includes('utility')) {
    return 'Bills & Utilities';
  }
  
  // Default category if no match found
  return 'Shopping';
};

// Process transactions from raw data
export const processTransactions = (rawData: any[]): any[] => {
  return rawData.map(transaction => {
    // In a real app, this would call an ML model
    const category = categorizeTransaction(transaction.description, transaction.amount);
    return {
      ...transaction,
      category
    };
  });
};

// Simulate ML model loading
export const loadMLModel = async (): Promise<boolean> => {
  // This would be real model loading in a production app
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};
