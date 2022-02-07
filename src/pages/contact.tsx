import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";
import { TextPageLayout, Content } from "../layouts/TextPage";

const Contact: NextPage = () => {
  return (
    <TextPageLayout title="お問い合わせ">
      <Content title="">
        <Box
          minHeight={"1088px"}
          height="full"
          width="full"
          position="relative"
        >
          <iframe
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            src="https://docs.google.com/forms/d/e/1FAIpQLSdnZjhqhdCq7f969UrW21zjTfvjdlPJ_LZYpdM_HJS05PRuvA/viewform?embedded=true"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
          >
            読み込んでいます…
          </iframe>
        </Box>
      </Content>
    </TextPageLayout>
  );
};

export default Contact;
