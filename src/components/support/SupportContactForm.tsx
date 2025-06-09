
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SupportContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Здесь будет логика отправки сообщения в поддержку
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация отправки
      toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время.");
      setFormData({ subject: "", message: "", email: "" });
    } catch (error) {
      toast.error("Ошибка отправки сообщения. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Написать в поддержку</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email для ответа</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="subject">Тема обращения</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Опишите кратко суть вопроса"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Сообщение</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Подробно опишите ваш вопрос или проблему"
              rows={6}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Отправка..." : "Отправить сообщение"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportContactForm;
