const googleIt = require('google-it')

// For given municipality name, try to find a Czech Wikipedia page about it
function getWikiPage(munip, callback) {
    googleIt({'query': `${munip} wiki`, 'disableConsole': true}).then(results => {
        for (result of results) {
            if (result.link.startsWith("https://cs.wikipedia.org")) {
                callback(result.link)
                return
            }
        }
        callback(null)
    }).catch(e => {
        callback(null)
    })
}

getWikiPage("Město Boskovice", url => console.log(url))