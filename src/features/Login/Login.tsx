import React, {useState} from 'react'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "./auth-reducer";
import {AppRootStateType} from "../../app/store";
import {Navigate} from 'react-router-dom';
import {Box, InputAdornment, Stack} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {setAppStatusAC} from "../../app/app-reducer";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export interface StateType {
    password: string;
    showPassword: boolean;
}

export const Login = () => {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 6) {
                errors.password = 'Must be 6 characters or more';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm();
        },
    })
    const [value, setValue] = useState<StateType>({
        password: '',
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValue({
            ...value,
            showPassword: !value.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <div>
        <form onSubmit={formik.handleSubmit}>
            <Box
                sx={{
                    padding: '50px',
                    position: 'fixed', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    opacity: [0.9, 0.8, 0.8],
                    p: 10,
                    borderRadius: '20px',
                    boxShadow: '20',
                }}
            >
                <FormGroup>
                    <TextField id="standard"
                               label="Login"
                               variant="standard"
                               margin="normal"
                               fullWidth
                               error={!!(formik.touched.email && formik.errors.email)}
                               helperText={formik.touched.email && formik.errors.email}
                               {...formik.getFieldProps("email")}/>
                    <TextField id="standard-basic"
                               label="Password"
                               variant="standard"
                               margin="normal"
                               fullWidth
                               type={value.showPassword ? 'text' : 'password'}
                               error={!!(formik.touched.password && formik.errors.password)}
                               helperText={formik.touched.password && formik.errors.password}
                               {...formik.getFieldProps("password")}
                               InputProps={{
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton
                                               aria-label="toggle password visibility"
                                               onClick={handleClickShowPassword}
                                               onMouseDown={handleMouseDownPassword}>
                                               {value.showPassword ? <Visibility/> : <VisibilityOff/>}
                                           </IconButton>
                                       </InputAdornment>
                                   )
                               }}
                    />
                    <FormControlLabel sx={{
                        marginTop: '25px',

                    }}
                       control={
                             <Checkbox
                               defaultChecked color="default"
                               {...formik.getFieldProps("rememberMe")} />}
                               label="Remember me"
                    />
                    <Stack spacing={3} sx={{
                        marginTop: '25px',
                    }}>
                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}>Log in</Button>
                    </Stack>
                </FormGroup>
            </Box>

        </form>
    </div>
}
