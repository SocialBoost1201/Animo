declare module 'react-google-recaptcha-v3' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const GoogleReCaptchaProvider: React.FC<{ children?: React.ReactNode } & any>;
  export function useGoogleReCaptcha(): {
    executeRecaptcha?: (action: string) => Promise<string>;
  };
}
