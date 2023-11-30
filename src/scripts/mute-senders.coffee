##
# De-emphasize messages from some senders
# TODO: find a way to manage the sender list via commands in client

MUTED = [
  'analytics-logbot',
  'antispammeta',
  'arseny',
  'asimovbot',
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
  'jinxer-wm',
  'jinxer-wm-test',
  'justberry',
  'krrrit-wm',
  'labs-morebots',
  'libel',
  'librenms-wmf',
  'logmsgbot_cloud',
  'mw-jenkinsbot',
  'nokib',
  'notefromgithub',
  'opendevreview',
  'paladox',
  'phabot',
  'phawikibugs',
  'phawkes',
  'pywikibugs',
  'services_bot',
  'shinken-wm',
  'sirenbot',
  'slander',
  'snitch',
  'stashbot',
  'stewardbot',
  'travis-ci',
  'wikibugs',
  'wikimediagithub',
  'wikipedia-github',
  'wikiphabot',
  'wm-bot',
  'wm-labs-meetbot',
  'wmf-insecte',
  'wmf-selenium-bot',
  'wmopbot',
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
