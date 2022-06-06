import { IHttpResponse } from '../ports/IHttpResponse'

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})

export const unauthorized = (error: any): IHttpResponse => ({
  statusCode: 401,
  body: error
})

export const serverError = (error: any): IHttpResponse => ({
  statusCode: 500,
  body: error
})