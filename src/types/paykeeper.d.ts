
declare global {
  interface Window {
    PayKeeperWidget?: {
      init: (config: {
        invoice_id: string;
        onSuccess: () => void;
        onError: (error: any) => void;
        onCancel: () => void;
      }) => void;
    };
  }
}

export {};
