import { AutoBind } from "../decorators/autobind";
import { validateInput } from "../utils/validator";
import { Component } from "./base-component";
import { projectState } from "./project-state";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  enteredTitle: string;
  enteredDescription: string;
  enteredPeopleNumber: number;

  constructor() {
    super("project-input", "app", "user-input", true);
    this.enteredTitle = "";
    this.enteredDescription = "";
    this.enteredPeopleNumber = 0;

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  renderContent() {}

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  @AutoBind
  private gatherUserInput(): {
    title: string;
    description: string;
    people: number;
  } {
    this.enteredTitle = this.titleInputElement.value;
    this.enteredDescription = this.descriptionInputElement.value;
    this.enteredPeopleNumber = +this.peopleInputElement.value;
    return {
      title: this.enteredTitle,
      description: this.enteredDescription,
      people: this.enteredPeopleNumber,
    };
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    let enteredValues = this.gatherUserInput();
    if (
      !validateInput({
        value: enteredValues.title,
        required: true,
        minLength: 2,
      }) ||
      !validateInput({ value: enteredValues.description, required: true }) ||
      !validateInput({
        value: enteredValues.people,
        required: true,
        min: 2,
        max: 8,
      })
    ) {
      alert("Invalid input please try again");
      return;
    }
    projectState.addProject(
      this.enteredTitle,
      this.enteredDescription,
      this.enteredPeopleNumber
    );
    this.clearInput();
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
}
