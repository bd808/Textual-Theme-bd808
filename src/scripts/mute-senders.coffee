##
# De-emphasize messages from some senders
# TODO: find a way to manage the sender list via commands in client

MUTED = [
  'analytics-logbot',
  'danny_b',
  'ecmabot-wm',
  'gh-datavalues',
  'gh-wmde',
  'github',
  'github-wmde',
  'grrrit-wm',
  'icinga-wm',
  'ircnotifier',
  'krrrit-wm',
  'labs-morebots',
  'libel',
  'morebots',
  'mostbots',
  'mw-jenkinsbot',
  'paladox',
  'phabot',
  'phawikibugs',
  'phawkes',
  'pywikibugs',
  'qa-morebots',
  'services_bot',
  'shinken-wm',
  'snitch',
  'travis-ci',
  'wikibugs',
  'wikipedia-github',
  'wikiphabot',
  'wm-bot',
  'wm-labs-meetbot',
  'wmf-insecte',
  'wmf-selenium-bot',
  'zppix',
]

Textual.bind 'newMessagePostedToView', (line) ->
  e = line.querySelector('.sender')
  cleanNick = (nick) ->
    # Normalize to lowercase
    nick.toLowerCase()
    # Strip trailing ` and/or _
    .replace(/[`_]+$/, "")
    # Strip trailing |*
    .replace(/\|.*$/, "")
    # Strip trailing {*} and/or [*]
    .replace(/^(!\[|!\{)(.*)(\[.*\]|\{.*\})$/, "$2")
    # Strip trailing numbers
    .replace(/\d+$/, "")

  if (e && cleanNick( e.getAttribute('nickname') ) in MUTED)
    type = line.getAttribute 'ltype'
    line.setAttribute 'ltype', "#{type} muted"
  return
