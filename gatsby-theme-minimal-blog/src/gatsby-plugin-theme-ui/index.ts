import { merge, ThemeUIStyleObject } from "theme-ui"
import tailwind from "@theme-ui/preset-tailwind"
import { lightThemeVars, darkThemeVars } from "../utils/prism-themes"

declare module "theme-ui" {
  interface Theme {
    copyButton?: ThemeUIStyleObject
    dividers?: ThemeUIStyleObject
    card?: ThemeUIStyleObject
    cardWithP?: ThemeUIStyleObject
  }
}

const theme = merge(tailwind, {
  config: {
    initialColorModeName: `light`,
  },
  colors: {
    primary: `#2f6f66`,
    secondary: `#5f6c80`,
    toggleIcon: tailwind.colors.gray[8],
    heading: `#172026`,
    divide: `#d5ddd8`,
    muted: `#edf3ef`,
    background: `#f7faf7`,
    text: `#202a32`,
    highlightLineBg: `rgba(0, 0, 0, 0.035)`,
    cardBgShade: `rgba(255, 255, 255, 0.88)`,
    warningBg: `#fff7e6`,
    warningBorder: `#d18b00`,
    ...lightThemeVars,
    modes: {
      dark: {
        text: tailwind.colors.gray[4],
        primary: `#8ed7cb`,
        secondary: `#8a9ab0`,
        toggleIcon: tailwind.colors.gray[4],
        background: `#172026`,
        heading: tailwind.colors.white,
        divide: tailwind.colors.gray[8],
        muted: tailwind.colors.gray[8],
        highlightLineBg: `rgba(255, 255, 255, 0.1)`,
        cardBgShade: `rgba(0, 0, 0, 0.80)`,
        warningBg: `#332600`,
        warningBorder: `#d18b00`,
        ...darkThemeVars,
      },
    },
  },
  fonts: {
    body: `Vazirmatn, -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
    heading: `Vazirmatn, -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif`
  },
  styles: {
    root: {
      '--theme-ui-colors-background': '#f7faf7',
      color: `text`,
      direction: `rtl`,
      backgroundColor: `background`,
      margin: 0,
      padding: 0,
      boxSizing: `border-box`,
      textRendering: `optimizeLegibility`,
      WebkitFontSmoothing: `antialiased`,
      MozOsxFontSmoothing: `grayscale`,
      WebkitTextSizeAdjust: `100%`,
      img: {
        borderStyle: `none`,
      },
      pre: {
        fontFamily: `monospace`,
        fontSize: `1em`,
      },
      a: {
        transition: `all 0.3s ease-in-out`,
        color: `text`,
        textUnderlineOffset: `0.18em`,
      },
    },
    p: {
      fontSize: [1, 1, 2],
      letterSpacing: `-0.003em`,
      lineHeight: `body`,
      "--baseline-multiplier": 0.179,
      "--x-height-multiplier": 0.35,
      wordBreak: `break-word`,
    },
    ul: {
      li: {
        fontSize: [1, 1, 2],
        letterSpacing: `-0.003em`,
        lineHeight: `body`,
        "--baseline-multiplier": 0.179,
        "--x-height-multiplier": 0.35,
      },
    },
    ol: {
      li: {
        fontSize: [1, 1, 2],
        letterSpacing: `-0.003em`,
        lineHeight: `body`,
        "--baseline-multiplier": 0.179,
        "--x-height-multiplier": 0.35,
      },
    },
    h1: {
      variant: `text.heading`,
      fontSize: [4, 5, 5, 6],
      mt: 4,
    },
    h2: {
      variant: `text.heading`,
      fontSize: [3, 4, 4, 5],
      mt: 4,
    },
    h3: {
      variant: `text.heading`,
      fontSize: [2, 3, 3, 4],
      mt: 4,
    },
    h4: {
      variant: `text.heading`,
      fontSize: [1, 2, 2, 3],
      mt: 3,
    },
    h5: {
      variant: `text.heading`,
      fontSize: [1, 2],
      mt: 3,
    },
    h6: {
      variant: `text.heading`,
      fontSize: 1,
      mb: 2,
    },
    blockquote: {
      borderInlineStartColor: `primary`,
      borderInlineStartStyle: `solid`,
      borderInlineStartWidth: `4px`,
      mx: 0,
      paddingInlineStart: 4,
      p: {
        fontStyle: `italic`,
      },
    },
    table: {
      width: `100%`,
      my: 4,
      borderCollapse: `separate`,
      borderSpacing: 0,
      th: {
        textAlign: `start`,
        py: `4px`,
        paddingInlineEnd: `4px`,
        paddingInlineStart: 0,
        borderColor: `muted`,
        borderBottomStyle: `solid`,
      },
      td: {
        textAlign: `start`,
        py: `4px`,
        paddingInlineEnd: `4px`,
        paddingInlineStart: 0,
        borderColor: `muted`,
        borderBottomStyle: `solid`,
      },
    },
    th: {
      verticalAlign: `bottom`,
      borderBottomWidth: `2px`,
      color: `heading`,
    },
    td: {
      verticalAlign: `top`,
      borderBottomWidth: `1px`,
    },
    hr: {
      mx: 0,
    },
    img: {
      borderRadius: `4px`,
      boxShadow: `lg`,
      maxWidth: `100%`,
    },
  },
  layout: {
    container: {
      padding: [3, 4],
      maxWidth: `1024px`,
    },
    content: {
      figure: {
        margin: 0,
        img: {
          borderRadius: `4px`,
          boxShadow: `lg`,
          maxWidth: `100%`,
        },
      },
    },
  },
  text: {
    heading: {
      fontFamily: `heading`,
      fontWeight: `heading`,
      lineHeight: `heading`,
      color: `heading`,
    },
  },
  copyButton: {
    backgroundColor: `background`,
    border: `none`,
    color: `text`,
    cursor: `pointer`,
    fontSize: [`14px`, `14px`, `16px`],
    fontFamily: `body`,
    letterSpacing: `0.025rem`,
    transition: `all 0.3s ease-in-out`,
    "&[disabled]": {
      cursor: `not-allowed`,
    },
    ":not([disabled]):hover": {
      bg: `primary`,
      color: `white`,
    },
    position: `absolute`,
    right: 0,
    zIndex: 1,
    borderRadius: `0 0 0 0.25rem`,
    padding: `0.25rem 0.6rem`,
  },
  dividers: {
    bottom: {
      borderBottomStyle: `solid`,
      borderBottomWidth: `1px`,
      borderBottomColor: `divide`,
      pb: 3,
    },
    top: {
      borderTopStyle: `solid`,
      borderTopWidth: `1px`,
      borderTopColor: `divide`,
      pt: 3,
    },
  },
  links: {
    secondary: {
      color: `secondary`,
      textDecoration: `none`,
      ":hover": {
        color: `heading`,
        textDecoration: `underline`,
      },
      ":focus": {
        color: `heading`,
      },
    },
    listItem: {
      fontSize: [1, 2, 3],
      color: `text`,
    },
  },
  card: {
    background: 'cardBgShade',
    border: `1px solid`,
    borderColor: `divide`,
    borderRadius: `8px`,
    boxShadow: `0 6px 24px rgba(23, 32, 38, 0.08)`,
  },
  cardWithP: {
    background: 'cardBgShade',
    border: `1px solid`,
    borderColor: `divide`,
    borderRadius: `8px`,
    boxShadow: `0 6px 24px rgba(23, 32, 38, 0.08)`,
    padding: [`1rem`, `1.25rem`, `1.5rem`],
  },
})

export default theme
