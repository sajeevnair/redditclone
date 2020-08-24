import React from 'react';
import { Form, Formik } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/core';
interface RegisterProps {

}

const Register: React.FC<RegisterProps> = ({ }) => {
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values) => {
                console.log(values);

            }}
        >
            {
                ({ values, handleChange }) => (
                    <Form>
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input value={values.username} onChange={handleChange} id="username" placeholder="username" />
                            {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
                        </FormControl>
                    </Form>
                )
            }
        </Formik>
    );
};
export default Register;