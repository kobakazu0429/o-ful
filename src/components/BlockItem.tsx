import type { VFC } from "react";
import {
  AspectRatio,
  Box,
  Image,
  Text,
  Heading,
  WrapItem,
} from "@chakra-ui/react";
import { formatPrice } from "../utils/price";
import { cloudinaryUrlReplace } from "../lib/cloudinary";

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
              src={cloudinaryUrlReplace(coverImageUrl, {
                resize: { width: 220 },
              })}
              alt={`Picture of ${name}`}
              roundedTop="lg"
              fit="cover"
              loading="lazy"
            />
          </AspectRatio>
        </Box>

        <Box pt="3" px="3">
          <Heading
            fontSize={{ base: "xs", md: "2xl" }}
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
            {formatPrice(price)}
          </Text>
        </Box>
      </Box>
    </WrapItem>
  );
};
