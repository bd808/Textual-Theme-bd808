##
# Make links to phabricator

RE_PHAB = /([^/])\b([TMP]\d+)\b/g
HTML_PHAB = '$1<a href="https://phabricator.wikimedia.org/$2">$2</a>'

Textual.bind 'messageAddedToView', (line) ->
  if RE_PHAB.test line.innerHTML
    for e in line.querySelectorAll('.innerMessage')
      do (e) =>
        e.innerHTML = e.innerHTML.replace RE_PHAB, HTML_PHAB
