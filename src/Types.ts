export interface InitialUserState {
  user: null | {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
}

export interface InitialChannelState {
  channelId: string | null;
  channelName: string | null;
}

export interface Message {
  timestamp: any;
  message: string;
  user: {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
  reactions?: {
    [emoji: string]: { uid: string; name: string }[];
  };
}