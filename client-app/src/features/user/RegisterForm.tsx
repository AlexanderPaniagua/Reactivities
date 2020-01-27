import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../app/models/user';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessages from '../../app/common/form/ErrorMessages';

const validate = combineValidators({
    userName: isRequired('userName'),
    displayName: isRequired('displayName'),
    email: isRequired('email'),
    password: isRequired('password')
});

const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => register(values).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({ handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Sing Up to Reactivities' color='teal' textAlign='center' />
                    <Field name='userName' component={TextInput} placeholder='Username' />

                    <Field name='displayName' component={TextInput} placeholder='Display Name' />
                    <Field name='email' component={TextInput} placeholder='Email' />

                    <Field name='password' component={TextInput} placeholder='Password' type='password' />
                    {submitError && !dirtySinceLastSubmit && /*<Label color='red' basic content={submitError.statusText} />*/ <ErrorMessages error={submitError} /*text='Invalid username or password'*/ />}
                    <Button fluid disabled={invalid && !dirtySinceLastSubmit || pristine} loading={submitting} /*positive*/ color='teal' content='Register ' />
                    <pre>{/*JSON.stringify(form.getState(), null, 2)*/}</pre>
                </Form>
            )}
        />
    );
};

export default RegisterForm;