# Mobile Navigation

## Scope

Replace the mobile hamburger navigation with a persistent four-item bottom
navigation. Keep desktop navigation and all existing page contents unchanged.
The approved browser mockup demonstrates navigation only; its sample dashboard
is not part of this change.

## Navigation

- Below the existing md breakpoint: Home (`/`), Books (`/books`), Decks
  (`/decks`), Community (`/community`), labeled 홈, 서재, 덱, 커뮤니티.
- Keep the existing Books destination; do not silently change it to
  `/books/library`. All `/books` descendants select 서재.
- Home matches exactly; other items match their path or path descendants.
- Show Lucide icons and labels. Mark the active link with `aria-current="page"`,
  primary color, and a short top indicator.
- Keep logo, theme switch, and profile/login in the mobile header. Remove the
  redundant hamburger menu. Desktop navigation remains unchanged.
- Render on existing TopNav surfaces: landing, main authenticated pages, and
  public community. Do not add it to login or deck create/edit layouts.
- Guests retain the current authentication behavior when opening private pages.

## Layout And Interaction

- Use existing theme tokens in both themes; no new palette or dependency.
- Reserve bottom space for the bar and the device safe area so final content
  and controls remain reachable. All four links have at least 44px touch targets.
- Keep the chat trigger above the bar, and constrain the open chat panel to
  available height. Preserve existing editor behavior where the bar is absent.
- Keep modal overlays above navigation; navigation must not intercept modal
  gestures or focus. Avoid covering focused inputs when the mobile keyboard opens.
- The bottom bar is persistent, not scroll-direction-sensitive.

## Verification

Check 320px and 390px mobile widths, a short viewport, desktop, and both themes.
Verify link destinations, active state on detail pages, safe-area padding,
scroll-to-bottom reachability, chat overlap, modal stacking, and editor exclusion.
Run lint and typecheck. Chromium emulation does not verify physical iPhone Safari
keyboard or inertial scrolling; retain that limitation in the verification report.

## Excluded

No login-home redesign, new dashboard, central create button, new routes,
backend changes, or automatic commit of implementation changes.
