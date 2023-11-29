export interface BaseAction {
  message: string;
}

export type SuccessfulAction = BaseAction & {
  type: "success";
};

export type ErrorAction = BaseAction & {
  type: "error";
  origin: "client" | "server";
};

export type BackendAction = SuccessfulAction | ErrorAction;
