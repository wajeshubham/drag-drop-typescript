import { Project } from "../models/project";
import { ProjectStatus } from "../states/project";

type listener = (Items: Project[]) => void;

export class ProjectState {
  private listeners: listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFunc: listener) {
    this.listeners.push(listenerFunc);
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListener();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListener();
    }
  }

  private updateListener() {
    for (const listenerFunc of this.listeners) {
      listenerFunc(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
