
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { EnhancedInputSanitizer } from '@/utils/enhancedInputSanitizer';
import { useSecurity } from '@/components/security/SecurityProvider';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export const SecureContactForm: React.FC = () => {
  const { checkRateLimit, reportSecurityEvent } = useSecurity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    // Real-time sanitization for better UX
    let sanitizedValue = value;
    
    switch (field) {
      case 'email':
        sanitizedValue = value.toLowerCase().trim();
        break;
      case 'phone':
        sanitizedValue = value.replace(/[^\d\+\-\(\)\s]/g, '');
        break;
      default:
        sanitizedValue = value.slice(0, field === 'message' ? 2000 : 200);
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Security: Rate limiting
      if (!checkRateLimit('contact_form', 3, 300000)) { // 3 submissions per 5 minutes
        toast.error('Слишком много отправок формы. Попробуйте позже.');
        return;
      }

      // Security: Enhanced sanitization
      const sanitizedData = EnhancedInputSanitizer.sanitizeContactForm(formData);

      // Validation
      if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      if (!sanitizedData.email.includes('@')) {
        toast.error('Пожалуйста, введите корректный email адрес');
        return;
      }

      // Security: Check for spam patterns
      const spamPatterns = [
        /(.)\1{4,}/g, // Repeated characters
        /(https?:\/\/[^\s]+)/gi, // URLs (might be spam)
        /\b(casino|pharmacy|viagra|cialis)\b/gi // Common spam words
      ];

      const messageText = sanitizedData.message.toLowerCase();
      const isSpam = spamPatterns.some(pattern => pattern.test(messageText));
      
      if (isSpam) {
        reportSecurityEvent('potential_spam_submission', sanitizedData);
        toast.error('Сообщение содержит недопустимый контент');
        return;
      }

      // Here you would typically send the data to your backend
      console.log('🔒 Secure contact form submission:', sanitizedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Contact form error:', error);
      reportSecurityEvent('contact_form_error', { error: error instanceof Error ? error.message : 'Unknown' });
      toast.error('Произошла ошибка при отправке сообщения');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Свяжитесь с нами
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Имя *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ваше имя"
                required
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10"
                  required
                  maxLength={254}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  className="pl-10"
                  maxLength={20}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Тема</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Тема сообщения"
                maxLength={200}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Сообщение *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Расскажите подробнее о вашем вопросе..."
              required
              maxLength={2000}
              rows={6}
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.message.length}/2000 символов
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
