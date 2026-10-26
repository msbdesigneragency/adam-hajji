# Mobile refinement verification

## Scope

Mobile presentation only (320–768 CSS pixels). Existing copy, routes, photography, logo, colors, font families, scheduling rules, and dashboard behavior are preserved. Responsive overrides live in `app/mobile.css`; desktop rules in `app/globals.css` are unchanged. No dependencies were added.

## Rendered browser checks

A temporary same-origin iframe fixture provided exact CSS viewport widths independently of the desktop app zoom. The fixture is removed before delivery.

| Width | French hero height | Horizontal overflow | Carousel/CTA layout shift |
| ----- | -----------------: | ------------------- | ------------------------- |
| 320   |              781px | None                | None                      |
| 360   |              702px | None                | None                      |
| 375   |              710px | None                | None                      |
| 390   |              718px | None                | None                      |
| 414   |              741px | None                | None                      |
| 430   |              757px | None                | None                      |
| 768   |              872px | None                | None                      |

- All three slides checked at every listed width, with dedicated image positions for treatment, portrait, and reception.
- Both 640px and 844px viewport heights checked. Hero sizing follows content and image aspect ratio rather than viewport height.
- French, English, and Arabic checked at all listed widths; RTL checks account for the scrollbar appearing on the left.
- Major section and service-card bounds stay inside the layout viewport; service names are not clipped.
- Mobile navbar logo, appointment button and hamburger fit at every width. The 320px menu target remains inside its glass capsule.
- Menu includes all routes/languages, locks background scrolling, closes with Escape, and does not move the navbar when toggled.
- Fixed navbar remains about 12px from the viewport edge after scrolling.
- Hero controls are below the image and have 44px touch targets. Automatic advancement works after focus leaves the carousel and after explicitly pressing Play while focus remains on the control; hero geometry remains stable.
- Existing desktop hero, navbar, cards, portrait and clinic-image dimensions, typography and padding match baseline measurements.

## Booking and navigation

- Entire six-step demo booking completed at 320px, including a 640px short viewport.
- Required-field validation checked; patient inputs use 16px text to avoid automatic phone-browser zoom.
- Service choices have approximately 59px targets; date cells are at least 44px high; time slots are approximately 46px high.
- Progress remains sticky; summary stays in document flow and does not cover fields or controls.
- Service-page navigation and equivalent Arabic/English service-page language switching checked.
- FAQ expand/collapse checked; one shared navbar remains mounted.
- Browser console returned no errors during the inspected flow.
- Existing seven scheduling tests, TypeScript checks, production build, and all 43 route checks pass (with correct 404 responses for invalid routes).

## Verification limitation

The in-app browser repeatedly returned `Unable to capture screenshot` for viewport and full-page capture, including a fresh QA tab. Before/after image captures and visual screenshot comparison could not be completed. Rendered DOM geometry, clipping, responsive styles, and browser interactions were verified instead; no screenshot-based visual sign-off is claimed.
