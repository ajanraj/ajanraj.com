# Organizing photographs

Edit `src/data/photography.json`. Upload images through the existing external workflow. Keep storage object names and locations unchanged.

## Create a trip

Add a trip to `trips`:

```json
{
  "id": "japan-2026-spring",
  "name": "Japan, spring",
  "startDate": "2026-04-01",
  "endDate": "2026-04-12",
  "introduction": "Notes from this visit.",
  "cover": "IMG_1234.jpg"
}
```

IDs use lowercase letters, digits and hyphens. Keep an ID unchanged when renaming a trip, since its URL is `/photos/trips/japan-2026-spring`. Give repeat visits separate IDs. Dates use `YYYY-MM-DD`, with the end on or after the start. Introduction and cover are optional.

## Assign and order photos

Each `photos` key is the exact storage object name, including any folder prefix. Membership lives only in the photo's `trip` field:

```json
"IMG_1234.jpg": {
  "trip": "japan-2026-spring",
  "order": 10,
  "alt": "Cherry trees along a canal in Kyoto",
  "camera": "Fujifilm X100VI"
}
```

Change `trip` to move a photo. Remove that field to return it to Unorganized, shown publicly as Other photographs. Keep its camera and alternative text. Before deleting a trip, clear or reassign every photo referencing it. If moving a cover photo, remove or replace the old trip's cover too.

Photos with a finite numeric `order` come first, lowest number first. Equal orders and unordered photos use newest upload first, then object name. Other photographs always uses newest upload first and object name, ignoring `order`. Trips use newest start date first, then ID.

A chosen cover must be assigned to its trip. If its storage object disappears, the first available photo in trip order becomes the cover. Missing objects are excluded from counts and tiles. The API's `warnings` list reports absent metadata keys with recovery instructions. Handwritten metadata remains intact. Restore the object under its original name or deliberately correct the metadata.

Empty trips have directly accessible empty galleries but no index card. Empty Other photographs links are hidden. With no trip definitions, the index shows unassigned photos directly.

## Cameras

Enter the camera for each photo independently of trip membership. Whitespace is trimmed; blank or omitted cameras display `Not specified`. No future upload inherits a camera automatically.

The camera baseline was read on 2026-09-08 using Wrangler's authenticated Cloudflare account and the read-only R2 object listing API, following all five pages. The inventory contained 86 image objects, most recently modified on 2025-09-14. Ajan confirmed that every object in that inventory was taken with iPhone 12 Pro Max. All 86 exact object names now have explicit camera entries. This establishes the collection present at the 2026-09-07 request without assigning a camera to later additions.

## Release metadata

Run `bun run photos:validate` while editing. It reports invalid IDs, dates, references, covers and ordering with the offending entry. Both `bun run check` and `bun run build` include this validation, without contacting live storage.

Run `bun run check`, `bun run test`, and `bun run build` before releasing. Commit the metadata and use the normal site release process. No separate database update or image migration is needed. Review the API's inventory warnings when inspecting an authorized live inventory; routine checks use fixtures.

The photo API lists all S3 or R2 pages before assembling the response. A storage failure returns an error, rather than a partial collection. The gallery offers retry. A failed individual image displays a separate message and leaves navigation usable.

## Refresh image dimensions

The generated `src/data/photo-dimensions.json` is separate from handwritten `photography.json`. To refresh it, use a complete local mirror of the original images, preserving exact object names and folder paths:

```bash
bun run photos:catalog /path/to/local/photos
bun run photos:validate
```

The command only reads local image files. It does not authenticate, download objects, upload, or deploy. Obtaining or refreshing a mirror from live storage requires explicit production-access authorization. Routine tests generate local fixtures and never use the live bucket.

The catalog records displayed width and height after EXIF orientation, original byte size, and a SHA-256 content hash. Unchanged files retain their entries. Changed bytes trigger a fresh measurement, even when the filename and byte size stay the same. Sharp is a development dependency used only by the command and tests; it is absent from the deployed request path.

Unreadable images and references missing from the mirror produce named diagnostics and a nonzero exit status. The command saves successful measurements and retains old entries for failed or absent images. Check that the mirror is complete, restore unreadable files, or deliberately correct stale references, then rerun. Neither editorial metadata nor original images are written. Invalid existing catalog entries stop the command before any write. The catalog file is replaced atomically after processing.

For an isolated fixture or alternate catalog, use `--output /path/to/dimensions.json --metadata /path/to/photography.json`. Output must be outside the mirror and must not target the editorial file. Review and commit the generated catalog with normal site changes.

Photos without dimensions stay visible in reserved uncropped frames. Invalid entries or a changed original byte size also fall back to a frame, with an API warning. Runtime size checks cannot detect a same-size replacement; refresh the local mirror and catalog after replacing originals. Refreshing dimensions is optional for publishing new uploads.

## Gallery and viewer

Photography uses up to 1120px independently of the reading column. Trip covers may crop, while gallery rows contain full images in curated order with 16px gutters. Below 600px, each photo occupies its own full-width row. Ordinary cataloged images use their natural proportions; extreme proportions retain the entire image within bounded frames. The final desktop row stays left aligned at no more than 260px high.

Open a photo with Enter or a tap. Arrow keys, previous/next buttons, and horizontal swipes loop within that collection. A one-photo collection omits navigation buttons. Escape or Close returns focus and scroll position to the originating photo. The dialog keeps focus inside, displays collection/position/camera details outside the image, and respects reduced motion.

The visual treatment draws on [Gallery Wall](https://opensourceui.in/components/gallery-wall), [Gallery Grid](https://opensourceui.in/components/gallery-grid), [Photo Contact Sheet](https://opensourceui.in/components/photo-contact-sheet), and [Photo Album](https://opensourceui.in/components/photo-album). No component source was copied.

## Browser verification

Run `bunx playwright install chromium` once, then `bun run test:e2e`. The tests start an isolated server on port 3029 with storage credentials cleared, intercept the existing photo API, and supply local image fixtures. They cover keyboard and touch journeys, focus restoration, cameras, failures, empty and single-photo trips, reduced motion, and layouts at 375px, 768px, and 1440px. Screenshots are written to ignored `test-results/` for visual inspection. They do not use a daily preview server or live images.
