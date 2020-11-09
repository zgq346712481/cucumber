#!/usr/bin/env bash
#
# This script removes classes from the contents of src/messages.ts.
# It is used to generate src/messages-readonly.ts - a lighter weight
# version of src/messages.ts that doesn't depend on Protobuf
#

keep="1"

while IFS= read line; do
  if [[ $line =~ "import" ]]; then
    :
  else
    if [[ $line =~ class.*{ ]]; then
      keep="0"
    fi
    if [ $keep = "1" ]; then
      if [[ $line =~ ^[[:space:]]*(interface|namespace|enum) ]]; then
        echo "export ${line}"
      else
        echo "${line}"
      fi
    fi
    if [[ $line =~ ^[[:space:]]*} ]]; then
      keep="1"
    fi
  fi
done < "${1:-/dev/stdin}"
