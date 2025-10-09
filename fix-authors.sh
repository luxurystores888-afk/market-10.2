#!/bin/sh

git filter-branch -f --env-filter '
OLD_NAME="luxurystores888git config --global user.email"
OLD_EMAIL="you@example.com"
CORRECT_NAME="luxurystores888-afk"
CORRECT_EMAIL="luxurystores888.afk@gmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ] || [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]; then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --all

