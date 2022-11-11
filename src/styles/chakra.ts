import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#1A202C",
      200: "#293245",
    },
  },
  components: {
    Button: {
      variants: {
        brand: {
          fontWeight: 600,
          color: "white",
          bg: "brand.100",
          _hover: {
            bg: "brand.200",
            _disabled: {
              bg: "brand.200",
            },
          },
          _active: {
            bg: "brand.100",
          },
        },
      },
    },
  },
});
