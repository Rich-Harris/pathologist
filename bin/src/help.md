Pathologist version __VERSION__
=====================================

Usage: pathologist <entry file>

Basic options:

-v, --version            Show version number
-h, --help               Show this help message
-i, --input              Input (alternative to <entry file>)
-o, --output <output>    Output (if absent, prints to stdout)

Examples:

# Compile input.svg to output.svg
pathologist input.svg > output.svg

# Compile all the files in input-files/ to output-files/
pathologist -i input-files -o output-files

For more information visit http://gitlab.com/Rich-Harris/pathologist
