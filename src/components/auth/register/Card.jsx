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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SitemarkIcon } from '../login/CustomIcons';

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

const SignUpCard = () => {
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState('buyer');

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const values = {
            fullName: data.get('fullName'),
            email: data.get('email'),
            password: data.get('password'),
            role,
        };

        const newErrors = {};
        if (!values.fullName) newErrors.fullName = 'Full name is required';
        if (!values.email || !/\S+@\S+\.\S+/.test(values.email))
            newErrors.email = 'Please enter a valid email';
        if (!values.password || values.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            console.log('Register data:', values);
        }
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
                Crear una cuenta
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="fullName" sx={{ color: '#ccc' }}>
                        Nombre completo
                    </FormLabel>
                    <TextField
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
                        required
                        fullWidth
                        variant="outlined"
                        sx={darkInputStyles}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="email" sx={{ color: '#ccc' }}>
                        Correo
                    </FormLabel>
                    <TextField
                        error={!!errors.email}
                        helperText={errors.email}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        fullWidth
                        variant="outlined"
                        sx={darkInputStyles}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor="password" sx={{ color: '#ccc' }}>
                        Contraseña
                    </FormLabel>
                    <TextField
                        error={!!errors.password}
                        helperText={errors.password}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        required
                        fullWidth
                        variant="outlined"
                        sx={darkInputStyles}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel sx={{ color: '#ccc' }}>Selecciona un rol</FormLabel>
                    <RadioGroup
                        row
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        sx={{ justifyContent: 'center', color: '#fff' }}
                    >
                        <FormControlLabel
                            value="producer"
                            control={<Radio sx={{ color: '#90caf9' }} />}
                            label="Productor"
                        />
                        <FormControlLabel
                            value="buyer"
                            control={<Radio sx={{ color: '#90caf9' }} />}
                            label="Comprador"
                        />
                    </RadioGroup>
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 1,
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' },
                        borderRadius: '8px',
                    }}
                >
                    Registrarse
                </Button>

                <Typography sx={{ textAlign: 'center', color: '#aaa' }}>
                    Ya tienes una cuenta?{' '}
                    <Link href="/login" variant="body2" sx={{ color: '#90caf9' }}>
                        Iniciar sesión
                    </Link>
                </Typography>
            </Box>
        </Card>
    );
};

export { SignUpCard };
