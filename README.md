# Bookmarks

Self-contained start page replacement.

## Syntax

Categories starts WITHOUT any spacing characters
and bookmarks starts WITH spacing character (space or tab)
and splitted by spacing character as well.
So the urls MUST NOT have spaces itself.
Spaces before and after text are trimmed and empty lines are ignored.

```
Some category
  Some site    http://somesite.com

Some another category
  Some another site    http://another-somesite.com/?q=hello%20world
  And another one      http://another-one-somesite.com
```

## Building

    npm run build

## Hacking

To get 'rebuild on change' behavior run

    npm run dev
