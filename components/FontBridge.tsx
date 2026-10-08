"use client";

import { useEffect } from "react";

const VARS = ["--font-inter", "--font-space-grotesk", "--font-ibm-plex-mono"] as const;

/** Dev builds can stamp next/font class names that are not in the client CSS, so the variables never get set and the page falls back to a serif. Copy the variables from the stylesheet that actually loaded. */
export default function FontBridge() {
  useEffect(() => {
    const root = document.documentElement;
    const current = getComputedStyle(root);
    if (VARS.every((name) => current.getPropertyValue(name).trim())) return;

    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules) {
        if (!(rule instanceof CSSStyleRule) || !rule.selectorText.includes("__variable_")) continue;
        for (const name of VARS) {
          const value = rule.style.getPropertyValue(name);
          if (value) root.style.setProperty(name, value);
        }
      }
    }
  }, []);

  return null;
}
