import React from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  IconButton,
  Stack,
  Tooltip,
  VStack,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { RESET_PASSWORD_URL } from "@/utils/urls";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  OAuthProvider,
} from "firebase/auth";
import { Field, Formik, FormikErrors } from "formik";
import { User } from "../types/User";
import { FaEnvelope, FaGoogle, FaLock, FaMicrosoft } from "react-icons/fa";
import { LabeledInput } from "@/features/base/components/forms/Inputs";
import Link from "next/link";

const provider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  tenant: "88685b40-800d-4d57-9b38-8438ec0f6e3d",
});

const LoginForm = () => {
  const auth = getAuth();

  const onSubmit = (
    formValues: User,
    { setStatus }: { setStatus: Function }
  ) => {
    return signInWithEmailAndPassword(
      auth,
      formValues.email.trim(),
      formValues.password.trim()
    ).catch((error) => {
      const message = error.code || error.message;
      setStatus(message.replace("auth/", "").replaceAll("-", " "));
    });
  };

  const validate = (values: User) => {
    let errors: FormikErrors<User> = {};

    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <Stack spacing={{ base: 2, "2xl": 6 }}>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={onSubmit}
        validate={validate}
      >
        {(props) => {
          const {
            isSubmitting,
            handleSubmit,
            isValid,
            errors,
            status,
            touched,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <VStack spacing={"5%"}>
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
              </VStack>
              {status && (
                <Alert status="error" mt={"5%"} textTransform={"capitalize"}>
                  <AlertIcon />
                  {status}
                </Alert>
              )}
              <Stack spacing={{ base: 4, "2xl": 10 }} mt={2}>
                <Link href={RESET_PASSWORD_URL}>
                  <a style={{ textAlign: "end", color: "#4D4D4D" }}>
                    Forgot Password?
                  </a>
                </Link>
                <Button
                  type="submit"
                  backgroundColor="#90CDF4"
                  size="lg"
                  fontSize="lg"
                  disabled={!isValid || isSubmitting}
                  rounded={"full"}
                  boxShadow={"xl"}
                >
                  Login
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
      <Text textAlign={"center"} color={"#B5B5B5"} fontSize={"lg"} p={2}>
        or sign in with
      </Text>
      <Flex justifyContent={"center"}>
        <ButtonGroup variant="ghost" spacing="2" size={"lg"}>
          <Tooltip label={"Sign in with Google"}>
            <IconButton
              aria-label={"Google Logo"}
              icon={<FaGoogle fontSize={36} />}
              onClick={() => signInWithPopup(auth, provider)}
            />
          </Tooltip>
          <Tooltip label={"Sign in with Microsoft"}>
            <IconButton
              icon={<FaMicrosoft fontSize={36} />}
              aria-label={"Microsoft Logo"}
              onClick={() => signInWithPopup(auth, microsoftProvider)}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};
export default LoginForm;
