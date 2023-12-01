// Generic type definitions and function for handling server responses.

export interface SuccessResponse<T> {
  type: "success";
  data: T;
}

export interface ErrorResponse<T> {
  type: "error";
  error: T;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse<T>;

/**
 * Since SuccessResponse and ErrorResponse doesn't have to be the same type
 * unknown is used there, to determine Response Type.
 * @returns true if response is a successResponse and false if it's not.
 */
export const isSuccessResponse = (
  response: Response<unknown>,
): response is SuccessResponse<unknown> => response.type === "success";

/**
 * Since SuccessResponse and ErrorResponse doesn't have to be the same type
 * unknown is used there, to determine Response Type.
 * @returns true if response is a errorResponse and false if it's not.
 */
export const isErrorResponse = (
  response: Response<unknown>,
): response is ErrorResponse<unknown> => response.type === "error";

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  type: "success",
  data,
});

export const createErrorResponse = <T>(error: T): ErrorResponse<T> => ({
  type: "error",
  error,
});
