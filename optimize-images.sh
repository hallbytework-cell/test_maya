#!/bin/bash

# Image Optimization Script
# Converts JPG/PNG to WebP and creates responsive versions
# Requirements: ImageMagick (convert command) or ffmpeg

set -e

INPUT_DIR="${1:-.}"
OUTPUT_DIR="${2:-./optimized}"
QUALITY="${3:-75}"

echo "🖼️  Image Optimization Tool"
echo "================================"
echo "Input Directory: $INPUT_DIR"
echo "Output Directory: $OUTPUT_DIR"
echo "Quality: $QUALITY"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to convert and resize image
optimize_image() {
    local input="$1"
    local basename=$(basename "$input" | sed 's/\.[^.]*$//')
    
    echo "Processing: $input"
    
    # Detect image extension
    if [[ "$input" == *.jpg ]] || [[ "$input" == *.jpeg ]]; then
        # JPG processing
        echo "  → Creating WebP..."
        ffmpeg -i "$input" -c:v libwebp -quality $QUALITY -y "${OUTPUT_DIR}/${basename}.webp" 2>/dev/null
        
        # Create responsive sizes
        echo "  → Creating responsive sizes..."
        # Small (400px)
        convert "$input" -resize 400x -quality $QUALITY "${OUTPUT_DIR}/${basename}-400w.jpg" 2>/dev/null
        
        # Medium (600px)
        convert "$input" -resize 600x -quality $QUALITY "${OUTPUT_DIR}/${basename}-600w.jpg" 2>/dev/null
        
        # Large (1200px)
        convert "$input" -resize 1200x -quality $QUALITY "${OUTPUT_DIR}/${basename}-1200w.jpg" 2>/dev/null
        
        # WebP variants
        ffmpeg -i "${OUTPUT_DIR}/${basename}-400w.jpg" -c:v libwebp -quality $QUALITY -y "${OUTPUT_DIR}/${basename}-400w.webp" 2>/dev/null
        ffmpeg -i "${OUTPUT_DIR}/${basename}-600w.jpg" -c:v libwebp -quality $QUALITY -y "${OUTPUT_DIR}/${basename}-600w.webp" 2>/dev/null
        ffmpeg -i "${OUTPUT_DIR}/${basename}-1200w.jpg" -c:v libwebp -quality $QUALITY -y "${OUTPUT_DIR}/${basename}-1200w.webp" 2>/dev/null
        
        echo "  ✅ Created: WebP + 400w, 600w, 1200w variants"
        
    elif [[ "$input" == *.png ]]; then
        # PNG processing
        echo "  → Creating WebP..."
        ffmpeg -i "$input" -c:v libwebp -lossless 0 -quality $QUALITY -y "${OUTPUT_DIR}/${basename}.webp" 2>/dev/null
        
        # Create responsive sizes
        echo "  → Creating responsive sizes..."
        convert "$input" -resize 400x -define png:color-type=2 "${OUTPUT_DIR}/${basename}-400w.png" 2>/dev/null
        convert "$input" -resize 600x -define png:color-type=2 "${OUTPUT_DIR}/${basename}-600w.png" 2>/dev/null
        convert "$input" -resize 1200x -define png:color-type=2 "${OUTPUT_DIR}/${basename}-1200w.png" 2>/dev/null
        
        echo "  ✅ Created: WebP + 400w, 600w, 1200w PNG variants"
    fi
}

# Process all images in directory
find "$INPUT_DIR" -maxdepth 1 \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read img; do
    optimize_image "$img"
done

echo ""
echo "✅ Optimization complete!"
echo "Output directory: $OUTPUT_DIR/"
echo ""
echo "📊 File sizes:"
du -sh "$OUTPUT_DIR"
echo ""
echo "💡 Next steps:"
echo "1. Copy optimized images to public/images/"
echo "2. Update image paths in components"
echo "3. Add srcset and width/height attributes"
echo "4. Test on different screen sizes"
