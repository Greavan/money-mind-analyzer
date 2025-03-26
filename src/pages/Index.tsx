
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PDFUploader from '@/components/PDFUploader';
import TransactionList from '@/components/TransactionList';
import SpendingChart from '@/components/SpendingChart';
import Insights from '@/components/Insights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import classifier from '@/lib/ml-model';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize ML model when component mounts
    const initModel = async () => {
      try {
        await classifier.initialize();
      } catch (error) {
        console.error('Failed to initialize ML model:', error);
        toast.error('Failed to initialize the analysis engine');
      }
    };
    
    initModel();
  }, []);
  
  const handleUploadSuccess = async (data: any) => {
    try {
      // In a real app, data would come from PDF parsing
      const processedTransactions = await classifier.categorizeTransactions(data.transactions);
      setTransactions(processedTransactions);
      setDataLoaded(true);
      
      // Show success message with transaction count
      toast.success(`Processed ${processedTransactions.length} transactions`);
    } catch (error) {
      console.error('Error processing transactions:', error);
      toast.error('Error processing your statement');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {!dataLoaded ? (
            <div className="py-12">
              <div className="mb-8 text-center animate-fade-in">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Financial Statement Analyzer</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Upload your bank statement and let our AI analyze your spending patterns, categorize transactions, and provide personalized financial insights.
                </p>
              </div>
              
              <PDFUploader 
                onUploadSuccess={handleUploadSuccess} 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
              />
              
              <div className="mt-16 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium mb-2">Your data is secure and private</h2>
                <p className="text-muted-foreground text-center max-w-lg">
                  All processing happens directly in your browser. Your financial data is never stored on our servers or shared with third parties.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Your Financial Analysis</h2>
                <button 
                  onClick={() => {
                    setDataLoaded(false);
                    setTransactions([]);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Upload Another Statement
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingChart transactions={transactions} selectedCategory={selectedCategory} />
                <Insights transactions={transactions} />
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Transactions</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <TransactionList 
                    transactions={transactions} 
                    setSelectedCategory={setSelectedCategory} 
                  />
                </TabsContent>
                <TabsContent value="income" className="mt-4">
                  <TransactionList 
                    transactions={transactions.filter(t => t.amount > 0)} 
                    setSelectedCategory={setSelectedCategory} 
                  />
                </TabsContent>
                <TabsContent value="expenses" className="mt-4">
                  <TransactionList 
                    transactions={transactions.filter(t => t.amount < 0)} 
                    setSelectedCategory={setSelectedCategory} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
