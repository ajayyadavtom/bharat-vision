#!/bin/bash
find app components src -type f -name '*.tsx' | while read file; do
  sed -i 's/text-white/text-slate-900 dark:text-white/g' " \\
