export interface Section {
  name: string;
  start: number;
  end?: number;
  hidden?: boolean;
}

export interface Page {
  index: number;
  title: string;
}
