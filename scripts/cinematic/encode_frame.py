"""Lossy WebP delivery encoding; requires Pillow with WebP support."""
import sys
from PIL import Image
with Image.open(sys.argv[1]) as image:
    image.convert('RGB').save(sys.argv[2], 'WEBP', quality=83, method=5)
