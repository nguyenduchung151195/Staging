export default class CustomPalette {
  constructor(create, elementFactory, palette) {
    this.create = create;
    this.elementFactory = elementFactory;
    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { create, elementFactory } = this;
    function createServiceTask(event) {
      const shape = elementFactory.createShape({ type: "bpmn:ServiceTask" });
      create.start(event, shape);
    }

    return {
      "create.service-task": {
        group: "activity",
        className: "bpmn-icon-service-task",
        title: "cacca",
        action: {
          dragstart: createServiceTask,
          click: createServiceTask
        }
      }
    };
  }
}

CustomPalette.$inject = ["create", "elementFactory", "palette"];
