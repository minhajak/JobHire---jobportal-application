export interface CatchupUpdate {
  _id: string;
  userId: string;
  content: string;
  type: "achievement" | "job_change" | "work_anniversary" | "birthday" | "new_position";
  likes: string[];
  comments: Array<{
    _id: string;
    userId: string;
    content: string;
    createdAt: string;
  }>;
  congratulations: string[];
  createdAt: string;
  updatedAt: string;
  fullName: string;
  imageUrl: string;
}
