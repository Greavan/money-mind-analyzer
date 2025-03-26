
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface InsightProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [topSpendingCategory, setTopSpendingCategory] = useState<string>('');
  const [savingsOpportunity, setSavingsOpportunity] = useState<number>(0);
  
  useEffect(() => {
    if (transactions.length === 0) return;
    
    // Generate insights based on transaction data
    const newInsights: string[] = [];
    
    // Filter out income transactions (positive amounts)
    const expenses = transactions.filter(t => t.amount < 0);
    
    // Group expenses by category
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + Math.abs(transaction.amount));
    });
    
    // Find top spending category
    let maxSpending = 0;
    let topCategory = '';
    
    categoryMap.forEach((amount, category) => {
      if (amount > maxSpending) {
        maxSpending = amount;
        topCategory = category;
      }
    });
    
    setTopSpendingCategory(topCategory);
    
    // Calculate total spending
    const totalSpending = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    
    // Generate insights
    if (topCategory) {
      newInsights.push(`Your highest spending category is ${topCategory}, accounting for ${((maxSpending / totalSpending) * 100).toFixed(1)}% of your expenses.`);
    }
    
    // Check for frequent small transactions in Food & Dining
    const foodTransactions = expenses.filter(t => t.category === 'Food & Dining');
    const smallFoodTransactions = foodTransactions.filter(t => Math.abs(t.amount) < 15);
    
    if (smallFoodTransactions.length >= 2) {
      const potentialSavings = Math.abs(smallFoodTransactions.reduce((sum, t) => sum + t.amount, 0));
      setSavingsOpportunity(potentialSavings);
      newInsights.push(`You spent ${formatCurrency(potentialSavings)} on small food purchases. Consider preparing meals at home to save money.`);
    }
    
    // Check for recurring subscription costs
    const entertainmentCosts = expenses.filter(t => t.category === 'Entertainment');
    if (entertainmentCosts.length > 0) {
      const entertainmentTotal = Math.abs(entertainmentCosts.reduce((sum, t) => sum + t.amount, 0));
      newInsights.push(`Your entertainment subscriptions cost ${formatCurrency(entertainmentTotal)}. Review if you're using all services regularly.`);
    }
    
    // Check balance between income and expenses
    const income = transactions.filter(t => t.amount > 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    const savingsRate = (totalIncome - totalSpending) / totalIncome;
    
    if (savingsRate < 0.2) {
      newInsights.push(`Your current savings rate is ${(savingsRate * 100).toFixed(1)}%. Aim for at least 20% to build financial security.`);
    } else {
      newInsights.push(`Great job! Your savings rate is ${(savingsRate * 100).toFixed(1)}%, which is above the recommended 20%.`);
    }
    
    // Add general financial advice
    newInsights.push("Consider setting up automatic transfers to a savings account on payday to build your emergency fund.");
    
    setInsights(newInsights);
  }, [transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-primary" />
          Financial Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {topSpendingCategory && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                    Top Spending
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">{topSpendingCategory}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This is your highest spending category. Consider reviewing these expenses for potential savings.
                </p>
              </div>
            )}
            
            {savingsOpportunity > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                    <ArrowDown className="h-3.5 w-3.5 mr-1" />
                    Savings Opportunity
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">Save {formatCurrency(savingsOpportunity)}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  By reducing small food purchases, you could save this amount monthly.
                </p>
              </div>
            )}
            
            <div className="pt-2">
              <h3 className="font-medium mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Recommendations
              </h3>
              <ul className="space-y-3">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </span>
                    <p className="text-sm">{insight}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <AlertCircle className="w-4 h-4 mr-2" />
            Upload a bank statement to get personalized insights
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Insights;
