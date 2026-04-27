"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// REACT ICONS
import { FaFacebookF, FaWhatsapp, FaTelegramPlane, FaLink, FaPhoneAlt, FaPlus, FaMinus, FaYoutube, FaInstagram, FaChevronRight } from "react-icons/fa";
import { IoCartOutline, IoBagCheckOutline } from "react-icons/io5";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Avatar from "@component/avatar";
import Typography, { H1, H3, H4, SemiSpan, Paragraph, Span } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency, calculateDiscount } from "@utils/utils";
import Product from "models/product.model";
import { theme } from "@utils/theme";

// ========================================
interface Props {
  price: number;
  regularPrice?: number;
  title: string;
  images: string[];
  id: string | number;
  brand?: string;
  status?: string;
  model?: string;
  product_code?: string;
  categoryName?: string;
  category_slug?: string;
  visitors?: number;
  discount?: number;
  slug: string;
  delivery_charge?: number;
}
// ========================================

export default function ProductIntro({
  images,
  title,
  price,
  regularPrice,
  id,
  brand,
  status,
  model,
  product_code,
  categoryName,
  category_slug,
  visitors,
  discount,
  slug,
  delivery_charge
}: Props) {
  const router = useRouter();
  const param = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setIsMounted(true);
  }, []);

  // ZOOM STATE
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  const routerId = param.slug as string;
  const cartItem = state.cart.find((item) => item.id === id || item.slug === slug);

  // Sync quantity with cart
  useEffect(() => {
    if (cartItem?.qty) {
      setQuantity(cartItem.qty);
    }
  }, [cartItem?.qty]);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = (amount: number) => {
    // const discountedPrice = discount ? price - (price * discount) / 100 : price;

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        price: price, // Use the pre-calculated final price
        originalPrice: regularPrice || price,
        regularPrice: regularPrice, // Added regularPrice
        discount: discount,
        qty: amount,
        name: title,
        imgUrl: images[0],
        id: id,
        slug: slug,
        delivery_charge: delivery_charge
      }
    });
  };

  const handleBuyNow = () => {
    handleCartAmountChange(quantity);
    router.push("/checkout");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  // FAKE WATCHING COUNT BASED ON VISITORS
  const watchingCount = visitors ? (visitors % 15) + 3 : 5;

  return (
    <Box bg="white" pt="8px" px="1.5rem" pb="1.5rem" borderRadius={8} shadow={1}>
      {/* BREADCRUMBS */}
      {isMounted && (
        <FlexBox mb="12px" alignItems="center" style={{ gap: 8 }} flexWrap="wrap">
          <Link href="/">
            <SemiSpan color="gray.600" className="cursor-pointer">
              Home
            </SemiSpan>
          </Link>
          <SemiSpan color="gray.500" mx="2px">/</SemiSpan>

          {categoryName ? (
            categoryName.split("/").map((catName, idx, arr) => {
              const trimmedCatName = catName.trim();
              if (!trimmedCatName) return null;

              const isLast = idx === arr.length - 1;
              const linkTarget = (isLast && category_slug)
                ? `/product/search/${category_slug}`
                : `/product/search/${trimmedCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                  <Link href={linkTarget}>
                    <SemiSpan color="gray.600" className="cursor-pointer">
                      {trimmedCatName}
                    </SemiSpan>
                  </Link>
                  <SemiSpan color="gray.500" mx="2px">/</SemiSpan>
                </div>
              );
            })
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href={category_slug ? `/product/search/${category_slug}` : "#"}>
                <SemiSpan color="gray.600" className="cursor-pointer">
                  Category
                </SemiSpan>
              </Link>
              <SemiSpan color="gray.500" mx="2px">/</SemiSpan>
            </div>
          )}

          <SemiSpan color="gray.900" fontWeight="600">
            {model || title}
          </SemiSpan>
        </FlexBox>
      )}

      <FlexBox flexWrap="wrap" style={{ gap: 2 }}>
        {/* IMAGE GALLERY */}
        <Box width="100%" maxWidth={{ md: "550px", xs: "100%" }}>
          <FlexBox
            mb="2px"
            overflow="hidden"
            borderRadius={8}
            border="1px solid"
            borderColor="gray.300"
            justifyContent="center"
            position="relative"
            bg="white"
            style={{
              cursor: "zoom-in",
              maxWidth: 550,
              height: 425,
              width: "100%",
              marginBottom: "2px"
            }}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              width={550}
              height={425}
              src={images[selectedImage]}
              priority
              alt={title}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* ZOOM OVERLAY */}
            {showZoom && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                bg="white"
                style={{
                  zIndex: 10,
                  backgroundImage: `url(${images[selectedImage]})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "250%",
                  backgroundRepeat: "no-repeat",
                  pointerEvents: "none",
                  borderRadius: 8
                }}
              />
            )}
          </FlexBox>

          <FlexBox style={{ gap: 2 }} overflow="auto">
            {images.map((url, ind) => (
              <Box
                key={ind}
                size={80}
                bg="white"
                minWidth={80}
                display="flex"
                cursor="pointer"
                border="1px solid"
                borderRadius="4px"
                alignItems="center"
                justifyContent="center"
                borderColor={selectedImage === ind ? "primary.main" : "gray.300"}
                onClick={handleImageClick(ind)}>
                <Avatar src={url} borderRadius="4px" size={75} />
              </Box>
            ))}
          </FlexBox>
        </Box>

        {/* PRODUCT INFO */}
        <Box flex="1 1 0" minWidth={{ md: 300, xs: "100%" }} p="0px" pl="1.5rem">
          <H1
            mb="0.75rem"
            color="secondary.main"
            fontSize="20px"
            fontWeight="700"
            style={{
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
            {title}
          </H1>

          <FlexBox alignItems="center" mb="1rem">
            <H3 color="primary.main" mr="12px" fontWeight="700">
              {currency(price)}
            </H3>
            {(discount > 0) && (
              <SemiSpan color="text.muted" fontWeight="600">
                <del>{currency(regularPrice || price)}</del>
              </SemiSpan>
            )}
          </FlexBox>

          <Box mb="1.5rem">
            <FlexBox alignItems="center" mb="8px">
              <SemiSpan color="text.muted" mr="8px">In Stock:</SemiSpan>
              <SemiSpan fontWeight="600" color="success.main">{status || "Yes"}</SemiSpan>
            </FlexBox>

            {Number(delivery_charge) === 1 && (
              <div style={{
                marginTop: "12px",
                marginBottom: "12px",
                display: "inline-block",
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "bold",
                border: "1px solid #c8e6c9"
              }}>
                <i className="fas fa-truck" style={{ marginRight: "8px" }}></i> 
                Free Delivery
              </div>
            )}

            <FlexBox alignItems="center" mb="8px">
              <SemiSpan color="text.muted" mr="8px">Model:</SemiSpan>
              <SemiSpan fontWeight="600">{model || "N/A"}</SemiSpan>
            </FlexBox>

            <FlexBox alignItems="center" mb="8px">
              <SemiSpan color="text.muted" mr="8px">Brand:</SemiSpan>
              <SemiSpan fontWeight="600">{brand || "Felna Tech"}</SemiSpan>
            </FlexBox>

            <FlexBox alignItems="center" mb="8px">
              <SemiSpan color="text.muted" mr="8px">Code:</SemiSpan>
              <SemiSpan fontWeight="600">{product_code || id}</SemiSpan>
            </FlexBox>

            <FlexBox alignItems="center" mb="20px" mt="20px">
              <SemiSpan fontWeight="700" color="secondary.main" mr="8px">Category:</SemiSpan>
              <SemiSpan fontWeight="700" color="text.muted">{categoryName || "General"}</SemiSpan>
            </FlexBox>

            <FlexBox alignItems="center" mt="20px" bg="gray.100" p="8px 12px" borderRadius="8px" style={{ width: "fit-content" }}>
              <Icon size="18px" color="primary" mr="10px">eye</Icon>
              <SemiSpan fontWeight="600" color="success.main">
                {watchingCount} people are watching this product now
              </SemiSpan>
            </FlexBox>
          </Box>

          {/* QUANTITY AND BUTTONS IN ONE ROW */}
          <Box mb="1.5rem">
            <SemiSpan fontWeight="600" mb="8px" display="block">Quantity:</SemiSpan>
            <FlexBox alignItems="center" flexWrap="wrap" style={{ gap: 2 }}>
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                borderRadius="4px"
                style={{
                  border: `1px solid ${theme && theme.colors && theme.colors.gray ? theme.colors.gray[300] : "#E3E9EF"
                    }`,
                  width: 100,
                  height: 40
                }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    const newQty = Math.max(1, (cartItem?.qty || quantity) - 1);
                    setQuantity(newQty);
                    if (cartItem) {
                      handleCartAmountChange(newQty);
                    }
                  }}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <FaMinus size={12} />
                </Button>
                <H3 fontSize={16} fontWeight="600" style={{ flex: 1, textAlign: 'center' }}>{isMounted && cartItem?.qty ? cartItem.qty : quantity}</H3>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    const newQty = (cartItem?.qty || quantity) + 1;
                    setQuantity(newQty);
                    if (cartItem) {
                      handleCartAmountChange(newQty);
                    }
                  }}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <FaPlus size={12} />
                </Button>
              </FlexBox>

              <Button
                size="medium"
                color="primary"
                variant="contained"
                onClick={() => handleCartAmountChange(cartItem?.qty || quantity)}
                style={{ padding: '0 15px', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoCartOutline size={20} style={{ marginRight: 6 }} />
                <Span fontSize={13} fontWeight="600">ADD TO CART</Span>
              </Button>

              <Button
                size="medium"
                color="secondary"
                variant="contained"
                onClick={handleBuyNow}
                style={{ padding: '0 15px', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IoBagCheckOutline size={18} style={{ marginRight: 6 }} />
                <Span fontSize={13} fontWeight="600">BUY NOW</Span>
              </Button>
            </FlexBox>
          </Box>

          <Box mb="1.5rem">
            <FlexBox alignItems="center" style={{ gap: 10 }}>
              <SemiSpan fontWeight="600" color="secondary.main">For Inquiry: +880-1958-666975</SemiSpan>
              <a href="https://wa.me/8801847117888" target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#25D366" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                  <FaWhatsapp size={18} color="white" />
                </Box>
              </a>
              <a href="tel:+8801958666975">
                <Box cursor="pointer" bg="#3498DB" borderRadius="50%" p="6px" display="flex" alignItems="center" justifyContent="center">
                  <FaPhoneAlt size={16} color="white" />
                </Box>
              </a>
            </FlexBox>
          </Box>

          <Box>
            <H4 mb="10px">Share This Product On Social Media</H4>
            <FlexBox style={{ gap: 12 }}>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#3B5998" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                  <FaFacebookF size={18} color="white" />
                </Box>
              </a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#25D366" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                  <FaWhatsapp size={20} color="white" />
                </Box>
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#0088CC" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                  <FaTelegramPlane size={18} color="white" />
                </Box>
              </a>
              <a href="https://www.youtube.com/@RamBDLtd" target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#FF0000" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                  <FaYoutube size={18} color="white" />
                </Box>
              </a>
              <a href="https://www.instagram.com/RamBDLtd" target="_blank" rel="noreferrer">
                <Box cursor="pointer" bg="#E4405F" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center">
                  <FaInstagram size={18} color="white" />
                </Box>
              </a>
              <Box cursor="pointer" bg="#7f8c8d" borderRadius="50%" width={35} height={35} display="flex" alignItems="center" justifyContent="center" onClick={copyToClipboard}>
                <FaLink size={16} color="white" />
              </Box>
            </FlexBox>
          </Box>
        </Box>
      </FlexBox>
    </Box>
  );

}
