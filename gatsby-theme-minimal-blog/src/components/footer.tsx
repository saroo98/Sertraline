/** @jsx jsx */
import { jsx, Link } from "theme-ui"
import HeaderTitle from "./header-title"

const Footer = () => {

  return (
    <footer
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `space-between`,
        mt: [5],
        height: '100%',
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
        variant: `cardWithP`,
        py: [4],
      }}
    >
      <div sx={{ height: '100%' }}>
        <div sx={{
          display: 'flex',
          flexDirection: `column`,
          alignItems: 'start',
          height: '100%'
        }}>
          <a target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fa">
            <img alt="Attribution-NonCommercial-ShareAlike 4.0 International License" src="data:image/png;base64,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" />
          </a>
        </div>
        <span>
          بعضی از حقوق محفوظ است.
        </span>
      </div>
      <div>
        <HeaderTitle />
      </div>
      <div sx={{
        display: 'flex',
        flexDirection: `column`,
        alignItems: 'end',
        height: '100%'
      }}>

        <div>
          <Link
            target="_blank"
            aria-label="Link to the technical maintainer of the blog"
            href="https://jourlog.xyz?utm_source=sertraline&utm_medium=footer"
          >
            <svg sx={{ width: '116px', height: 'auto', mb: '-1.2rem' }} xmlns="http://www.w3.org/2000/svg" id="jourlog_logo" viewBox="-30 -30 750 300" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
              <g id="Layer_x0020_1">
                <path className="path svgJDot" d="M115.61 0c-10.53,0 -21.05,0 -31.57,0 -4.34,0 -7.89,3.55 -7.89,7.89l0 6.91c13.15,0 26.3,0 39.46,0l0 -14.8z"></path>
                <path className="path svgJ" d="M76.15 47.35l-37.49 0 0 -13.81c0,-3.25 2.66,-5.92 5.92,-5.92l71.03 0 0 82.91c0,5.9 -4.82,10.85 -10.86,10.85l-85.02 0 -19.73 0 0 -9.87c0,-10.85 8.88,-19.73 19.73,-19.73l56.42 0 0 -44.43z"></path>
                <path className="path svgO" d="M129.93 27.62c17.75,0 35.51,0 53.27,0 16.28,0 29.6,13.32 29.6,29.6l0 19.76c0,2.71 -2.23,4.94 -4.94,4.94 -17.75,0 -35.51,0 -53.27,0 -16.27,0 -29.6,-13.32 -29.6,-29.6l0 -19.76c0,-2.72 2.22,-4.94 4.94,-4.94zm46.36 39.5l0 -24.7 -14.79 0 0 24.7 14.79 0z"></path>
                <path className="path svgU" d="M227.12 27.62l34.52 0 0 39.5 14.8 0 0 -39.5 32.56 0 0 54.3c-22.36,0 -44.72,0 -67.09,0 -10.85,0 -19.73,-8.88 -19.73,-19.73l0 -29.63c0,-2.72 2.22,-4.94 4.94,-4.94z"></path>
                <path className="path svgR" d="M406.19 50.92l-33.54 0 0 -8.5 -14.8 0 0 39.5 -39.46 0 0 -46.4c0,-4.35 3.55,-7.9 7.89,-7.9 26.63,0 53.27,0 79.91,0l0 23.3z"></path>
                <path className="path svgL" d="M415.57 14.8l-29.59 0 0 -14.8c23.02,0 46.04,0 69.06,0 0,31.25 0,50.66 0,81.92l-39.47 0c0,-26.32 0,-40.8 0,-67.12z"></path>
                <path className="path svgO2" d="M469.36 27.62c17.75,0 35.51,0 53.27,0 16.28,0 29.6,13.32 29.6,29.6l0 19.76c0,2.71 -2.23,4.94 -4.94,4.94 -17.75,0 -35.51,0 -53.27,0 -16.28,0 -29.6,-13.32 -29.6,-29.6l0 -19.76c0,-2.72 2.22,-4.94 4.94,-4.94zm46.36 39.5l0 -24.7 -14.79 0 0 24.7 14.79 0z"></path>
                <path className="path svgG" d="M617.18 81.92c-18.52,0 -37.04,0 -55.57,0l0 -49.36c0,-2.72 2.22,-4.94 4.94,-4.94 34.96,0 69.93,0 104.89,0 0,31.25 0,62.51 0,93.76l-109.83 0 -19.73 0 0 -9.87c0,-10.85 8.88,-19.73 19.73,-19.73l70.37 0 0 -44.43 -30.9 0 0 14.84 16.1 0 0 19.73z"></path>
              </g>
            </svg>
          </Link>
        </div>
        <span>
          {` `}
          پشتیبانی فنی از
          {` `}
          <Link
            target="_blank"
            aria-label="Link to the technical maintainer of the blog"
            href="https://jourlog.xyz?utm_source=sertraline&utm_medium=footer"
          >
            ژورلاگ
          </Link>
        </span>
      </div>
    </footer >
  )
}

export default Footer
