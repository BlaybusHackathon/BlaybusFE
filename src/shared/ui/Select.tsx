import { Select as ChakraSelect, SelectProps, FormControl, FormLabel } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface Props extends SelectProps {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(({ label, children, ...props }, ref) => {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <ChakraSelect ref={ref} bg="white" {...props}>
        {children}
      </ChakraSelect>
    </FormControl>
  );
});

Select.displayName = 'Select';