Textual-Theme-bd808
===================

A theme for the [Textual] IRC client.

Installation
------------

    git clone https://github.com/bd808/Textual-Theme-bd808.git
    cd Textual-Theme-bd808
    make install

In Textual, press `⌘,` to open the preferences. Click _Style_ then choose
_bd808_ from the list.

Compiling
---------
The css and js files are built from less and CoffeeScript respectively. To
recompile:

    npm install -g coffee-script
    npm install -g less
    make compile

Credits
-------
* Work started from the Simplified Light theme shipped with [Textual][].
* Color scheme based on the wonderful [Solarized][] color pallet.
* Other inspirations taken from:
  * [hbang/Simplified-Light-Modifications][]
  * [hbang/Sapientia-Modifications][]


[Textual]: http://www.codeux.com/textual/
[Solarized]: http://ethanschoonover.com/solarized
[hbang/Simplified-Light-Modifications]: https://github.com/hbang/Simplified-Light-Modifications
[hbang/Sapientia-Modifications]: https://github.com/hbang/Sapientia-Modifications

