import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { SignUpCard } from '../components/auth/register/Card';

const RegisterPage = () => {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
          background: 'radial-gradient(circle at top, #0b1f3a, #050d1a)',
          overflow: 'hidden',
        }}
      >
        <SignUpCard />
      </Stack>
    </>
  );
};

export { RegisterPage };
