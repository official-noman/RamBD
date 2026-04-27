import Link from "next/link";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
// STYLED COMPONENT
import { StyledMiniCart } from "./styles";

// ==============================================================
type MiniCartProps = { toggleSidenav?: () => void };
// ==============================================================

export default function MiniCart({ toggleSidenav = () => { } }: MiniCartProps) {
  const { state, dispatch } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCartAmountChange = (amount: number, product: any) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: { ...product, qty: amount }
    });
  };

  const getTotalPrice = () => {
    return state.cart.reduce((accumulator, item) => accumulator + item.price * item.qty, 0) || 0;
  };

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {isMounted ? state.cart.reduce((acc, item) => acc + item.qty, 0) : 0} items
          </Typography>
        </FlexBox>

        <Divider />

        {isMounted && !!!state.cart.length && (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 80px)">
            <Image src="/assets/images/logos/shopping-bag.svg" width={90} height={90} alt="Empty Cart" />
            <Paragraph mt="1rem" color="text.muted" textAlign="center" maxWidth="200px">
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        )}

        {isMounted && state.cart.map((item) => (
          <Fragment key={item.id}>
            <div className="cart-item">
              <Link href={`/pro/${item.slug}`}>
                <Avatar
                  size={76}
                  mr="1rem"
                  alt={item.name}
                  src={item.imgUrl || "/assets/images/products/iphone-x.png"}
                />
              </Link>

              <div className="product-details">
                <Link href={`/pro/${item.slug}`}>
                  <H5 className="title" fontSize="14px">
                    {item.name}
                  </H5>
                </Link>

                <Tiny color="text.muted">
                  {currency(item.price, 0)} x {item.qty}
                </Tiny>

                <Typography fontWeight={600} fontSize="14px" color="primary.main" mt="4px">
                  {currency(item.qty * item.price)}
                </Typography>

                <FlexBox alignItems="center" mt="0.5rem">
                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange(item.qty - 1, item)}>
                    <Icon variant="small">minus</Icon>
                  </Button>

                  <Typography fontWeight={600} fontSize="15px" mx="1rem">
                    {item.qty}
                  </Typography>

                  <Button
                    size="none"
                    padding="5px"
                    color="primary"
                    variant="outlined"
                    borderRadius="300px"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange(item.qty + 1, item)}>
                    <Icon variant="small">plus</Icon>
                  </Button>
                </FlexBox>
              </div>

              <Icon
                size="1rem"
                ml="1.25rem"
                className="clear-icon"
                onClick={handleCartAmountChange(0, item)}>
                close
              </Icon>
            </div>
            <Divider />
          </Fragment>
        ))}
      </div>

      {isMounted && !!state.cart.length && (
        <div className="actions">
          <Link href="/checkout">
            <Button
              fullwidth
              color="primary"
              variant="contained"
              onClick={toggleSidenav}
              style={{ backgroundColor: "#28a745", textTransform: "lowercase", padding: "12px" }}>
              <FlexBox alignItems="center" justifyContent="center" width="100%">
                <Typography fontWeight={600} mr="10px">
                  processed to checkout
                </Typography>
                <Icon size="1.25rem">credit-card</Icon>
              </FlexBox>
            </Button>
          </Link>

          <Link href="/cart">
            <Button fullwidth color="primary" variant="outlined" mt="1rem" onClick={toggleSidenav}>
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </div>
      )}
    </StyledMiniCart>
  );
}
