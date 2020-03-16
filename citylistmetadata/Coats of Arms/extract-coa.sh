#!/bin/bash

# For given Wikimedia Commons page, extract all URLs that point to coats of arms
# TODO: Is the 'CoA' grep below too restrictive? Maybe we are missing some files because of it.
# TODO: The SVG filter is definitively too restrictive, some coats of arms are PNGs or even JPGs.
curl -s $1 | \
    hxnormalize -x | \
    hxselect -s '\n' 'a[href$=svg]::attr(href)' | \
    grep 'CoA' | \
    sed 's/href="/https:\/\/commons.wikimedia.org/' | \
    sed 's/"$//'
