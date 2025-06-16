
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "npm:@react-email/components@0.0.22";
import * as React from "npm:react@18.3.1";

interface RegistrationConfirmationEmailProps {
  userName: string;
  confirmationUrl: string;
}

export const RegistrationConfirmationEmail = ({
  userName,
  confirmationUrl,
}: RegistrationConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Добро пожаловать в EVERLIV! Подтвердите свою регистрацию</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logo}>EVERLIV</Text>
        </Section>
        
        <Heading style={h1}>Добро пожаловать, {userName}!</Heading>
        
        <Text style={heroText}>
          Спасибо за регистрацию в EVERLIV — вашей персональной платформе для 
          оптимизации здоровья с помощью искусственного интеллекта.
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Подтвердить регистрацию
          </Button>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={benefitsSection}>
          <Heading style={h2}>Что вас ждет в EVERLIV:</Heading>
          <Text style={benefitItem}>🧬 Анализ биомаркеров с ИИ-рекомендациями</Text>
          <Text style={benefitItem}>💊 Персонализированные протоколы лечения</Text>
          <Text style={benefitItem}>🩺 Консультации с ИИ-доктором 24/7</Text>
          <Text style={benefitItem}>📊 Мониторинг показателей здоровья</Text>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Если вы не регистрировались на EVERLIV, просто проигнорируйте это письмо.
        </Text>
        
        <Text style={footer}>
          С уважением,<br />
          Команда EVERLIV
        </Text>
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

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  color: "#059669",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

const h2 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const heroText = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const benefitsSection = {
  margin: "24px 0",
};

const benefitItem = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "16px 0 0 0",
};
