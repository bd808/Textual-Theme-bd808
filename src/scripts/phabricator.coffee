##
# Make links to phabricator

RE_PHAB = /\b([TMP]\d+)\b/g
HTML_PHAB = '<a href="https://phabricator.wikimedia.org/$1">$&</a>'

Textual.bind 'newMessagePostedToView', (line) ->
  if RE_PHAB.test line.innerHTML
    line.innerHTML = line.innerHTML.replace RE_PHAB, HTML_PHAB
