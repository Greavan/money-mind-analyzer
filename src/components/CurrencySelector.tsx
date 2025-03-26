
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCurrency } from '@/contexts/CurrencyContext';
import { IndianRupee, DollarSign } from 'lucide-react';

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground mr-1">Currency:</span>
      <ToggleGroup type="single" value={currency} onValueChange={(value) => value && setCurrency(value as 'USD' | 'INR')}>
        <ToggleGroupItem value="USD" aria-label="Toggle USD">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>USD</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="INR" aria-label="Toggle INR">
          <IndianRupee className="h-4 w-4 mr-1" />
          <span>INR</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CurrencySelector;
