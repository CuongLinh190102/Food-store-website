import { Resend } from 'resend';

export function getClient() {
  return new Resend(process.env.RESEND_API_KEY);
}