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
  scanservjs: {
    baseUrl: "http://localhost:8080",
    request: {
      version: "2.21.0",
      params: {
        deviceId: "genesys:libusb:001:003",
        resolution: 300,
        top: 0,
        left: 0,
        width: 210,
        height: 297,
        mode: "Color",
        source: "Flatbed",
        brightness: 25,
        contrast: 25,
      },
      filters: [],
      pipeline: "PDF (JPG | @:pipeline.low-quality)",
      batch: "manual",
      index: 1,
    },
  },
};
