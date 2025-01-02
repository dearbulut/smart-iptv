#!/bin/bash

# Build React app
echo "Building React app..."
npm run build

# Create Tizen package directory
echo "Creating Tizen package..."
mkdir -p tizen-build
cp -r dist/* tizen-build/
cp config.xml tizen-build/
cp icon.png tizen-build/

# Create Tizen web app
echo "Creating Tizen web app..."
tizen create web-project -p tv-samsung-6.0 -t BasicEmptyProject -n SmartIPTV

# Package for Tizen
echo "Packaging for Tizen..."
tizen package -t wgt -s YOUR_CERTIFICATE_PROFILE -- tizen-build

# Clean up
echo "Cleaning up..."
rm -rf tizen-build

echo "Build complete. The .wgt file is ready for installation on your Samsung TV."

# Optional: Install on TV (uncomment and modify as needed)
# TV_IP="YOUR_TV_IP"
# echo "Installing on TV at ${TV_IP}..."
# tizen install -n SmartIPTV.wgt -t ${TV_IP}
