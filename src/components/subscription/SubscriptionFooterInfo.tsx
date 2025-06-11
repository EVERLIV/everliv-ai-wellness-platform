
import { Link } from 'react-router-dom';

const SubscriptionFooterInfo = () => {
  return (
    <div className="text-center">
      <p className="text-muted-foreground">
        Есть вопросы по подпискам? <Link to="/faq" className="text-primary hover:underline">Свяжитесь с нами</Link>
      </p>
    </div>
  );
};

export default SubscriptionFooterInfo;
