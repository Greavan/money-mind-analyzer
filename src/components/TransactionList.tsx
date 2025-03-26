
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  setSelectedCategory: (category: string | null) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, setSelectedCategory }) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))];
  
  useEffect(() => {
    let filtered = transactions;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.date.includes(searchQuery) ||
        t.amount.toString().includes(searchQuery)
      );
    }
    
    // Apply category filter
    if (activeFilter) {
      filtered = filtered.filter(t => t.category === activeFilter);
    }
    
    setFilteredTransactions(filtered);
  }, [searchQuery, activeFilter, transactions]);
  
  const handleCategoryClick = (category: string) => {
    if (activeFilter === category) {
      setActiveFilter(null);
      setSelectedCategory(null);
    } else {
      setActiveFilter(category);
      setSelectedCategory(category);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Function to get category color
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Groceries': 'bg-emerald-100 text-emerald-800',
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-violet-100 text-violet-800',
      'Health': 'bg-red-100 text-red-800',
      'Income': 'bg-green-100 text-green-800',
      'Bills & Utilities': 'bg-slate-100 text-slate-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Health & Fitness': 'bg-indigo-100 text-indigo-800'
    };
    
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transactions</span>
          <span className="text-sm font-normal text-muted-foreground">
            {filteredTransactions.length} of {transactions.length} transactions
          </span>
        </CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  activeFilter === category ? "" : "hover:bg-secondary"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
            {activeFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setActiveFilter(null);
                  setSelectedCategory(null);
                }}
                className="text-xs h-7 px-2"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    <span className="text-xs font-medium">{formatDate(transaction.date)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{transaction.description}</h4>
                    <Badge variant="secondary" className={`mt-1 ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
                <span className={`font-medium text-sm ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No transactions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
