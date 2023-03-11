import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./CustomPalette";

function CustomContextPadProvider(contextPad) {
  contextPad.registerProvider(this);

  this.getContextPadEntries = function(element) {
    // no entries, effectively disable the context pad
    return {};
  };
}

CustomContextPadProvider.$inject = ["contextPad"];

export default {
  __init__: ["customContextPad", "customPalette"],
  customContextPad: ["type", CustomContextPad],
  customPalette: ["type", CustomPalette]
};
