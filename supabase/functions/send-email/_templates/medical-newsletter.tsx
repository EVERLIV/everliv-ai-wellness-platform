
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface Article {
  title: string;
  summary: string;
  url: string;
}

interface Tip {
  icon: string;
  title: string;
  description: string;
}

interface MedicalNewsletterEmailProps {
  userName: string;
  articles: Article[];
  tips: Tip[];
}

export const MedicalNewsletterEmail = ({
  userName,
  articles,
  tips,
}: MedicalNewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>EVERLIV Newsletter: Новые медицинские рекомендации и статьи</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>EVERLIV</Text>
          <Text style={newsletterTag}>МЕДИЦИНСКИЙ NEWSLETTER</Text>
        </Section>
        
        <Heading style={h1}>Привет, {userName}! 👋</Heading>
        
        <Text style={introText}>
          Мы подготовили для вас новые медицинские статьи и рекомендации, 
          основанные на последних научных исследованиях.
        </Text>
        
        <Hr style={hr} />
        
        <Section style={articlesSection}>
          <Heading style={h2}>📚 Новые статьи</Heading>
          {articles.map((article, index) => (
            <Section key={index} style={articleCard}>
              <Heading style={articleTitle}>{article.title}</Heading>
              <Text style={articleSummary}>{article.summary}</Text>
              <Button style={readMoreButton} href={article.url}>
                Читать полностью
              </Button>
            </Section>
          ))}
        </Section>
        
        <Hr style={hr} />
        
        <Section style={tipsSection}>
          <Heading style={h2}>💡 Рекомендации от ИИ-ассистента</Heading>
          {tips.map((tip, index) => (
            <Section key={index} style={tipCard}>
              <Text style={tipIcon}>{tip.icon}</Text>
              <Section style={tipContent}>
                <Text style={tipTitle}>{tip.title}</Text>
                <Text style={tipDescription}>{tip.description}</Text>
              </Section>
            </Section>
          ))}
        </Section>
        
        <Hr style={hr} />
        
        <Section style={ctaSection}>
          <Heading style={h3}>🚀 Получите персональные рекомендации</Heading>
          <Text style={ctaText}>
            Загрузите свои анализы и получите индивидуальные рекомендации от нашего ИИ-доктора
          </Text>
          <Button style={ctaButton} href="https://everliv.online/blood-analysis">
            Анализировать результаты
          </Button>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={footerSection}>
          <Text style={footerText}>
            Вы получили это письмо, так как подписаны на newsletter EVERLIV.
          </Text>
          <Text style={footerText}>
            Не хотите получать такие письма? <a href="#" style={unsubscribeLink}>Отписаться</a>
          </Text>
          <Text style={footerSignature}>
            С заботой о вашем здоровье,<br />
            Команда EVERLIV 💚
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  margin: "40px auto",
  padding: "40px",
  width: "600px",
};

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  color: "#059669",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
};

const newsletterTag = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "500",
  letterSpacing: "1px",
  margin: "0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const h2 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const h3 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const introText = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const articlesSection = {
  margin: "24px 0",
};

const articleCard = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
};

const articleTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const articleSummary = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px 0",
};

const readMoreButton = {
  backgroundColor: "#059669",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "500",
  textDecoration: "none",
  padding: "8px 16px",
  display: "inline-block",
};

const tipsSection = {
  margin: "24px 0",
};

const tipCard = {
  display: "flex",
  alignItems: "flex-start",
  margin: "16px 0",
  padding: "16px",
  backgroundColor: "#f0f9ff",
  borderRadius: "8px",
};

const tipIcon = {
  fontSize: "24px",
  margin: "0 16px 0 0",
};

const tipContent = {
  flex: "1",
};

const tipTitle = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const tipDescription = {
  color: "#4b5563",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  backgroundColor: "#f0fdf4",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #bbf7d0",
};

const ctaText = {
  color: "#166534",
  fontSize: "14px",
  margin: "0 0 20px 0",
};

const ctaButton = {
  backgroundColor: "#059669",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "12px 24px",
  display: "inline-block",
};

const footerSection = {
  textAlign: "center" as const,
  margin: "24px 0 0 0",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "8px 0",
};

const unsubscribeLink = {
  color: "#6b7280",
  textDecoration: "underline",
};

const footerSignature = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "16px 0 0 0",
};
