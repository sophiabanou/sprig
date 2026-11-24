# Sprig

A simple todo app for personal use.

## Stack

* React with Vite
* CSS modules for styling, using the tokens in `src/styles/theme.css`
* Zustand for state
* GSAP for animations
* Hash routes (`#/habits`, `#/tasks`, `#/notes`, `#/work`, `#/settings`) through the `useRoute` hook, so GitHub Pages needs no server fallback

Scripts: `npm run dev`, `npm run build`, `npm run preview`.

## Deploy

GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`. The app is served from `/sprig/`, set as `base` in `vite.config.js`. Use `import.meta.env.BASE_URL` for any absolute asset path.

## Theme

* The look uses pastel tags, a purple accent and near black buttons, with 1px borders and compact rows.
* Every button and button group is a pill (`--radius-pill`). Buttons lift onto a hard ink shadow (`--fg`) on hover and flatten when pressed, through `useLiftHover`. Buttons that open a dropdown or sit inside a control (the number stepper) pass `hasLift={false}` and only tint on hover.
* Light is the default. Dark mode is turned on by the theme switch, which sets `data-theme="dark"` on the html element. The OS setting does not change the theme.
* Every color must be a token in the palette in `theme.css`, with a value for both light and dark. No hex, rgb, hsl or named colors anywhere else, including inline styles and GSAP tweens.
* Pastel color per item goes through the tone utilities in `src/styles/tones.css` (`getToneClass(color)` gives the class), and children read `--tone-bg` and `--tone-fg` (a fill and the ink on it) or `--tone-solid` (the tone shown directly on a surface).
* Never hardcode fonts, radii or spacing in components either. Use the variables from `theme.css`, and add a new token there when one is missing.

## Accessibility

Check accessibility on every change.

* Contrast must meet WCAG AA in both themes: 4.5:1 for text, 3:1 for large text, icons and control boundaries. Check every new or changed token pair.
* Borders that identify a control (inputs, checkboxes, switch tracks) use `--border-control`. `--border` and `--border-strong` are only for decoration.
* Use semantic HTML first (`button`, `label`, `ul`, headings in order). Add ARIA only when no element fits.
* Everything works with the keyboard alone, in a logical order, with a visible focus state using `--focus-ring`.
* Every control has an accessible name that matches its visible text and does not change with its state. The one exception is the theme switch on the settings page, whose label reads Light mode or Dark mode to match the theme.
* Icon only buttons need an `aria-label`. Decorative icons get `aria-hidden="true"`.
* Never use color alone to show state. Pair it with text, an icon or a shape.
* Every animation respects `prefers-reduced-motion` through `usePrefersReducedMotion`. Hover transitions respect it through the motion tokens, which drop to 0ms under reduced motion.
* Announce changes that happen out of view (a task added, a task deleted) with a polite live region.

## Responsiveness

* Use `max-width` media queries only, with these breakpoints and no others: 1920, 1400, 1200, 992, 768, 576, 400.
* Write them as plain values, for example `@media (max-width: 768px)`.
* The only other media query allowed is `prefers-reduced-motion`, in `theme.css`.

## Typography

* The project uses one font only: Manrope, through the `--font-family` token. Do not add other fonts or font tokens.
* Text styles are global utility classes in `src/styles/typography.css`: `textDisplay`, `textDisplayLight`, `textTitle`, `textHeading`, `textHeadingBold`, `textSubtitle`, `textBody`, `textButton`, `textTag`, `textLabel`, `textCaption`. Use them in JSX with `className="textBody"` and combine with module classes when needed.
* Page titles use `textDisplay` with `textDisplayLight` for the lead word. The line under a page title uses `textSubtitle`. List headings use `textHeadingBold` in the default text color. The title of each habit or task row uses `textButton`. Tags use `textTag`, which matches the button size at a lighter weight since tags are not buttons. Sidebar links use `textButton`.
* Body text uses only `textBody`. Do not create other body text classes or variants.
* Do not set font size, family or weight in CSS modules. Add or change a utility instead.
* The html element sets `font-size: 62.5%`, so 1rem is 10px at the default browser size (1.4rem is 14px). Font size tokens are always in rem.
* Font sizes come from the `--text-*` tokens in `theme.css`. They decrease once, at 768px, and that is the only place font sizes change.

## Writing

* No dashes in any text: UI copy, comments, docs and this file. Rewrite the sentence instead of using a dash.

## Comments

* Comments are only section dividers or short notes that explain a complex function.
* Do not comment obvious code.

## Components and hooks

* Everything that can be a component should be a component. Everything that can be a hook should be a hook.
* Memoize everything that should be: wrap components in `memo`, use `useCallback` for handlers passed as props and `useMemo` for derived values that are costly or passed as props.
* Select single values from Zustand stores (`useStore((state) => state.value)`) so components only rerender when that value changes.
* Destructure props safely in the signature with defaults: `function Card({ title = '', items = [] } = {})`.
* Animations go through hooks in `src/hooks` that wrap GSAP. Respect `prefers-reduced-motion`.
* Any animation that is more than a simple fade or color change uses GSAP, hover effects included. When GSAP needs a color, tween a numeric CSS variable and let the CSS turn it into the color, so colors stay out of the tweens.
* Simple hover changes (one color or background) are the one exception: they use a CSS `transition` so they never snap. Transition only the properties that change (for example `transition: background-color var(--duration-hover) var(--ease-hover)`), always with the `--duration-hover` and `--ease-hover` tokens. Never use `transition: all` or hardcoded timings.
* When GSAP tweens a property that also has a CSS transition, set `transition: 'none'` for the tween and clear it afterwards so the two do not fight.

## Naming

* Components: PascalCase, one folder per component holding `index.jsx` and `Name.module.css`. Import the folder, for example `import Icon from '../Icon'`.
* Hooks: camelCase starting with `use`, one per file, named export.
* Stores: `use<Name>Store` in `src/store`.
* Booleans start with `is`, `has` or `should`.
* Event handler props are `on<Event>`; the functions that handle them are `handle<Event>`.
* Refs end with `Ref`.
* CSS module classes are camelCase.
* Constants are UPPER_SNAKE_CASE.

## Icons

* Icons are our own SVGs, drawn as duotone layers on a 24 by 24 grid (a soft fill, a solid fill or a line, each with an ink outline) and stored in `src/assets/icons/icons.js`. Do not install an icon library.
* Render icons through the shared `Icon` component so size and stroke width are the same everywhere.
* List headings use larger illustrations instead: layered SVGs on a 48 by 48 grid in `src/assets/icons/illustrations.js`, rendered through `Illustration`. Each layer has a kind that picks its token colors and an optional motion that `useIllustrationLoop` plays.
* Entrance animations share their ease, duration, distance and delays through `src/utils/motion.js`.

## Folder structure

Components and assets are grouped by how they are used.

```
src/
  components/
    ui/          generic reusable pieces (buttons, inputs, switches, tags)
    layout/      app structure (header, page shell)
    features/    pieces tied to one feature, in a folder per feature (todos/)
  hooks/         custom hooks
  store/         Zustand stores
  styles/        theme tokens and global styles
  utils/         pure helpers with no React (dates)
  assets/
    icons/       custom icons not in the icon set
    images/
```

Create a folder only when the first file for it exists.

## Wrapping up

When the user says "wrap up" or anything similar:

1. Review the changed code against every rule in this file and fix what does not follow them.
2. Check accessibility: contrast of any new colors, keyboard use, focus states, names and labels.
3. Run `npm run build` and make sure it passes.
4. Give a short commit name using Conventional Commits, for example `feat(todos): add task list`.

Do not commit unless the user asks.
