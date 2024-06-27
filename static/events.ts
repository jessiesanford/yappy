export const ProjectFeedEvents = {
  PROJECT_FEED_UPDATED: 'project-feed-updated',
}

const dispatchEvent = (type: string, data?) => {
  document.dispatchEvent(new CustomEvent(type, {detail: data}));
}

export const ProjectFeedUpdated = () => {
  dispatchEvent(ProjectFeedEvents.PROJECT_FEED_UPDATED);
}