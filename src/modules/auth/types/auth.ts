type PropsAuth = {
  title: string;
  subtitle?: string;
  onSubmit: (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => void | Promise<void>;
  onForgot: () => void;
  submitting?: boolean;
  footer?: React.ReactNode;
};

export type { PropsAuth };
