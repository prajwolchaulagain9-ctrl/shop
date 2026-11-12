# Gautam storefront and shop management

The storefront uses Cormorant Garamond and Manrope served locally, an animated rendered footwear study, and the 44-second bilingual shop film. The render source and GLB model are included in `scripts/` and `public/media/studio/`.

Product images use Cloudinary. `public/media/manifest.json` maps the supporting photos, renders and film to verified Cloudinary URLs. New admin uploads go directly to Cloudinary through the protected upload route; large source photos are resized before upload to fit Vercel request limits.

## Configuration

Keep `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in the private `.env.local` file and deployment environment. Existing authentication and email settings remain in use. Never commit environment files or migration backups.

## Images

Run `node scripts/migrate-cloudinary.mjs` from this directory with the private environment configured. It verifies each upload before replacing the product URL, keeps originals in MongoDB collection `product_image_originals`, saves a private local backup in `.media-backups/`, and writes the supporting asset manifest. The migration can be resumed safely. The completed migration verified 45 products and 13 supporting assets.

## Commerce and administration

Customers sign in to add products and check out. Checkout offers Cash on Delivery and an optional WhatsApp eSewa enquiry. Order prices and product details are loaded from the database. Payment stays pending until collection is verified. Existing orders and account permissions are preserved.

Admin starts with orders. Product listing requests 12 rows at a time, search is debounced, and charts load only when Overview is opened. Product forms and tables scroll on small screens. The former public seed endpoint no longer clears the catalogue.

## Validation

Run `npm run lint` and `npm run build`. Run `node scripts/run-browser-check.mjs` for browser and API checks; it creates a temporary database using the configured MongoDB account, seeds synthetic users and copies public product data, checks shopping, permissions, image loading, product uploads and admin actions, then removes the temporary database and upload assets. It uses installed Chrome through Python Playwright. Generated screenshots and reports are in the ignored `test-results/` directory.
