import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FieldAttributes } from "formik/dist/Field";

export const LabeledInput = (props: FieldAttributes<any>) => {
  const { label, error, touched, icon } = props;
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel color={"#999999"} mb={0} pl={3}>
        {label}
      </FormLabel>
      <InputGroup>
        {icon && (
          <InputLeftElement pointerEvents="none">{icon}</InputLeftElement>
        )}
        <Input {...props} />
      </InputGroup>
      {error && touched && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
