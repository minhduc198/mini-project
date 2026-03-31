import { toast as hotToast } from "react-hot-toast";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { createElement } from "react";

const BASE_STYLE: React.CSSProperties = {
  background: "#0F0F1C",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
  fontWeight: 500,
  color: "rgba(255,255,255,0.75)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  maxWidth: "360px",
};

export const toast = {
  success: (message: string) =>
    hotToast.custom(
      createElement(
        "div",
        {
          style: {
            ...BASE_STYLE,
            borderColor: "rgba(16,185,129,0.25)",
            background: "linear-gradient(135deg, #0F0F1C 0%, #0d1a14 100%)",
          },
        },
        createElement(
          "span",
          {
            style: {
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(16,185,129,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          createElement(CheckCircle, {
            size: 14,
            color: "#34d399",
            strokeWidth: 2,
          }),
        ),
        createElement(
          "span",
          { style: { color: "rgba(255,255,255,0.80)" } },
          message,
        ),
      ),
      { duration: 3000 },
    ),

  error: (message: string) =>
    hotToast.custom(
      createElement(
        "div",
        {
          style: {
            ...BASE_STYLE,
            borderColor: "rgba(239,68,68,0.25)",
            background: "linear-gradient(135deg, #0F0F1C 0%, #1a0d0d 100%)",
          },
        },
        createElement(
          "span",
          {
            style: {
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(239,68,68,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          createElement(XCircle, {
            size: 14,
            color: "#f87171",
            strokeWidth: 2,
          }),
        ),
        createElement(
          "span",
          { style: { color: "rgba(255,255,255,0.80)" } },
          message,
        ),
      ),
      { duration: 4500 },
    ),

  info: (message: string) =>
    hotToast.custom(
      createElement(
        "div",
        {
          style: {
            ...BASE_STYLE,
            borderColor: "rgba(139,92,246,0.25)",
            background: "linear-gradient(135deg, #0F0F1C 0%, #110d1a 100%)",
          },
        },
        createElement(
          "span",
          {
            style: {
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(139,92,246,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          createElement(Info, {
            size: 14,
            color: "#a78bfa",
            strokeWidth: 2,
          }),
        ),
        createElement(
          "span",
          { style: { color: "rgba(255,255,255,0.80)" } },
          message,
        ),
      ),
      { duration: 3000 },
    ),
};
