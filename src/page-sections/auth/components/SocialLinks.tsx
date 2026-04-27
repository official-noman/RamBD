import { Fragment } from "react";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import { Small } from "@component/Typography";

export default function SocialLinks() {
  return (
    <Fragment>
      <FlexBox
        mb="0.75rem"
        height="40px"
        color="white"
        bg="#3B5998"
        borderRadius={5}
        cursor="pointer"
        alignItems="center"
        justifyContent="center">
        <Icon variant="small" defaultcolor="auto" mr="0.5rem">
          facebook-filled-white
        </Icon>

        <Small fontWeight="600">Continue with Facebook</Small>
      </FlexBox>

      <FlexBox
        mb="1.25rem"
        height="40px"
        color="white"
        bg="#4285F4"
        borderRadius={5}
        cursor="pointer"
        alignItems="center"
        justifyContent="center">
        <Icon variant="small" defaultcolor="auto" mr="0.5rem">
          google-1
        </Icon>

        <Small fontWeight="600">Continue with Google</Small>
      </FlexBox>
    </Fragment>
  );
}
