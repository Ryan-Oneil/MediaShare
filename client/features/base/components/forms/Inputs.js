import React, { useRef } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
} from "@chakra-ui/react";

export const LabeledInput = (props) => {
  const { label, error, touched, icon } = props;
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel color={"#999999"} mb={0} pl={3}>
        {label}
      </FormLabel>
      <InputGroup>
        {icon && <InputLeftElement pointerEvents="none" children={icon} />}
        <Input {...props} />
      </InputGroup>
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export const FileInput = (props) => {
  const { error, touched, buttonText } = props;
  const ref = useRef();

  return (
    <FormControl isInvalid={error && touched}>
      <Button onClick={() => ref.current.click()}>{buttonText}</Button>
      <Input
        size="lg"
        {...props}
        type={"file"}
        ref={ref}
        display={"none"}
        value={""}
      />
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export const TextAreaInput = (props) => {
  const { error, touched, label } = props;
  const isInvalid = error && touched;

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Textarea size="lg" {...props} isInvalid={isInvalid} />
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
