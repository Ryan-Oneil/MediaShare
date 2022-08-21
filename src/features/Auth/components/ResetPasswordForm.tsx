import React from "react";
import { Alert, AlertIcon, Button, VStack } from "@chakra-ui/react";
import { Field, Formik, FormikErrors } from "formik";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { User } from "../types/User";
import { LabeledInput } from "@/features/base/components/forms/Inputs";
import { FaEnvelope } from "react-icons/fa";

const ResetPasswordForm = () => {
  const onSubmit = (
    formValues: any,
    { setStatus }: { setStatus: Function }
  ) => {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, formValues.email.trim())
      .then(() =>
        setStatus({
          type: "success",
          message: "Password reset email has been sent",
        })
      )
      .catch((error) => {
        setStatus({ type: "error", message: error.message });
      });
  };

  const validate = (values: any) => {
    let errors: FormikErrors<User> = {};

    if (!values.email) {
      errors.email = "Email is required";
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      {(props) => {
        const { isSubmitting, handleSubmit, isValid, errors, status, touched } =
          props;

        return (
          <form onSubmit={handleSubmit}>
            <VStack spacing={"5%"} mt={"5%"}>
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
              <Button
                type="submit"
                w={"100%"}
                backgroundColor="#90CDF4"
                size="lg"
                fontSize="lg"
                disabled={!isValid || isSubmitting}
                rounded={"full"}
                boxShadow={"xl"}
              >
                Reset
              </Button>
            </VStack>
            {status && (
              <Alert status={status.type} mt={"5%"}>
                <AlertIcon />
                {status.message}
              </Alert>
            )}
          </form>
        );
      }}
    </Formik>
  );
};
export default ResetPasswordForm;
