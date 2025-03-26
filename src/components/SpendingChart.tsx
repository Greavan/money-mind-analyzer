import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface SpendingChartProps {
  transactions: Transaction[];
  selectedCategory: string | null;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#FF6B6B', '#6BCB77', '#4D96FF', 
  '#9B5DE5', '#F15BB5'
];

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, selectedCategory }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const { formatCurrency, convertAmount } = useCurrency();
  
  useEffect(() => {
    // Filter out income transactions (positive amounts)
    const expenses = transactions.filter(t => t.amount < 0);
    
    // Calculate total spending (absolute value of negative transactions)
    const total = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    setTotalSpending(total);
    
    // Group expenses by category
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + Math.abs(transaction.amount));
    });
    
    // Convert to chart data format
    const data: ChartData[] = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
    
    setChartData(data);
  }, [transactions]);
  
  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-medium">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">
            {formatPercentage(data.value / totalSpending)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const filteredData = selectedCategory 
    ? chartData.filter(item => item.name === selectedCategory) 
    : chartData;
  
  return (
    <Card className="w-full h-[400px] animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Spending by Category</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {formatCurrency(totalSpending)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry: any) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No spending data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
