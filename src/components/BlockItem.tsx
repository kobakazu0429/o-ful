import type { VFC } from "react";
import {
  AspectRatio,
  Flex,
  Box,
  Image,
  chakra,
  Tooltip,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";

interface Props {
  coverImageUrl: string;
  name: string;
  price: number;
}

export const BlockItem: VFC<Props> = ({ coverImageUrl, name, price }) => {
  return (
    <WrapItem w="220px">
      <Box
        bg={useColorModeValue("white", "gray.800")}
        w={220}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
      >
        <AspectRatio ratio={1}>
          <Image
            src={coverImageUrl}
            alt={`Picture of ${name}`}
            roundedTop="lg"
            fit="cover"
          />
        </AspectRatio>

        <Box p="6">
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {name ?? "no name"}
            </Box>
            <Tooltip
              label="Add to cart"
              bg="white"
              placement={"top"}
              color={"gray.800"}
              fontSize={"1.2em"}
            >
              <chakra.a href={"#"} display={"flex"}></chakra.a>
            </Tooltip>
          </Flex>

          <Flex justifyContent="space-between" alignContent="center">
            <Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
              <Box as="span" color={"gray.600"} fontSize="lg">
                &yen;
              </Box>
              {price}
            </Box>
          </Flex>
        </Box>
      </Box>
    </WrapItem>
  );
};
