
import React, { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { analyzeTransactions } from '@/utils/openaiService';

interface PDFUploaderProps {
  onUploadSuccess: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Define the proper transaction type
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

// Define the mock data type that matches what we're passing to onUploadSuccess
interface ProcessedData {
  transactions: Transaction[];
  analysis?: {
    insights: string[];
    topSpendingCategory: string;
    savingsOpportunities: {
      amount: number;
      description: string;
    }[];
    budgetRecommendations: string[];
  };
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUploadSuccess, isLoading, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFile) {
      if (!apiKey && !showApiInput) {
        setShowApiInput(true);
        return;
      }
      
      if (showApiInput && !apiKey) {
        toast.error('Please enter your OpenAI API key to analyze the statement.');
        return;
      }
      
      setIsLoading(true);
      
      // In a real application, we would send the file to the server for processing
      // For this demo, we'll simulate processing with a timeout
      setTimeout(async () => {
        try {
          // Mock data to simulate bank statement parsing result
          const mockData: ProcessedData = {
            transactions: [
              { id: 1, date: '2023-07-01', description: 'Grocery Store', amount: -85.43, category: 'Groceries' },
              { id: 2, date: '2023-07-03', description: 'Coffee Shop', amount: -4.50, category: 'Food & Dining' },
              { id: 3, date: '2023-07-05', description: 'Gas Station', amount: -45.00, category: 'Transportation' },
              { id: 4, date: '2023-07-07', description: 'Online Retailer', amount: -65.99, category: 'Shopping' },
              { id: 5, date: '2023-07-10', description: 'Pharmacy', amount: -12.99, category: 'Health' },
              { id: 6, date: '2023-07-12', description: 'Salary', amount: 2500.00, category: 'Income' },
              { id: 7, date: '2023-07-15', description: 'Restaurant', amount: -78.35, category: 'Food & Dining' },
              { id: 8, date: '2023-07-18', description: 'Utility Bill', amount: -95.40, category: 'Bills & Utilities' },
              { id: 9, date: '2023-07-20', description: 'Streaming Service', amount: -14.99, category: 'Entertainment' },
              { id: 10, date: '2023-07-22', description: 'Mobile Phone', amount: -65.00, category: 'Bills & Utilities' },
              { id: 11, date: '2023-07-25', description: 'Public Transit', amount: -25.00, category: 'Transportation' },
              { id: 12, date: '2023-07-28', description: 'Gym Membership', amount: -49.99, category: 'Health & Fitness' }
            ]
          };
          
          if (apiKey) {
            // Analyze the transactions with OpenAI
            const analysis = await analyzeTransactions(mockData.transactions, apiKey);
            mockData.analysis = analysis;
          }
          
          toast.success('Statement processed successfully!');
          onUploadSuccess(mockData);
        } catch (error) {
          console.error('Error processing transactions:', error);
          toast.error('Error processing your statement');
        } finally {
          setIsLoading(false);
        }
      }, 2000);
    } else {
      toast.error('Please select a file to upload.');
    }
  }, [selectedFile, onUploadSuccess, setIsLoading, apiKey, showApiInput]);

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <Card className="border-dashed border-2 glassmorphism">
        <CardContent className="p-0">
          <div
            className={`flex flex-col items-center justify-center p-10 text-center rounded-lg transition-all duration-200 ${
              dragActive ? 'bg-primary/5 border-primary' : ''
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium mb-2">Upload Your Bank Statement</h3>
            
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Drag and drop your PDF bank statement, or click to browse. We'll analyze it with AI and provide personalized insights.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleChange}
            />
            
            {showApiInput && (
              <div className="w-full mb-4">
                <Input
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground mb-4">
                  Your API key is used only for this analysis and is not stored.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={openFileSelector}
                variant="outline"
                className="transition-all duration-200 hover:bg-primary/10"
              >
                Browse Files
              </Button>
              
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isLoading}
                className="relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : showApiInput ? 'Analyze with AI' : 'Analyze Statement'}
              </Button>
            </div>
            
            {selectedFile && (
              <div className="mt-4 text-sm text-muted-foreground">
                Selected file: <span className="font-medium text-foreground">{selectedFile.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFUploader;
