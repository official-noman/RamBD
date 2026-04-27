import Link from "next/link";
import Box from "@component/Box";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import Typography, { Paragraph } from "@component/Typography";
import { FaFacebookF, FaWhatsapp, FaYoutube, FaInstagram } from "react-icons/fa";

// STYLED COMPONENTS
import { StyledLink } from "./styles";
// CUSTOM DATA
import { usefulLinks, generalLinks, iconList } from "./data";

export default function Footer1() {
  return (
    <Box as="footer" bg="#0F3460">
      <Container p="1rem" color="white">
        <Box py="5rem" overflow="hidden">
          <Grid container spacing={6}>
            <Grid item lg={4} md={6} sm={6} xs={12}>
              <Link href="/">
                <Image
                  alt="RamBD Logo"
                  mb="1.25rem"
                  src="/assets/images/rambd_logo.webp"
                  height={80}
                />
              </Link>
              <Typography py="0.3rem" mb="1rem" color="gray.500">
                Phone: +880 1847-117888
              </Typography>
            </Grid>

            <Grid item lg={2} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                USEFUL LINK
              </Typography>

              <div>
                {usefulLinks.map((item, ind) => (
                  <StyledLink href="/" key={ind}>
                    {item}
                  </StyledLink>
                ))}
              </div>
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                LINK
              </Typography>

              <div>
                {generalLinks.map((item, ind) => (
                  <StyledLink href="/" key={ind}>
                    {item}
                  </StyledLink>
                ))}
              </div>
            </Grid>

            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Typography mb="1.25rem" lineHeight="1" fontSize={20} fontWeight="600">
                FOLLOW US
              </Typography>

              <FlexBox className="flex" mx="-5px">
                {iconList.map((item) => {
                  const getSocialConfig = (name: string) => {
                    switch (name) {
                      case "facebook":
                        return { color: "#1877F2", Icon: FaFacebookF };
                      case "whatsapp":
                        return { color: "#25D366", Icon: FaWhatsapp };
                      case "youtube":
                        return { color: "#FF0000", Icon: FaYoutube };
                      case "instagram":
                        return { color: "#E4405F", Icon: FaInstagram };
                      default:
                        return { color: "rgba(255,255,255,0.2)", Icon: null };
                    }
                  };

                  const { color, Icon: SocialIcon } = getSocialConfig(item.iconName);

                  return (
                    <a
                      href={item.url}
                      target="_blank"
                      key={item.iconName}
                      rel="noreferrer noopenner">
                      <Box
                        m="5px"
                        p="10px"
                        borderRadius="50%"
                        bg={color}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {SocialIcon && <SocialIcon size={20} color="white" />}
                      </Box>
                    </a>
                  );
                })}
              </FlexBox>
            </Grid>
          </Grid>
        </Box>

        <Box py="1rem" borderTop="1px solid rgba(255,255,255,0.1)">
          <Typography color="gray.500" textAlign="center" fontSize={14}>
            Copyright © 2026 RamBD. All rights reserved |{" "}
            <a href="https://iglweb.com/web/domains-services.php" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
              Domain Registration by: IGL Web Ltd.
            </a>{" "}
            |{" "}
            <a href="https://iglweb.com/web/hosting-regular-shared.php" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
              Web Hosting by: IGL Web Ltd.
            </a>{" "}
            |{" "}
            <a href="https://iglweb.com/web/web-development.php" target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
              Web Design & Development by: IGL Web Ltd
            </a>
          </Typography>

          <Typography color="gray.500" textAlign="center" fontSize={14} mt="5px">
            A Concern of{" "}
            <a href="https://iglgroup.org/" target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 600 }}>
              IGL Group
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
