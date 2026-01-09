#!/bin/bash
# Script pour remplacer PUT par POST dans toutes les pages admin
find app/admin -name "*.tsx" -type f | while read file; do
  if grep -q 'method.*"PUT"' "$file"; then
    echo "Fixing $file"
    sed -i 's/method: "PUT"/method: "POST"/g' "$file"
  fi
done
echo "Done!"
