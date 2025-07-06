export interface IRegion {
  id: string;
  name: string;
}

export interface IPushWebsite {
  websiteId: string;
  url: string;
}

export interface IEvent {
  id: string;
  message: {
    id: string;
    url: string;
  };
}
