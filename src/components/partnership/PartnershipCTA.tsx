
import React from 'react';
import { Button } from "@/components/ui/button";

const PartnershipCTA = () => {
  return (
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-2xl font-bold mb-6">Готовы начать сотрудничество?</h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Заполните форму партнерской заявки, и наш менеджер свяжется с вами в ближайшее время для обсуждения деталей
      </p>
      <Button size="lg">Стать партнером</Button>
    </div>
  );
};

export default PartnershipCTA;
