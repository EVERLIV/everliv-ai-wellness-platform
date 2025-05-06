
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingFAQ = () => {
  const faqs = [
    {
      question: "Могу ли я перейти с одного тарифа на другой?",
      answer: "Да, вы можете изменить свой тарифный план в любое время. При переходе на более высокий тариф изменения вступят в силу немедленно, а при переходе на более низкий — с начала следующего платежного периода."
    },
    {
      question: "Есть ли скидки для годовой оплаты?",
      answer: "Да, при выборе годовой оплаты вы получаете скидку 20% по сравнению с ежемесячными платежами."
    },
    {
      question: "Могу ли я получить возврат средств?",
      answer: "Мы предлагаем 30-дневную гарантию возврата денег. Если вы не удовлетворены нашим сервисом, вы можете запросить полный возврат в течение 30 дней после оплаты."
    },
    {
      question: "Какие способы оплаты вы принимаете?",
      answer: "Мы принимаем все основные кредитные карты (Visa, MasterCard, American Express), а также PayPal и банковские переводы для корпоративных клиентов."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-everliv-800">
            Часто задаваемые вопросы о тарифах
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-everliv-800">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
