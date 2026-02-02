import { Button, ButtonProps } from '@chakra-ui/react';
import { useLogout } from '../model/useLogout';

export const LogoutButton = (props: ButtonProps) => {
  const { logout } = useLogout();

  return (
    <Button onClick={logout} colorScheme="red" variant="outline" size="sm" {...props}>
      로그아웃
    </Button>
  );
};