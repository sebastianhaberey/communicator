module.exports = {
  server: {
    port: 3000,
    staticDirectory: "./frontend",
  },
  webdav: {
    username: "username",
    password: "password",
    files: {
      url: "https://nextcloud.foo.com/remote.php/dav/files/username",
    },
  },
  workDirectory: "./files",
};
