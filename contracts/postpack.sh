#!/bin/bash

# Check if 'contracts' directory exists and remove it
if [ -d "contracts" ]; then
  rm -rf contracts
  echo "contracts directory removed"
else
  echo "contracts directory does not exist"
fi

# Check if 'build' directory exists and remove it
if [ -d "build" ]; then
  rm -rf build
  echo "build directory removed"
else
  echo "build directory does not exist"
fi
