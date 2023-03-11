export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector) {
    this.create = create;
    this.elementFactory = elementFactory;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get("autoPlace", false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const { autoPlace, create, elementFactory } = this;

    function appendServiceTask(event, element) {
      appendServiceTaskStart(event, element);
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: "bpmn:ServiceTask" });

        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: "bpmn:ServiceTask" });
      create.start(event, shape, element);
    }

    return {
      "append.service-task": {
        group: "model",
        className: "bpmn-icon-service-task",
        title: "cacca",
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  "config",
  "contextPad",
  "create",
  "elementFactory",
  "injector"
];
