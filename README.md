# communicator

Web-based app to scan documents locally and upload them to a Nextcloud account.

## Package Maintenance

- eslint needs to be @8.22.x because of "this.libOptions.parse is not a function" (see https://stackoverflow.com/a/73510759/8707976)
- lsass needs to be @1.32.x because of "Using / for division is deprecated and will be removed in Dart Sass 2.0.0" (see https://github.com/vuetifyjs/vuetify/issues/13694#issuecomment-846101335)