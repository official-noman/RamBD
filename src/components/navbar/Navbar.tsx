"use client";

import { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
// GLOBAL CUSTOM COMPONENTS
import Card from "../Card";
import Icon from "../icon/Icon";
import FlexBox from "../FlexBox";
import NavLink from "../nav-link";
import MenuItem from "../MenuItem";
import Container from "../Container";
import Box from "../Box";
import { Span } from "../Typography";
// API UTILS
import navbarApi from "@utils/__api__/navbar";
// STYLED COMPONENTS
import StyledNavbar from "./styles";
// DATA
import navbarNavigations from "@data/navbarNavigations";

// ==============================================================
interface Nav {
  url: string;
  child?: Nav[];
  title: string;
  isHome?: boolean;
}

interface SubCategory {
  id: number | string;
  cate_name: string;
  cate_slug: string;
  sub_categories?: SubCategory[];
  category_sub_categories?: SubCategory[];
  children?: SubCategory[];
}

interface Category {
  id: number | string;
  cate_name: string;
  cate_slug: string;
  sub_categories?: SubCategory[];
  category_sub_categories?: SubCategory[];
  children?: SubCategory[];
}

interface MenuItemData {
  id: number | string;
  checked: number | string;
  is_mega_menu: number | string;
  menu_order: number | string;
  category: Category;
}

type NavbarProps = { navListOpen?: boolean; categories?: any };
// ==============================================================

export default function Navbar({ navListOpen, categories: initialData }: NavbarProps) {
  const [navItems, setNavItems] = useState<Nav[]>([{ title: "Home", url: "/" }]);

  useEffect(() => {
    const processData = (data: any) => {
      if (!data || !data.menu || !Array.isArray(data.menu)) return;

      // 1. Filter: only checked items (includes exactly the 15 categories from user image)
      const filteredMenus = data.menu.filter(
        (m: MenuItemData) => Number(m.checked) === 1
      );

      // 2. Sort: menu_order
      const sortedMenus = filteredMenus.sort(
        (a: MenuItemData, b: MenuItemData) => Number(a.menu_order) - Number(b.menu_order)
      );

      // 3. Create a map of children by parent_id
      const childMap: Record<string | number, any[]> = {};
      if (Array.isArray(data.subCategory)) {
        data.subCategory.forEach(sub => {
          if (sub.parent_id) {
            if (!childMap[sub.parent_id]) childMap[sub.parent_id] = [];
            childMap[sub.parent_id].push(sub);
          }
        });
      }

      // 4. Map to Nav structure recursive
      const mapSubCategories = (subs?: any[], parentPath = ""): Nav[] | undefined => {
        return subs?.map(sub => {
          // Check standard nesting first, then fallback to manual lookup
          const children = sub.sub_categories || sub.category_sub_categories || sub.children || childMap[sub.id];
          const currentPath = parentPath ? `${parentPath}/${sub.cate_slug}` : sub.cate_slug;
          return {
            title: sub.cate_name,
            url: `/category/${currentPath}`,
            child: mapSubCategories(children, currentPath)
          };
        });
      };

      const mappedNavs: Nav[] = sortedMenus.map((m: MenuItemData) => {
        const parentPath = m.category.cate_slug;
        return {
          title: m.category.cate_name,
          url: `/category/${parentPath}`,
          child: mapSubCategories(m.category.sub_categories || m.category.category_sub_categories || m.category.children || childMap[m.category.id], parentPath)
        };
      });

      console.log("Navbar Items:", mappedNavs);
      setNavItems([{ title: "Home", url: "/", isHome: true }, ...mappedNavs]);
    };

    if (initialData && initialData.menu) {
      processData(initialData);
    } else {
      const fetchServices = async () => {
        try {
          const data = await navbarApi.getNavbarServices();
          processData(data);
        } catch (error) {
          console.error("Failed to fetch navbar services:", error);
        }
      };
      fetchServices();
    }
  }, [initialData]);

  const renderNestedNav = (list: Nav[], isRoot = false) => {
    return list?.map((nav: Nav, index: number) => {
      const key = `${nav.title}-${index}`;

      if (isRoot) {
        if (nav.isHome) {
          return (
            <NavLink className="nav-link" href={nav.url} key={key} aria-label="Go to Home" style={{ display: "flex", alignItems: "center" }}>
              <AiOutlineHome size={18} />
            </NavLink>
          );
        }

        if (nav.child && nav.child.length > 0) {
          return (
            <FlexBox
              className="root"
              position="relative"
              flexDirection="column"
              alignItems="center"
              key={key}
            >
              <NavLink href={nav.url}>
                <FlexBox alignItems="center" style={{ cursor: "pointer" }}>
                  <Span className="nav-link">{nav.title}</Span>
                  <Icon size="8px" defaultcolor="currentColor" ml="5px">
                    chevron-down
                  </Icon>
                </FlexBox>
              </NavLink>

              <div className="root-child">
                <Card
                  borderRadius={8}
                  py="0.5rem"
                  boxShadow="large"
                  minWidth="180px"
                  style={{ zIndex: 100, overflow: "visible" }}
                >
                  {renderNestedNav(nav.child)}
                </Card>
              </div>
            </FlexBox>
          );
        }

        return (
          <NavLink className="nav-link" href={nav.url} key={key}>
            <Span className="nav-link">{nav.title}</Span>
          </NavLink>
        );
      } else {
        if (nav.child && nav.child.length > 0) {
          return (
            <div className="parent" key={key} style={{ position: "relative" }}>
              <NavLink href={nav.url}>
                <MenuItem style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Span className="nav-link">{nav.title}</Span>
                  <Icon size="8px" defaultcolor="currentColor" ml="5px">
                    chevron-right
                  </Icon>
                </MenuItem>
              </NavLink>

              <div className="child">
                <Card
                  borderRadius={8}
                  py="0.5rem"
                  boxShadow="large"
                  minWidth="230px"
                  style={{ zIndex: 100, overflow: "visible" }}
                >
                  {renderNestedNav(nav.child)}
                </Card>
              </div>
            </div>
          );
        }

        return (
          <NavLink href={nav.url} key={key}>
            <MenuItem>
              <Span className="nav-link">{nav.title}</Span>
            </MenuItem>
          </NavLink>
        );
      }
    });
  };

  return (
    <StyledNavbar>
      <Container height="100%" display="flex" alignItems="center">
        <FlexBox
          width="100%"
          px="15px"
          className="nav-list-wrapper"
          justifyContent="flex-start"
          style={{ gap: 20 }}
        >
          {renderNestedNav(navItems, true)}
        </FlexBox>
      </Container>
    </StyledNavbar>
  );
}
