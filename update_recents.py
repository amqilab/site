#!/usr/bin/env python3
"""
Script to generate images.json file from the recents folder.
This lists all images with date-based filenames (YYYY-MM-DD_filename.ext)
"""

import os
import json
import re
from pathlib import Path

def main():
    # Path to the recents folder
    recents_dir = Path(__file__).parent / 'recents'
    
    # Pattern to match date-based filenames
    date_pattern = re.compile(r'^(\d{4}-\d{2}-\d{2})_(.+)\.(jpg|jpeg|png)$', re.IGNORECASE)
    
    # List to store image information
    images = []
    
    # Scan the recents folder
    if recents_dir.exists():
        for file in recents_dir.iterdir():
            if file.is_file():
                match = date_pattern.match(file.name)
                if match:
                    images.append({
                        'filename': file.name,
                        'date': match.group(1),
                        'name': match.group(2),
                        'ext': match.group(3).lower()
                    })
    
    # Sort by date (most recent first)
    images.sort(key=lambda x: x['date'], reverse=True)
    
    # Write to images.json
    output_file = recents_dir / 'images.json'
    with open(output_file, 'w') as f:
        json.dump(images, f, indent=2)
    
    print(f"Generated {output_file} with {len(images)} images")
    print(f"\nMost recent images:")
    for img in images[:5]:
        print(f"  - {img['date']}: {img['filename']}")

if __name__ == '__main__':
    main()
