import Icon from "@component/icon/Icon";
import Container from "@component/Container";
import { H4, Span } from "@component/Typography";
// STYLED COMPONENTS
import { ServiceItem, Wrapper } from "./styles";
// API FUNCTIONS
import api from "@utils/__api__/market-2";

export default async function Section2() {
  const serviceList = await api.getServices();

  return (
    <Container pt="0px">
      <Wrapper>
        {serviceList.map((item, ind) => (
          <ServiceItem key={ind}>
            <Icon size="40px">{item.icon}</Icon>

            <div>
              <H4 lineHeight={1.3}>{item.title}</H4>
              <Span color="grey.600">{item.description}</Span>
            </div>
          </ServiceItem>
        ))}
      </Wrapper>
    </Container>
  );
}
