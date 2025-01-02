#!/bin/bash

# Build React app
echo "Building React app..."
npm run build

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy build files to dist
echo "Copying build files to dist..."
cp -r build/* dist/

# Copy Tizen config files
echo "Copying Tizen config files..."
cp config.xml dist/
cp icon.png dist/

# Create Tizen package
echo "Creating Tizen package..."
tizen package -t wgt -s smart-iptv -- dist

echo "Build complete!"
