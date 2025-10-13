import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { SitemarkIcon } from './CustomIcons';
import { Link as RouterLink } from 'react-router-dom';


const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    borderRadius: theme.spacing(2),
    background: 'rgba(12, 20, 32, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
    [theme.breakpoints.up('sm')]: {
        width: '420px',
    },
}));

const darkInputStyles = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        color: '#fff',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.1)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#2196f3',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#ccc',
    },
    '& .MuiInputBase-input': {
        color: '#fff',
    },
    '& .MuiFormHelperText-root': {
        color: '#ff6b6b',
    },
};

const SignInCard = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (event) => {
        if (emailError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <Card variant="outlined">
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
                <SitemarkIcon />
            </Box>
            <Typography
                component="h1"
                variant="h4"
                sx={{
                    width: '100%',
                    fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                    fontWeight: 600,
                    textAlign: 'center',
                }}
            >
                Inicio de sesión
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="email" sx={{ color: '#ccc' }}>
                        Correo
                    </FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="tucorreo@email.com"
                        autoComplete="email"
                        required
                        fullWidth
                        variant="outlined"
                        sx={darkInputStyles}
                    />
                </FormControl>

                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password" sx={{ color: '#ccc' }}>
                            Contraseña
                        </FormLabel>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        sx={darkInputStyles}
                    />
                    <Link
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                        sx={{ alignSelf: 'end', mt: 3, color: '#90caf9' }}
                    >
                        Olvidaste tu contraseña?
                    </Link>
                </FormControl>

                <ForgotPassword open={open} handleClose={handleClose} />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                    sx={{
                        mt: 2,
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' },
                        borderRadius: '8px',
                    }}
                >
                    Iniciar sesión
                </Button>

                <Typography sx={{ textAlign: 'center', color: '#aaa' }}>
                    No tienes una cuenta?{' '}
                    <RouterLink to='/registro'>
                        <Link href="/sign-up" variant="body2" sx={{ color: '#90caf9' }}>
                            Registrarse
                        </Link>
                    </RouterLink>
                </Typography>
            </Box>
        </Card>
    );
};

export { SignInCard };
