#!/bin/bash

# For given Wikipedia Category page, list all URLs to subcategories listing coats of arms.
# Used to crawl all Czech municipality coats of arms on Wikimedia Commons.
curl -s $1 | \
    hxnormalize -x | \
    hxselect -s '\n' "a::attr(href)" | \
    grep 'href="/wiki/Category:SVG_coats_of_arms' | \
    sed 's/href="/https:\/\/commons.wikimedia.org/' | \
    sed 's/"$//'
