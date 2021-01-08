// https://stackoverflow.com/a/59576534
// This file allows for customization of HTML contents on the pages for other users of the app.
// If the HTML strings are not empty, they wil be rendered on their appropriate pages, instead of the "default" HTML in the .Vue files.
// When making nontrivial changes, it is suggested to open the app in hot-reload mode (for example, via docker-compose using the .dev.yml file)
// Then, edit the HTML in the .Vue file as needed and then copy+paste the resulting HTML here. 
// Note that the .css from the .Vue file will be reused; but this can be worked around using the "style" attribute on HTML elements.

// Do not delete the fields with empty strings, else the app will crash!
export default {
    aboutAppHtml: ``,
    whyHtml: ``,
    contactHtml: ``,
    aboutUsHtml: ``,
    footerHtml: ``
}