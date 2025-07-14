import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  X,
  Leaf
} from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onDenied: () => void;
}

export function AgeVerificationModal({ isOpen, onVerified, onDenied }: AgeVerificationModalProps) {
  const [birthDate, setBirthDate] = useState({ month: '', day: '', year: '' });
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const calculateAge = (birthDate: { month: string; day: string; year: string }) => {
    const { month, day, year } = birthDate;
    if (!month || !day || !year) return 0;
    
    const today = new Date();
    const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateChange = (field: 'month' | 'day' | 'year', value: string) => {
    const newBirthDate = { ...birthDate, [field]: value };
    setBirthDate(newBirthDate);
    
    if (newBirthDate.month && newBirthDate.day && newBirthDate.year) {
      const age = calculateAge(newBirthDate);
      setIsValid(age >= 21);
      setShowError(age < 21 && age > 0);
    }
  };

  const handleVerify = () => {
    const age = calculateAge(birthDate);
    if (age >= 21) {
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerifiedDate', new Date().toISOString());
      onVerified();
    } else {
      setShowError(true);
    }
  };

  const handleDeny = () => {
    onDenied();
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-battles-black border-battles-gold/30 text-white" hideClose>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 rounded-full bg-battles-gold/20">
                <Shield className="h-8 w-8 text-battles-gold" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-battles-gold mb-2">Age Verification Required</h2>
              <p className="text-gray-300">
                You must be 21 or older to access this cannabis website.
              </p>
            </div>
          </div>

          {/* Legal Notice */}
          <Card className="bg-battles-gold/10 border-battles-gold/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Leaf className="h-5 w-5 text-battles-gold mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-battles-gold">Legal Cannabis in New York</h3>
                  <p className="text-sm text-gray-300">
                    Battles Budz operates as a licensed cannabis microbusiness in New York State. 
                    Cannabis use is legal for adults 21+ in NY.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date of Birth Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-battles-gold" />
              <h3 className="font-semibold text-battles-gold">Enter Your Date of Birth</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Month</label>
                <select
                  value={birthDate.month}
                  onChange={(e) => handleDateChange('month', e.target.value)}
                  className="w-full p-2 bg-battles-black border border-gray-700 rounded text-white focus:border-battles-gold"
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Day</label>
                <select
                  value={birthDate.day}
                  onChange={(e) => handleDateChange('day', e.target.value)}
                  className="w-full p-2 bg-battles-black border border-gray-700 rounded text-white focus:border-battles-gold"
                >
                  <option value="">Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Year</label>
                <select
                  value={birthDate.year}
                  onChange={(e) => handleDateChange('year', e.target.value)}
                  className="w-full p-2 bg-battles-black border border-gray-700 rounded text-white focus:border-battles-gold"
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Validation Messages */}
            {showError && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-sm text-red-400">
                  You must be 21 or older to access this website.
                </p>
              </div>
            )}

            {isValid && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <p className="text-sm text-green-400">
                  Age verified. You may proceed.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDeny}
              variant="outline"
              className="flex-1 border-gray-700 text-white hover:bg-gray-900"
            >
              <X className="h-4 w-4 mr-2" />
              Under 21
            </Button>
            
            <Button
              onClick={handleVerify}
              disabled={!isValid}
              className="flex-1 bg-battles-gold text-battles-black hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I'm 21+
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>By entering, you certify that you are of legal age to purchase cannabis products.</p>
            <p className="mt-1">This verification is required by New York State law.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}