{ pkgs }: {
  deps = [
    pkgs.google-cloud-sdk
    pkgs.firebase-tools
    pkgs.lsof
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.yarn
  ];
}