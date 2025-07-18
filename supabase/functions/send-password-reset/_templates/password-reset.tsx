import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface PasswordResetEmailProps {
  resetUrl: string;
  userEmail: string;
}

export const PasswordResetEmail = ({
  resetUrl,
  userEmail,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Восстановление пароля EVERLIV</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Восстановление пароля</Heading>
        
        <Text style={text}>
          Здравствуйте!
        </Text>
        
        <Text style={text}>
          Мы получили запрос на восстановление пароля для вашего аккаунта EVERLIV ({userEmail}).
        </Text>
        
        <Section style={buttonContainer}>
          <Button href={resetUrl} style={button}>
            Восстановить пароль
          </Button>
        </Section>
        
        <Text style={text}>
          Если кнопка не работает, скопируйте и вставьте следующую ссылку в ваш браузер:
        </Text>
        
        <Text style={linkText}>
          {resetUrl}
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо. 
          Ваш пароль останется без изменений.
        </Text>
        
        <Text style={footer}>
          Ссылка для восстановления действительна в течение 24 часов.
        </Text>
        
        <Text style={footer}>
          С уважением,<br />
          Команда EVERLIV
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0',
  lineHeight: '42px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
};

const linkText = {
  color: '#5F51E8',
  fontSize: '14px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#cccccc',
  margin: '32px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  margin: '4px 0',
};