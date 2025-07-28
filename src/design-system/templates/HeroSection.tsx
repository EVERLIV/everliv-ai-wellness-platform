import { Container, Section, Stack } from "../components/Layout";
import { Display, Heading, Text } from "../components/Typography";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "../icons/Brand";
import { GradientOrb, AbstractShape } from "../icons/Decorative";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  showLogo?: boolean;
}

export const HeroSection = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  showLogo = true,
}: HeroSectionProps) => {
  return (
    <Section spacing="xl" background="brand" className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 opacity-20">
        <GradientOrb size={120} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-15">
        <AbstractShape size={80} />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-10">
        <GradientOrb size={160} />
      </div>
      
      <Container className="relative z-10">
        <Stack align="center" justify="center" gap="xl" className="text-center max-w-4xl mx-auto">
          {showLogo && (
            <div className="animate-fade-in">
              <BrandLogo size={64} />
            </div>
          )}
          
          <div className="space-y-6 animate-fade-in">
            <Display className="animate-scale-in">
              {title}
            </Display>
            
            <Heading level={2} variant="muted" className="max-w-2xl mx-auto">
              {subtitle}
            </Heading>
            
            <Text size="lg" variant="muted" className="max-w-xl mx-auto">
              {description}
            </Text>
          </div>
          
          {(primaryAction || secondaryAction) && (
            <Stack 
              direction="row" 
              gap="md" 
              justify="center" 
              className="animate-fade-in flex-wrap"
            >
              {primaryAction && (
                <Button 
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="shadow-glow hover:shadow-xl"
                >
                  {primaryAction.label}
                </Button>
              )}
              
              {secondaryAction && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </Stack>
          )}
        </Stack>
      </Container>
    </Section>
  );
};