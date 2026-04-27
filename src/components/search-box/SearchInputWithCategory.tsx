import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

import Box from "@component/Box";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import MenuItem from "@component/MenuItem";
import { Span } from "@component/Typography";
import TextField from "@component/text-field";
import StyledSearchBox from "./styled";


// Define the shape of the API response item
interface SearchSuggestion {
  id: number;
  product_name: string;
  slug: string;
  image: string;
}

export default function SearchInputWithCategory() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [resultList, setResultList] = useState<SearchSuggestion[]>([]);

  const search = debounce(async (value: string) => {
    if (!value) {
      setResultList([]);
    } else {
      try {
        const response = await fetch(`https://admin.unicodeconverter.info/products/searchsuggest?search=${value}`);
        const data = await response.json();
        // The API is expected to return an array of suggestions
        if (data.products && Array.isArray(data.products)) {
          const mappedSuggestions = data.products.map((item: any) => ({
            id: item.id,
            product_name: item.pro_title || item.title || "Unknown Product",
            slug: item.pro_slug || item.slug || "",
            image: item.images && item.images.length > 0
              ? `https://admin.unicodeconverter.info/storage/app/public/products/${item.images[0].img_name}`
              : "/assets/images/products/macbook.png"
          }));
          setResultList(mappedSuggestions);
        } else {
          setResultList([]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setResultList([]);
      }
    }
  }, 200);

  const hanldeSearch = useCallback((event: any) => {
    const value = event.target?.value;
    setSearchValue(value);
    search(value);
  }, [search]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue.trim()) {
      router.push(`/product/search/${encodeURIComponent(searchValue.trim())}`);
      setResultList([]);
    }
  };

  const handleDocumentClick = () => setResultList([]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        <TextField
          fullwidth
          value={searchValue}
          onChange={hanldeSearch}
          onKeyDown={handleKeyDown}
          className="search-field"
          placeholder="Search and hit enter..."
        />
      </StyledSearchBox>

      {!!resultList.length && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" zIndex={99} style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {resultList.map((item) => (
            <Link href={`/pro/${item.slug}`} key={item.id}>
              <MenuItem key={item.id}>
                <img
                  src={item.image}
                  alt={item.product_name}
                  style={{ width: 40, height: 40, objectFit: "contain", marginRight: 10 }}
                />
                <Span fontSize="14px">{item.product_name}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
}

// const dummySearchResult = ["Macbook Air 13", "Ksus K555LA", "Acer Aspire X453", "iPad Mini 3"];
