#!/bin/bash
# This script generates all required icons from a source icon
# Requires ImageMagick: brew install imagemagick or apt-get install imagemagick

SOURCE_ICON="./icon.png"
OUTPUT_DIR="./public"

# Generate standard sizes
convert "$SOURCE_ICON" -resize 16x16 "$OUTPUT_DIR/favicon-16x16.png"
convert "$SOURCE_ICON" -resize 32x32 "$OUTPUT_DIR/favicon-32x32.png"
convert "$SOURCE_ICON" -resize 192x192 "$OUTPUT_DIR/icon-192.png"
convert "$SOURCE_ICON" -resize 384x384 "$OUTPUT_DIR/icon-384.png"
convert "$SOURCE_ICON" -resize 512x512 "$OUTPUT_DIR/icon-512.png"

# Generate Apple specific icons
convert "$SOURCE_ICON" -resize 180x180 "$OUTPUT_DIR/apple-icon.png"
convert "$SOURCE_ICON" -resize 1024x1024 "$OUTPUT_DIR/apple-splash.png"

# Generate favicon.ico (multi-size icon)
convert "$SOURCE_ICON" -resize 16x16 "$SOURCE_ICON" -resize 32x32 "$SOURCE_ICON" -resize 48x48 "$OUTPUT_DIR/favicon.ico"

echo "Icon generation complete!"

