export const ProjectFeedEvents = {
  PROJECT_FEED_UPDATED: 'project-feed-updated',
}

const dispatchEvent = (type: string, data?) => {
  let event = new CustomEvent(type, {detail: data});
  document.dispatchEvent(new CustomEvent(type));
}

export const ProjectFeedUpdated = () => {
  dispatchEvent(ProjectFeedEvents.PROJECT_FEED_UPDATED);
}