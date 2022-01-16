import { AutoBind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop";
import { Project } from "../models/project";
import { ProjectStatus } from "../states/project";
import { Component } from "./base-component";
import { ProjectItem } from "./project-item";
import { projectState } from "./project-state";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];
  constructor(private type: "active" | "finished") {
    super("project-list", "app", `${type}-projects`, false);

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    let listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem);
    }
  }
  @AutoBind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @AutoBind
  dropHandler(event: DragEvent) {
    let id = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      id,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  configure() {
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((p) =>
        this.type === "active"
          ? p.status === ProjectStatus.Active
          : p.status === ProjectStatus.Finished
      );
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
}
