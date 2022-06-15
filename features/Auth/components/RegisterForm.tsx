import React from "react";
import { Alert, AlertIcon, Button, VStack } from "@chakra-ui/react";
import { Field, Formik, FormikErrors } from "formik";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../types/User";
import { LabeledInput } from "base/components/forms/Inputs";
import { FaEnvelope, FaLock } from "react-icons/fa";

interface SignupValues extends User {
  passwordConfirmed: string;
}

const RegisterForm = () => {
  const onSubmit = (
    formValues: User,
    { setStatus }: { setStatus: Function }
  ) => {
    const auth = getAuth();
    return createUserWithEmailAndPassword(
      auth,
      formValues.email.trim(),
      formValues.password.trim()
    ).catch((error) => {
      setStatus(error.message);
    });
  };

  const validate = (values: SignupValues) => {
    let errors: FormikErrors<SignupValues> = {};

    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    if (values.passwordConfirmed !== values.password) {
      errors.passwordConfirmed = "Passwords must match";
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        passwordConfirmed: "",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      {(props) => {
        const { isSubmitting, handleSubmit, isValid, errors, status, touched } =
          props;

        return (
          <form onSubmit={handleSubmit}>
            <VStack spacing={"5%"} mt={"10%"}>
              <Field
                name="email"
                as={LabeledInput}
                type="email"
                placeholder="Enter your Email address"
                label={"Email"}
                error={errors.email}
                autoComplete="email"
                touched={touched.email}
                variant="flushed"
                icon={<FaEnvelope />}
              />
              <Field
                name="password"
                as={LabeledInput}
                type="password"
                placeholder="Enter your Password"
                label={"Password"}
                error={errors.password}
                touched={touched.password}
                variant="flushed"
                icon={<FaLock />}
              />
              <Field
                name="passwordConfirmed"
                as={LabeledInput}
                type="password"
                label={"Confirm Password"}
                placeholder="Password"
                error={errors.passwordConfirmed}
                touched={touched.passwordConfirmed}
                variant="flushed"
                icon={<FaLock />}
              />
              <Button
                type="submit"
                size="lg"
                w={"100%"}
                backgroundColor="#90CDF4"
                fontSize="lg"
                disabled={!isValid || isSubmitting}
                rounded={"full"}
                boxShadow={"xl"}
              >
                Sign up
              </Button>
            </VStack>
            {status && (
              <Alert status="error" mt={"5%"}>
                <AlertIcon />
                {status}
              </Alert>
            )}
          </form>
        );
      }}
    </Formik>
  );
};
export default RegisterForm;
