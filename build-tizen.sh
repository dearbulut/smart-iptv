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
cp public/icon.png dist/

# Create Tizen package
echo "Creating Tizen package..."
if ! command -v tizen &> /dev/null; then
    echo "Error: Tizen CLI not found. Please install Tizen Studio and add it to your PATH."
    exit 1
fi

cd dist
tizen package -t wgt -s SmartIPTV

echo "Build complete!"
