import type { VFC } from "react";
import {
  AspectRatio,
  Box,
  Image,
  Text,
  Heading,
  WrapItem,
} from "@chakra-ui/react";

interface Props {
  coverImageUrl: string;
  name: string;
  price: number;
}

export const BlockItem: VFC<Props> = ({ coverImageUrl, name, price }) => {
  return (
    <WrapItem
      w={{
        base: 150,
        md: 220,
      }}
    >
      <Box
        bg="white"
        w={{
          base: 150,
          md: 220,
        }}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
      >
        <Box>
          <AspectRatio ratio={1}>
            <Image
              src={coverImageUrl}
              alt={`Picture of ${name}`}
              roundedTop="lg"
              fit="cover"
            />
          </AspectRatio>
        </Box>

        <Box pt="3" px="3">
          <Heading
            fontSize="2xl"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {name ?? "no name"}
          </Heading>
        </Box>

        <Box pb="3" px="3">
          <Text fontSize="xl" color="gray.800">
            <Text as="span" color={"gray.600"} fontSize="md">
              &yen;{" "}
            </Text>
            {price}
          </Text>
        </Box>
      </Box>
    </WrapItem>
  );
};
