import React from "react";
import { Flex } from "@chakra-ui/react";

type props = {
  children: React.ReactNode;
  columnsCount: number;
};

const divideArray = (array: Array<React.ReactNode>, columnsAmount: number) => {
  const newArray = [...array];
  const divideRes = Math.floor(newArray.length / columnsAmount);
  let results = [];

  for (let i = 0; i < columnsAmount; i++) {
    results.push(newArray.splice(0, divideRes));
  }

  for (let i = 0; i < newArray.length; i++) {
    results[i].push(newArray[i]);
  }
  results = results.filter((itm) => itm.length);

  return results;
};

const gap = 4;

const Masonry = ({ children, columnsCount }: props) => {
  const childrenElements = React.Children.toArray(children);
  const columns = divideArray(childrenElements, columnsCount);

  return (
    <Flex justifyContent={"center"} gap={gap} p={gap} as={"aside"}>
      {columns.map((items, index) => {
        return (
          <Flex flexDirection={"column"} key={index} as={"section"} gap={gap}>
            {items}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default Masonry;
