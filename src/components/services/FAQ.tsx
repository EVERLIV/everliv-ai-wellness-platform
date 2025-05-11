
import React from 'react';

export interface FAQProps {
  faqs: {
    question: string;
    answer: string | React.ReactNode;
  }[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Часто задаваемые вопросы</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border p-4 rounded-md">
            <h3 className="font-medium mb-2">{faq.question}</h3>
            <div className="text-gray-600">
              {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
