import { RegisterUser } from '../types/user';
import CryptoJS from 'crypto-js';

export const createEmailWithPassword = (emailConfig: Pick<RegisterUser, 'email' | 'password'>) => {
  const hashedPassword = CryptoJS.AES.decrypt(
    emailConfig.password,
    `${process.env.SECRET_KEY_AES}`
  );
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  return {
    from: 'System egzaminacyjny z baz danych <system@umk.pl>',
    to: emailConfig.email,
    subject: 'Hasło do twojego konta',
    text: `Drogi Użytkowniku, hasło do twojego konta zostało wygenerowane automatycznie. Hasło do twojego konta to: ${originalPassword}`,
  };
};

export const createEmailWithRemindMessage = (email: string[], date: string) => {
  return {
    from: 'System egzaminacyjny z baz danych <system@umk.pl>',
    to: email,
    subject: 'Termin egzaminu z baz danych',
    text: `Drogi Użytkowniku, egzamin z baz danych odbedzie się ${date}`,
  };
};
