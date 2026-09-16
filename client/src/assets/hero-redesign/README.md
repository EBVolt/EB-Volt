# EB Volt hero section

Replacement hero for the homepage. The wording is centred and sits in the lower band, the artwork is used unmodified, and the darkening is confined to the strip behind the text so the photograph stays visible.

## What is in this folder

| File | Purpose |
| --- | --- |
| `hero.html` | Standalone page. The block between the HERO comments is the part to copy. |
| `hero.css` | All styles for the section. Every class is prefixed `eb-` so nothing collides with existing site CSS. |
| `assets/hero-accra-1440w.jpg` | Artwork for desktop and tablet, 1440px wide, 437 KB. |
| `assets/hero-accra-900w.jpg` | Artwork for phones, 900px wide, 206 KB. |

## Integration

1. Copy `assets/hero-accra-1440w.jpg` and `assets/hero-accra-900w.jpg` into the site's image directory.
2. Copy `hero.css` into the stylesheet directory, or paste its contents into the existing stylesheet.
3. If the image directory is not a sibling of the stylesheet, update the three `url()` paths near the top of `hero.css`.
4. Copy the `<section class="eb-hero"> ... </section>` block from `hero.html` into the homepage template, replacing the current hero.
5. Confirm Poppins 400, 600 and 800 are loaded. If the site already uses a different brand typeface, change the `font-family` on `.eb-hero` and delete the Google Fonts links.
6. Point the two buttons at the correct routes. They are currently `/chargers` and `/app`.

## Two values to tune

Both sit at the top of `hero.css` on the `.eb-hero` rule.

`--eb-focal` controls vertical framing. The artwork is portrait and the hero is wide, so part of it is always cropped. At `0%` the frame sits at the top of the sky. At `16%` the pin and wordmark are well placed. Past roughly `35%` the wordmark starts leaving the frame on a laptop. The mobile breakpoint overrides this to `12%`.

`--eb-scrim` controls how much the photograph darkens behind the wording, from `0` to `1`. It is set to `.58`. Lower it if the image feels heavy, raise it if the headline loses contrast on bright screens.

## Known constraint

A tall portrait image in a wide hero is always cropped top and bottom, and how much depends on the visitor's screen. That is a property of the artwork, not the code.

Two ways to remove the constraint when there is time:

Commission a landscape crop of the same artwork at roughly 16:9, with the pin and logo composited at a size suited to a wide frame. Serve the portrait file to phones and the landscape file to desktop with a media query, and nothing important is ever cut.

Or reduce the hero to about `70vh` on desktop, which lessens how aggressively the image is cropped.

## Accessibility and performance notes

The background carries `role="img"` with a descriptive `aria-label`, since it conveys the brand mark rather than being decoration.

The scrim is marked `aria-hidden`.

Reduced motion preferences are respected on the button transitions.

The desktop image is preloaded in the head to avoid a flash of the fallback colour. The fallback colour is sampled from the artwork so the transition is not jarring on slow connections.

Both images are progressive JPEGs. If the build pipeline supports WebP or AVIF, converting them will cut roughly half the weight again.

## Suggested git workflow

```
git checkout -b feature/hero-redesign
# copy the files in as described above
git add .
git commit -m "Redesign homepage hero: centred copy, lower placement, reduced overlay"
git push -u origin feature/hero-redesign
```

Open a pull request, check the preview deployment on a phone, a tablet and a wide desktop, adjust `--eb-focal` if needed, then merge.
