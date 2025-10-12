const Module = require("module");
const originalRequire = Module.prototype.require;

Module.prototype.require = function patchedRequire(specifier, ...rest) {
  if (specifier === "next/document") {
    console.error("[trace-next-document] Required from:", this.id);
    console.error(new Error("trace stack").stack);
  }
  return originalRequire.call(this, specifier, ...rest);
};

