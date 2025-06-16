
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

interface AnalysisResultsEmailProps {
  userName: string;
  analysisType: string;
  resultsUrl: string;
  keyFindings: string[];
}

export const AnalysisResultsEmail = ({
  userName,
  analysisType,
  resultsUrl,
  keyFindings,
}: AnalysisResultsEmailProps) => (
  <Html>
    <Head />
    <Preview>Готовы результаты вашего анализа — {analysisType}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logo}>EVERLIV</Text>
        </Section>
        
        <Heading style={h1}>Результаты готовы!</Heading>
        
        <Text style={greeting}>Здравствуйте, {userName}!</Text>
        
        <Section style={alertBox}>
          <Text style={alertText}>
            📋 Ваш анализ <strong>{analysisType}</strong> обработан нашим ИИ-ассистентом
          </Text>
        </Section>
        
        <Section style={findingsSection}>
          <Heading style={h2}>Ключевые находки:</Heading>
          {keyFindings.map((finding, index) => (
            <Text key={index} style={findingItem}>
              • {finding}
            </Text>
          ))}
        </Section>
        
        <Section style={buttonContainer}>
          <Button style={button} href={resultsUrl}>
            Посмотреть полные результаты
          </Button>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={disclaimerSection}>
          <Heading style={h3}>⚠️ Важная информация</Heading>
          <Text style={disclaimerText}>
            Результаты анализа предоставлены ИИ-ассистентом для информационных целей. 
            Обязательно проконсультируйтесь с врачом для получения медицинских рекомендаций.
          </Text>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Команда EVERLIV заботится о вашем здоровье 💚
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
  marginBottom: "24px",
};

const logo = {
  color: "#059669",
  fontSize: "28px",
  fontWeight: "bold",
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
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const h3 = {
  color: "#dc2626",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const greeting = {
  color: "#4b5563",
  fontSize: "16px",
  margin: "0 0 24px 0",
};

const alertBox = {
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: "6px",
  padding: "16px",
  margin: "24px 0",
};

const alertText = {
  color: "#0c4a6e",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const findingsSection = {
  margin: "24px 0",
};

const findingItem = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "8px 0",
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
  margin: "24px 0",
};

const disclaimerSection = {
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "6px",
  padding: "16px",
};

const disclaimerText = {
  color: "#7f1d1d",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "center" as const,
  margin: "24px 0 0 0",
};
