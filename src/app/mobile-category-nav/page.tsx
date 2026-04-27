"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
// GLOBAL CUSTOM COMPONENTS
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import { Header } from "@component/header";
import Scrollbar from "@component/Scrollbar";
import Typography from "@component/Typography";
import MobileNavigationBar from "@component/mobile-navigation";
import { Accordion, AccordionHeader } from "@component/accordion";
// CUSTOM HOOK
import useWindowSize from "@hook/useWindowSize";
// API UTILS
import navbarApi from "@utils/__api__/navbar";

import { MobileCategoryNavStyle } from "./styles";
import MobileCategoryImageBox from "./MobileCategoryImageBox";

// ==============================================================
interface NavItem {
  title: string;
  icon: string;
  href: string;
  children?: NavItem[];
}
// ==============================================================

export default function MobileCategoryNav() {
  const router = useRouter();
  const width = useWindowSize();
  const [category, setCategory] = useState<NavItem | null>(null);
  const [navList, setNavList] = useState<NavItem[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<NavItem[]>([]);

  useEffect(() => {
    if (width > 900) {
      router.push("/");
    }
  }, [width, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await navbarApi.getNavbarServices();
        if (!data || !data.menu) return;

        const filteredMenus = data.menu.filter((m: any) => Number(m.checked) === 1);
        const sortedMenus = filteredMenus.sort((a: any, b: any) => Number(a.menu_order) - Number(b.menu_order));

        const childMap: Record<string | number, any[]> = {};
        if (Array.isArray(data.subCategory)) {
          data.subCategory.forEach((sub: any) => {
            if (sub.parent_id) {
              if (!childMap[sub.parent_id]) childMap[sub.parent_id] = [];
              childMap[sub.parent_id].push(sub);
            }
          });
        }

        const iconMapper: Record<string, string> = {
          "microphone": "fas fa-microphone",
          "trypod": "fas fa-video",
          "gadgets": "fas fa-mobile-screen",
          "converter": "fas fa-plug",
          "electronics": "fas fa-laptop",
          "watch": "fas fa-stopwatch",
          "camera": "fas fa-camera",
          "headphones": "fas fa-headphones"
        };

        const getIconClass = (iconStr: string, catName: string) => {
          let iconClass = iconStr || "";
          const nameLower = catName.toLowerCase();

          if (iconClass.includes("<i class=")) {
            const match = iconClass.match(/class="([^"]+)"/);
            if (match && match[1]) iconClass = match[1];
          } else if (iconMapper[nameLower]) {
            iconClass = iconMapper[nameLower];
          } else if (iconClass && !iconClass.startsWith("fa")) {
            // If it's a simple word like "heart" or "user", prepend fas fa-
            iconClass = `fas fa-${iconClass.toLowerCase().replace(/\s+/g, "-")}`;
          }

          // Return as HTML if it's already HTML or starts with fa (mapped/extracted)
          if (iconClass.startsWith("fa")) return `<i class="${iconClass}"></i>`;
          if (iconClass.startsWith("<i")) return iconClass;

          return '<i class="fas fa-th-large"></i>'; // Default fallback
        };

        const mapSubCategories = (subs?: any[], parentPath = ""): NavItem[] | undefined => {
          return subs?.map(sub => {
            const children = sub.sub_categories || sub.category_sub_categories || sub.children || childMap[sub.id];
            const currentPath = parentPath ? `${parentPath}/${sub.cate_slug}` : sub.cate_slug;
            return {
              title: sub.cate_name,
              href: `/category/${currentPath}`,
              icon: getIconClass(sub.cate_icon, sub.cate_name),
              children: mapSubCategories(children, currentPath)
            };
          });
        };

        const mappedNavs: NavItem[] = sortedMenus.map((m: any) => {
          const parentPath = m.category?.cate_slug || "";
          return {
            title: m.category?.cate_name || "Category",
            href: `/category/${parentPath}`,
            icon: getIconClass(m.category?.cate_icon, m.category?.cate_name),
            children: mapSubCategories(m.category?.sub_categories || m.category?.category_sub_categories || m.category?.children || childMap[m.category?.id], parentPath)
          };
        });

        setNavList(mappedNavs);
        if (mappedNavs.length > 0) {
          setCategory(mappedNavs[0]);
          setSubCategoryList(mappedNavs[0].children || []);
        }
      } catch (error) {
        console.error("Failed to fetch mobile nav categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cat: NavItem) => () => {
    setSubCategoryList(cat.children || []);
    setCategory(cat);
  };

  return (
    <MobileCategoryNavStyle>
      <Header className="header" />

      <div className="main-category-holder">
        <Scrollbar>
          {navList.map((item) => (
            <div
              key={item.title}
              className={clsx({ "main-category-box": true, active: category?.href === item.href })}
              onClick={handleCategoryClick(item)}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "0.5rem",
                  color: category?.href === item.href ? "inherit" : "#7d879c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />

              <Typography className="ellipsis" textAlign="center" fontSize="11px" lineHeight="1">
                {item.title}
              </Typography>
            </div>
          ))}
        </Scrollbar>
      </div>

      <div className="container">
        <Typography fontWeight="600" fontSize="15px" mb="1rem">
          {category?.title || "Categories"}
        </Typography>

        <Box mb="2rem">
          <Grid container spacing={3}>
            {subCategoryList.filter(sub => !sub.children || sub.children.length === 0).map((item, ind) => (
              <Grid item lg={1} md={2} sm={3} xs={6} key={ind}>
                <Link href={item.href}>
                  <MobileCategoryImageBox title={item.title} icon={item.icon} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        {subCategoryList.filter(sub => sub.children && sub.children.length > 0).map((item, ind) => (
          <Fragment key={ind}>
            <Divider />
            <Accordion expanded={true}>
              <AccordionHeader px="0px" py="10px">
                <Typography fontWeight="600" fontSize="15px">
                  {item.title}
                </Typography>
              </AccordionHeader>

              <Box mb="2rem" mt="0.5rem">
                <Grid container spacing={3}>
                  {item.children?.map((subItem: any, subInd: number) => (
                    <Grid item lg={1} md={2} sm={3} xs={6} key={subInd}>
                      <Link href={subItem.href}>
                        <MobileCategoryImageBox title={subItem.title} icon={subItem.icon} />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Accordion>
          </Fragment>
        ))}
      </div>

      <MobileNavigationBar />
    </MobileCategoryNavStyle>
  );
}
