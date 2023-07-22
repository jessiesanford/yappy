import { makeAutoObservable } from 'mobx';
import { AppPages } from '../util/enums';

export enum ProjectFilters {
  ALL = 'ALL',
  TRASHED = 'TRASH',
  ARCHIVED = 'ARCHIVED',
}

export class StudioStore {
  currentPage: AppPages = AppPages.PROJECTS;
  projectFilter: ProjectFilters = ProjectFilters.ALL;
  selectedProjectItems: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentPage(page: AppPages) {
    this.currentPage = page;
  }

  setProjectFilter(filter: ProjectFilters) {
    this.projectFilter = filter;
  }

  toggleProjectItemSelected = (id: string) => {
    const projectItems = [...this.selectedProjectItems];
    const index = projectItems.findIndex((projectId) => projectId === id);
    if (index !== -1) {
      projectItems.splice(index, 1);
    } else {
      projectItems.push(id);
    }
    this.selectedProjectItems = projectItems;
  };
}