export type ConnectUserType = {
  _id?: string;
  userId: string;
  fullName: string;
  headline: string;
  imageUrl: string;
  mutualCount?:number;
  onRemove: (id: string) => void;
};



export type ApiConnectionsType={
  connections:ConnectType[],
  totalConnections:number
}

export type ConnectType = {
  _id: string;
  user: ConnectUserType;
  requestedAt?: Date;
  connectedSince?: Date;
};
export type ApiSuggestion = {
  suggestions: ConnectType[];
};

export type ApiInvitesType = {
  invites: ConnectType[];
  totalIvites?: number;
};
export type RequestType = {
  _id: string;
 user:{
  userId: string;
  fullName: string;
  headline: string;
  imageUrl: string;
 }
  requestedAt: Date;
};

export type ApiRequestType = {
  requests: RequestType[];
  totalRequests?: number;
};
