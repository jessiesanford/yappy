import { makeAutoObservable } from 'mobx';
import { AppPages } from '../static/enums';

export enum ProjectFilters {
  ALL = 'ALL',
  TRASHED = 'TRASH',
  ARCHIVED = 'ARCHIVED',
}

export class StudioStore {
  currentPage: AppPages = AppPages.PROJECTS;
  projectFilter: ProjectFilters = ProjectFilters.ALL;
  selectedProjectItems: string[] = [];
  processingStatus: { hidden: boolean, msg: string | undefined } = { hidden: true };

  constructor() {
    makeAutoObservable(this);
  }

  setProcessingStatus(hidden: boolean, msg: string) {
    this.processingStatus = { hidden, msg };
  }

  resetProcessingStatus(timeout = 0) {
    setTimeout(() => {
      this.processingStatus = { hidden: true, msg: '' };
    }, timeout);
  }

  setCurrentPage(page: AppPages) {
    this.currentPage = page;
  }

  setProjectFilter(filter: ProjectFilters) {
    this.projectFilter = filter;
    this.setSelectedProjectItems([]);
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

  setSelectedProjectItems = (ids: string[]) => {
    this.selectedProjectItems = ids;
  }
}