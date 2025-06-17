
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Mail } from 'lucide-react';
import { useSmartAuth } from '@/hooks/useSmartAuth';
import { toast } from 'sonner';
import { InputSanitizer } from '@/utils/inputSanitizer';
import { useSecureInput } from '@/hooks/useSecureInput';

const RegistrationForm = () => {
  const nicknameInput = useSecureInput({ maxLength: 50 });
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { signUpWithMagicLink, isLoading } = useSmartAuth();

  const validateEmail = (emailValue: string) => {
    if (!emailValue) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!InputSanitizer.isValidEmail(emailValue)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = InputSanitizer.sanitizeText(e.target.value, 254);
    setEmail(sanitizedEmail);
    validateEmail(sanitizedEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    
    // Rate limiting check
    if (attempts >= 3) {
      setErrorMessage('Too many attempts. Please wait before trying again.');
      return;
    }

    // Input validation
    if (!nicknameInput.value || !email) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    if (!nicknameInput.isValid) {
      setErrorMessage(nicknameInput.errorMessage || 'Invalid nickname');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    if (!agreedToTerms) {
      setErrorMessage('Please accept the terms of use');
      return;
    }
    
    // Additional security check
    if (!InputSanitizer.checkRateLimit('registration', email, 2, 60000)) {
      setErrorMessage('Please wait before attempting registration again');
      return;
    }
    
    try {
      setAttempts(prev => prev + 1);
      
      await signUpWithMagicLink(email, { 
        nickname: nicknameInput.value
      });
      setLinkSent(true);
      toast.success('Registration link sent to your email!');
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 'over_email_send_rate_limit') {
        setErrorMessage('Please wait a minute before trying again');
      } else if (error.message?.includes('already registered')) {
        setErrorMessage('This email is already registered. Please try logging in instead.');
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
    }
  };

  if (linkSent) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <Mail className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Link Sent!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We sent a confirmation link to {email}. 
          Check your email and click the link to complete registration.
        </p>
        <Button 
          onClick={() => {
            setLinkSent(false);
            setAttempts(0);
            nicknameInput.reset();
            setEmail('');
          }} 
          variant="outline" 
          className="w-full h-12"
        >
          Send Another Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
    
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="nickname" className="text-base font-medium">Nickname</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="Your nickname"
            value={nicknameInput.value}
            onChange={(e) => nicknameInput.handleInputChange(e.target.value)}
            required
            className={`h-12 text-base ${!nicknameInput.isValid ? 'border-red-500' : ''}`}
            maxLength={50}
          />
          {nicknameInput.errorMessage && (
            <p className="text-sm text-red-600">{nicknameInput.errorMessage}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email" className="text-base font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={handleEmailChange}
            required
            className={`h-12 text-base ${emailError ? 'border-red-500' : ''}`}
            maxLength={254}
          />
          {emailError && (
            <p className="text-sm text-red-600">{emailError}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            We'll send you a secure login link without a password
          </p>
        </div>
        
        <div className="flex items-start space-x-3 py-4">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I accept the <a href="/terms" className="text-everliv-600 hover:underline">terms of use</a> and <a href="/privacy" className="text-everliv-600 hover:underline">privacy policy</a>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium bg-everliv-600 hover:bg-everliv-700"
          disabled={isLoading || !nicknameInput.isValid || !!emailError || attempts >= 3}
        >
          {isLoading ? 'Sending Link...' : 'Register'}
        </Button>
        
        {attempts > 0 && (
          <p className="text-sm text-gray-500 text-center">
            Attempts: {attempts}/3
          </p>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
