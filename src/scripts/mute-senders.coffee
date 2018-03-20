##
# De-emphasize messages from some senders
# TODO: find a way to manage the sender list via commands in client

MUTED = [
  'analytics-logbot',
  'antispammeta',
  'arseny',
  'cerebrumbot',
  'cp',
  'cyberpower',
  'danny_b',
  'ecmabot-wm',
  'eir',
  'gh-datavalues',
  'gh-wmde',
  'github',
  'github-wmde',
  'grrrit-wm',
  'guest',
  'icinga-wm',
  'ircnotifier',
  'justberry',
  'krrrit-wm',
  'labs-morebots',
  'libel',
  'librenms-wmf',
  'mw-jenkinsbot',
  'paladox',
  'phabot',
  'phawikibugs',
  'phawkes',
  'pywikibugs',
  'services_bot',
  'shinken-wm',
  'slander',
  'snitch',
  'stashbot',
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

Textual.bind 'messageAddedToView', (line) ->
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

  if (e && cleanNick( e.getAttribute('data-nickname') ) in MUTED)
    type = line.getAttribute 'data-line-type'
    line.setAttribute 'data-line-type', "#{type} muted"
  return
