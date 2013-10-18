##
# Links gerrit:<id> to gerrit

RE_GERRIT = /\b(?:gerrit):(\S+)\b/ig
HTML_GERRIT = '<a href="https://gerrit.wikimedia.org/r/$1">$&</a>'

Textual.bind 'newMessagePostedToView', (line) ->
  if RE_GERRIT.test line.innerHTML
    line.innerHTML = line.innerHTML.replace RE_GERRIT, HTML_GERRIT
