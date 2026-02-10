import { Input } from '@/components/ui/input';
import { ComponentProps } from 'react';

type SafeInputProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
};

export default function SafeInput({ type = 'text', ...props }: SafeInputProps) {
  return <Input type={type} {...props} />;
}
