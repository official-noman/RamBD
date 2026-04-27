"use client";

import { FaWhatsapp } from "react-icons/fa";
import Box from "@component/Box";
import { SemiSpan } from "@component/Typography";

const FloatingWhatsApp = () => {
    return (
        <Box
            position="fixed"
            bottom={30}
            right={30}
            zIndex={100}
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ cursor: "pointer", filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.3))" }}>
            <a
                href="https://whatsapp.com/channel/0029Vb6w51fADTOId5PTaH2D"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on WhatsApp"
                style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box
                    bg="#25D366"
                    borderRadius="50%"
                    p="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <FaWhatsapp size={40} color="white" />
                </Box>
                <SemiSpan fontWeight="700" color="secondary.main" mt="5px" style={{ fontSize: 13, background: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: "10px" }}>
                    Follow us
                </SemiSpan>
            </a>
        </Box>
    );
};

export default FloatingWhatsApp;
