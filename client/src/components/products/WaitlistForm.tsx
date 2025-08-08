import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormProps {
  onSubmit?: (email: string) => void;
  className?: string;
  buttonText?: string;
  placeholder?: string;
  large?: boolean;
}

export default function WaitlistForm({ 
  onSubmit, 
  className = "", 
  buttonText = "Join Waitlist",
  placeholder = "Enter your email for priority access",
  large = false 
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Welcome to the Cultivation Club!",
      description: "You're now guaranteed priority access to our Spring 2026 harvest.",
    });
    
    if (onSubmit) {
      onSubmit(email);
    }
    
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`flex-1 bg-gray-800 border-battles-gold/30 text-white placeholder-gray-400 ${
          large ? 'h-14 text-center text-lg' : 'h-12'
        }`}
        required
      />
      <Button 
        type="submit" 
        className={`bg-battles-gold text-battles-black hover:bg-yellow-400 font-semibold ${
          large ? 'h-14 text-lg font-bold' : 'h-12'
        } px-8`}
      >
        {buttonText}
      </Button>
    </form>
  );
}