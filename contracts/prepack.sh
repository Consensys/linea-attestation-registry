#!/bin/bash

# Create 'contracts' directory if it doesn't exist
mkdir -p contracts

# Copy the contents of 'src' into 'contracts'
cp -R src/* contracts/

# Create 'build' directory if it doesn't exist
mkdir -p build

# copy all JSON files from 'out' (including subdirectories) into 'build'
find out -name '*.json' -exec cp {} build \;
