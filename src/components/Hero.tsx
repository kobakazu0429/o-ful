import type { VFC, FC, ReactNode } from "react";
import { Box, Flex, Heading, Text, Stack, Container } from "@chakra-ui/react";
import { GraduatesIcon } from "../icon/graduates";
import { StudiesIcon } from "../icon/studies";

const Testimonial: VFC<{
  emphasis: string;
  description: string;
  icon: ReactNode;
}> = ({ emphasis, description, icon }) => {
  return (
    <Stack
      maxWidth="330px"
      minWidth={{
        base: "100%",
        md: "calc(100% / 3)",
      }}
    >
      <TestimonialContent>
        <TestimonialHeading emphasis={emphasis} />
        <Text textAlign={"center"} color="gray.600" fontSize={"sm"}>
          {description}
        </Text>
      </TestimonialContent>
      <Flex align={"center"} mt={8} direction={"column"}>
        <Box width={70}>{icon}</Box>
      </Flex>
    </Stack>
  );
};

const TestimonialContent: FC = ({ children }) => {
  return (
    <Stack
      bg="white"
      boxShadow={"lg"}
      py={8}
      px={4}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: "white",
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      marginBottom={"16px"}
    >
      {children}
    </Stack>
  );
};

const TestimonialHeading: VFC<{ emphasis: string }> = ({ emphasis }) => {
  return (
    <Heading as={"h3"} fontSize="xl">
      <Text as={"span"} bgGradient="linear(transparent 70%, yellow.300 70%)">
        {emphasis}
      </Text>
      <Text as={"span"} fontSize="md" fontWeight="semibold">
        {" "}
        あなたに
      </Text>
    </Heading>
  );
};

export const Hero: VFC = () => {
  return (
    <Box bg="gray.100">
      <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={"center"}>
          <Heading textAlign="center">
            <span style={{ display: "inline-block" }}>
              あなたの教科書、誰かに
            </span>
            <span style={{ display: "inline-block" }}>
              使ってもらいませんか？
            </span>
          </Heading>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
          px={{ base: 4, md: 4, lg: 10 }}
          justifyContent={"center"}
        >
          <Testimonial
            emphasis="売りたい"
            description="要らない教科書を捨てるのはもったいない！"
            icon={<GraduatesIcon />}
          />
          <Testimonial
            emphasis="あげたい"
            description="後輩に役立てて欲しい！"
            icon={<GraduatesIcon />}
          />
          <Testimonial
            emphasis="欲しい"
            description="専門の教科書高いんだよなぁ..."
            icon={<StudiesIcon />}
          />
        </Stack>
      </Container>
    </Box>
  );
};
